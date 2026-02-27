# Mini Online Store API (Express.js Lab Project)

Demonstrates Scalable Application Architecture using MVC and `express.Router`. Includes API, Models, and EJS Views.

## Structure
```
project-folder/
  app.js
  routes/
    products.js
    users.js
    views.js
  controllers/
    productController.js
    userController.js
  middleware/
    logger.js
    auth.js
  models/
    product.js
    user.js
  views/
    home.ejs
    products.ejs
    users.ejs
    user_detail.ejs
    error.ejs
```

## Run
```
npm install
node app.js
```

## Endpoints
- GET `/products` → returns dummy items from model
- GET `/products` → returns dummy items
- GET `/users/:id` → requires auth header, returns user by id
- POST `/users` → requires auth header, accepts JSON body and returns created user

### Auth Header
Router-level protection is applied only to `/users` routes.
- Send header: `Authorization: Bearer demo-token`

### Examples
Using curl (bash):
```
curl http://localhost:3000/products
curl -H "Authorization: Bearer demo-token" http://localhost:3000/users/123
curl -H "Authorization: Bearer demo-token" -H "Content-Type: application/json" \
     -d '{"name":"Alice"}' http://localhost:3000/users
```

On PowerShell:
```
curl.exe http://localhost:3000/products
curl.exe -H "Authorization: Bearer demo-token" http://localhost:3000/users/123
curl.exe -H "Authorization: Bearer demo-token" -H "Content-Type: application/json" `
        -d '{\"name\":\"Alice\"}' http://localhost:3000/users
```
## Views
- View engine: EJS configured in `app.js`
- Routes:
  - GET `/views/` → Home
  - GET `/views/products` → Render products list from model
  - GET `/views/users` → Auth-protected users list
  - GET `/views/users/:id` → Auth-protected user detail

## Models
- `models/product.js` provides `getAll`, `getById`, `create`, `update`, `remove`
- `models/user.js` provides `getAll`, `getById`, `create`
- Controllers call models to fetch and persist in-memory data


## Restaurant Analogy
- Express App = The restaurant building
- Middleware (logger/auth) = The waiter checking orders or reservations
- Routers = Menu sections guiding orders to the right area
- Controllers = The chef preparing the dish (response)

## Why `express.Router()`?
- Keeps `app.js` focused on bootstrapping
- Separates features (products/users) for clean, scalable code
- Improves readability, testability, and maintenance as the app grows

## 404 Handling
Any unknown path returns:
```
{ "error": "Not Found" }
Open views at:
- `http://localhost:3000/views/`
- `http://localhost:3000/views/products`
- `http://localhost:3000/views/users`
