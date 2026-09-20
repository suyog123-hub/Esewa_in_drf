from django.urls import path
from .views import *

urlpatterns = [
    path("product/", ProductListAPIView.as_view(), name="get_products"),
    path("product/<int:product_id>/", ProductDetailAPIView.as_view(), name="get_product"),

    path("cart/view/<int:user_id>/", CartDetailAPIView.as_view(), name="get_cart"),
    path("cart/add/<int:user_id>/", AddToCartAPIView.as_view(), name="add_to_cart"),
    path("cart/remove/<int:user_id>/", RemoveFromCartAPIView.as_view(), name="remove_from_cart"),
    path("cart/clear/<int:user_id>/", CartClearAPIView.as_view(), name="clear_cart"),

    path("esewa/success/", EsewaSuccessAPIView.as_view(), name="esewa_success"),
    path("esewa/failure/", EsewaFailureAPIView.as_view(), name="esewa_failure"),

]
