# Payment in DRF — Backend (Django + DRF)

REST API for a simple product + cart shop, built with Django 6.1 and Django REST Framework.

## Features

- Products: list, detail, create (`GET/POST /product/`)
- Cart: view, add, remove, clear (`/cart/view|add|remove|clear/<user_id>/`)
- CORS enabled for the React frontend at `http://127.0.0.1:5173`

## Endpoints

| Method | URL                          | Description            |
|--------|------------------------------|------------------------|
| GET    | `/product/`                  | List products          |
| POST   | `/product/`                  | Create product         |
| GET    | `/product/<id>/`             | Product detail         |
| GET    | `/cart/view/<user_id>/`      | View cart              |
| POST   | `/cart/add/<user_id>/`       | Add product to cart    |
| POST   | `/cart/remove/<user_id>/`    | Remove cart item       |
| POST   | `/cart/clear/<user_id>/`     | Clear cart             |
| GET    | `/esewa/success/`            | eSewa payment callback<br>(verifies HMAC signature, clears paid cart for `?user_id=`) |
| GET    | `/esewa/failure/`            | eSewa failure callback |

## Setup

```bash
python -m venv myenv
source myenv/bin/activate           # Windows: myenv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env                # set DJANGO_SECRET_KEY etc.
python manage.py migrate
python manage.py createsuperuser    # ensure a user exists (cart endpoints need user_id)
python manage.py runserver          # http://127.0.0.1:8000
```

## Environment variables (`.env`)

| Variable            | Default               |
|---------------------|-----------------------|
| `DJANGO_SECRET_KEY` | (required in prod)    |
| `DJANGO_DEBUG`      | `True`                |
| `DJANGO_ALLOWED_HOSTS` | `*`                 |

## Example

```bash
# create a product
curl -X POST http://127.0.0.1:8000/product/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": "999.99"}'

# list products
curl http://127.0.0.1:8000/product/
```