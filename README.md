# Payment in DRF — Fullstack (Django + React)

Monorepo with trailing-space directory name `payment in drf ` (consider renaming to `payment_in_drf` to avoid shell escaping issues).

```
payment in drf /
  backend/payment/   # Django 6.1 + DRF  (esewa_app: Product, Cart)
  frontend/          # React 18 + Vite 5 + react-router + axios
```

## Quick start

### Backend
```bash
cd "backend/payment"
# venv already at ./myenv (Python 3.14). Fix pip if needed: see pyvenv.cfg
./myenv/bin/python manage.py migrate
./myenv/bin/python manage.py createsuperuser  # ensure user 1 exists
./myenv/bin/python manage.py runserver  # http://127.0.0.1:8000

# test APIs
curl http://127.0.0.1:8000/product/
curl http://127.0.0.1:8000/cart/view/1/
```

Enabled CORS (`django-cors-headers`, `CORS_ALLOW_ALL_ORIGINS=True`) so React dev server can call `http://127.0.0.1:8000` directly.

### Frontend
```bash
cd "frontend"
npm install
npm run dev      # http://127.0.0.1:5173  (Vite proxies /api -> 8000)
npm run build    # prod bundle -> dist/
npm run preview  # http://127.0.0.1:4173
```

Env: `frontend/.env` → `VITE_API_BASE_URL=http://127.0.0.1:8000`

## API mapping

All 6 DRF endpoints are integrated in `frontend/src/api/`:

- `GET  /product/`               → `productApi.list()` → `ProductList.jsx`
- `GET  /product/<id>/`          → `productApi.getById()` → `ProductDetail.jsx`
- `GET  /cart/view/<uid>/`       → `cartApi.getCart()` → `CartContext` + `Cart.jsx`
- `POST /cart/add/<uid>/`        → `cartApi.addToCart(uid, productId)`
- `POST /cart/remove/<uid>/`     → `cartApi.removeFromCart(uid, itemId)`
- `POST /cart/clear/<uid>/`      → `cartApi.clearCart(uid)`

eSewa payment callbacks (auto-built into eSewa payload by `GET /cart/view/<uid>/`):
- `GET  /esewa/success/?user_id=<uid>` → verifies eSewa HMAC signature, clears the paid cart
- `GET  /esewa/failure/?user_id=<uid>` → payment failed/cancelled

See `frontend/README.md` for mirroring table.
