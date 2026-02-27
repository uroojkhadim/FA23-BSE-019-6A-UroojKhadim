# Mini Online Store API (Express.js Lab Project)

Demonstrates Scalable Application Architecture using MVC and `express.Router`.

## Structure
```
project-folder/
  app.js
  routes/
    products.js
    users.js
  controllers/
    productController.js
    userController.js
  middleware/
    logger.js
    auth.js
```

## Run
```
npm install
node app.js
```

## Endpoints
- GET `/products` → dummy items
- GET `/users/:id` → requires header `Authorization: Bearer demo-token`
- POST `/users` → requires header `Authorization: Bearer demo-token`, JSON body

## Notes
- Restaurant analogy comments added to teach Middleware, Routers, Controllers
- `express.Router()` used to keep app.js clean and scalable

