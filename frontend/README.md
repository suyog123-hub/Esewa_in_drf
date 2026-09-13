# Payment Shop - Frontend (React + Vite)

React frontend mirrored to the DRF backend at `backend/payment`.

## Backend mirror

Backend lives at `backend/payment` (Django 6.1 + DRF):
- `esewa_app/models.py` -> Product, Cart, CartItem
- `esewa_app/serializers.py` -> ProductSerializer, CartSerializer
- `esewa_app/views.py` -> 6 APIViews
- `esewa_app/urls.py` -> routes

Frontend mirrors this with:

```
frontend/
  vite.config.js          # dev server + /api proxy -> http://127.0.0.1:8000
  src/
    api/
      client.js           # axios instance, baseURL = VITE_API_BASE_URL
      products.js         # productApi.list(), getById()  -> GET /product/ etc.
      cart.js             # cartApi.getCart(), addToCart(), removeFromCart(), clearCart()
      index.js            # barrel export (like urls.py)
    context/
      CartContext.jsx     # global cart state + all cart APIs wired
    hooks/
      useProducts.js      # wrappers for productApi
    components/
      Navbar.jsx
      ProductCard.jsx
      Loader.jsx
      ErrorBanner.jsx
    pages/
      ProductList.jsx     # GET /product/
      ProductDetail.jsx   # GET /product/:id/
      Cart.jsx            # GET /cart/view/:uid/ + POST add/remove/clear
    App.jsx               # react-router routing, like payment/urls.py
    main.jsx
    index.css
```

## All 6 APIs integrated

| Method | Backend URL | Frontend usage |
|--------|-------------|----------------|
| GET | `/product/` | `productApi.list()` in `ProductList.jsx` |
| GET | `/product/<id>/` | `productApi.getById(id)` in `ProductDetail.jsx` |
| GET | `/cart/view/<user_id>/` | `cartApi.getCart(userId)` in `CartContext` + `Cart.jsx` |
| POST | `/cart/add/<user_id>/` | `cartApi.addToCart(userId, productId)` |
| POST | `/cart/remove/<user_id>/` | `cartApi.removeFromCart(userId, itemId)` |
| POST | `/cart/clear/<user_id>/` | `cartApi.clearCart(userId)` |

`userId` defaults to `1` (stored in localStorage, editable in navbar) — mirrors `cart/view/<int:user_id>/` requiring a valid Django User.

## Setup

```bash
# 1) Backend (from backend/payment)
python manage.py migrate
python manage.py createsuperuser # ensure user id 1 exists, else change userId in UI
python manage.py runserver  # -> http://127.0.0.1:8000

# 2) Frontend (from frontend)
npm install
npm run dev    # -> http://127.0.0.1:5173
# build for prod
npm run build
npm run preview
```

## Env

- `VITE_API_BASE_URL` (default `http://127.0.0.1:8000`) — set in `.env`.

## CORS

Backend `payment/settings.py` already patched with `django-cors-headers` + `CORS_ALLOW_ALL_ORIGINS=True`. Install via `pip install -r requirements.txt` (includes `django-cors-headers`).

