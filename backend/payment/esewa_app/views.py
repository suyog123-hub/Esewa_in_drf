from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import CartSerializer, ProductSerializer
from django.conf import settings
import uuid
import base64
import hashlib
import hmac
from decimal import Decimal


def generate_esewa_signature(secret_key: str, fields: dict, signed_field_names: str) -> str:
    message = ",".join(
        f"{field}={fields.get(field, '')}"
        for field in [name.strip() for name in signed_field_names.split(",")]
    )
    return base64.b64encode(
        hmac.new(
            secret_key.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha256,
        ).digest()
    ).decode()
# =====================================================
#  PRODUCT VIEWS
# =====================================================

class ProductListAPIView(APIView):
    """GET: List all products"""

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self , request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailAPIView(APIView):
    """GET: Single product details"""

    def get(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)


# =====================================================
#  CART VIEWS
# =====================================================

class CartDetailAPIView(APIView):
    """GET: List all items in a user's cart"""
    ESewa_SECRET_KEY = getattr(settings, 'ESEWA_SECRET_KEY', '8gBm/:&EnhH.1/q')

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        cart, _ = Cart.objects.get_or_create(user=user)
        amount = 0
        for item in cart.items.all():
            amount += item.product.price * item.quantity
        amount = round(amount, 2)
        vat = round(amount * Decimal('0.13'), 2)
        service_charge = 0
        delivery_charge = 100
        total_amount = round(amount + vat + service_charge + delivery_charge, 2)
        transaction_uuid = str(uuid.uuid4())
        product_code = "EPAYTEST"
        signed_field_names = "total_amount,transaction_uuid,product_code"

        # Signature: base64(HMAC-SHA256(secret, "total_amount=..,transaction_uuid=..,product_code=.."))
        signature = generate_esewa_signature(
            self.ESewa_SECRET_KEY,
            {
                "total_amount": total_amount,
                "transaction_uuid": transaction_uuid,
                "product_code": product_code,
            },
            signed_field_names,
        )
        payment = {
            "amount": amount,
            "tax_amount": vat,
            "total_amount": total_amount,
            "transaction_uuid": transaction_uuid,
            "product_code": product_code,
            "product_service_charge": service_charge,
            "product_delivery_charge": delivery_charge,
            "success_url": f"http://127.0.0.1:8000/esewa/success/?user_id={user.id}",
            "failure_url": f"http://127.0.0.1:8000/esewa/failure/?user_id={user.id}",
            "signed_field_names": signed_field_names,
            "signature": signature,
        }
        serializer = CartSerializer(cart)
        data = serializer.data
        data["payment"] = payment
        return Response(data, status=status.HTTP_200_OK)


class AddToCartAPIView(APIView):
    """POST: Add a product to a user's cart"""

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        product_id = request.data.get('product_id')

        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = get_object_or_404(Product, id=product_id)
        cart, _ = Cart.objects.get_or_create(user=user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            item.quantity += 1
            item.save()

        return Response(
            {'message': 'Product added to cart successfully'},
            status=status.HTTP_200_OK
        )


class RemoveFromCartAPIView(APIView):
    """POST: Remove an item from a user's cart"""

    def post(self, request, user_id):
        get_object_or_404(User, id=user_id)
        item_id = request.data.get('item_id')

        if not item_id:
            return Response(
                {'error': 'item_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        deleted, _ = CartItem.objects.filter(
            id=item_id, cart__user_id=user_id
        ).delete()

        if not deleted:
            return Response(
                {'error': 'Item not found in your cart'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {'message': 'Product removed from cart successfully'},
            status=status.HTTP_200_OK
        )

class CartClearAPIView(APIView):
    """POST: Clear all items from a user's cart"""

    def post(self, request, user_id):
        get_object_or_404(User, id=user_id)
        cart = get_object_or_404(Cart, user_id=user_id)
        cart.items.all().delete()

        return Response(
            {'message': 'Cart cleared successfully'},
            status=status.HTTP_200_OK
        )


# =====================================================
#  eSEWA PAYMENT CALLBACKS
# =====================================================

class EsewaCallbackApiView(APIView):
    """Base view shared by the eSewa success/failure callbacks."""
    ESewa_SECRET_KEY = getattr(settings, 'ESEWA_SECRET_KEY', '8gBm/:&EnhH.1/q')

    def _is_signature_valid(self, params: dict) -> bool:
        signed_field_names = params.get('signed_field_names', '')
        if not signed_field_names:
            return False
        expected = generate_esewa_signature(
            self.ESewa_SECRET_KEY, params, signed_field_names
        )
        return hmac.compare_digest(expected, params.get('signature', ''))

    def get(self, request):
        params = request.GET
        if params.get('status') == 'COMPLETE' and self._is_signature_valid(params):
            self._on_success(params)
            return Response(
                {'message': 'Payment verified successfully', 'data': params},
                status=status.HTTP_200_OK,
            )
        return Response(
            {'message': 'Payment not completed or invalid signature'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def _on_success(self, params):
        raise NotImplementedError


class EsewaSuccessAPIView(EsewaCallbackApiView):
    """eSewa redirects here after a successful payment."""

    def _on_success(self, params):
        user_id = params.get('user_id')
        if user_id and user_id.isdigit():
            Cart.objects.filter(user_id=int(user_id)).delete()


class EsewaFailureAPIView(EsewaCallbackApiView):
    """eSewa redirects here when the payment fails or is cancelled."""

    def get(self, request):
        return Response(
            {'message': 'Payment was not completed'},
            status=status.HTTP_400_BAD_REQUEST,
        )
