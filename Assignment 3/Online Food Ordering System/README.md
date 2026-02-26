# Online Food Ordering System (Node.js + Express)

A simple online food ordering app built with Express following MVC patterns (models, controllers, views) plus REST-style API endpoints. Data persistence uses a JSON file for easy setup.

## Features
- Browse restaurants and menus (views with EJS)
- Place orders via web form or API
- JSON-backed storage with seeded sample data
- Clean separation of models, controllers, routes
- Prices displayed in Pakistani Rupees (RS) in views

## Tech Stack
- Node.js, Express
- EJS for server-rendered pages
- body-parser, morgan

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open:
   - Web: http://localhost:3000/
   - API: http://localhost:3000/api

## Project Structure
```
src/
  app.js
  controllers/
    orderController.js
    restaurantController.js
  models/
    db.js
    MenuItem.js
    Order.js
    Restaurant.js
    User.js
  routes/
    api.js
    web.js
  views/
    index.ejs
    restaurant.ejs
    order-success.ejs
    layout.ejs
  public/
    styles.css
  data/
    db.json   (auto-created on first run)
```

## Configuration
- Port: `PORT` environment variable (default 3000)
- Data file: `src/data/db.json` is created and seeded on first run

## Web Pages
- `/` — List of restaurants
- `/restaurants/:id` — Restaurant menu and order form
- After placing an order, you’ll see an order confirmation with the total (RS).

## API Endpoints
- `GET /api/restaurants` — List all restaurants
- `GET /api/restaurants/:id` — Restaurant details and menu items
- `POST /api/orders` — Create an order  
  Example:
  ```json
  {
    "customerName": "Ali",
    "address": "Lahore",
    "restaurantId": "r1",
    "items": [
      { "id": "m1", "quantity": 2 },
      { "id": "m2", "quantity": 1 }
    ]
  }
  ```
  Response (201):
  ```json
  {
    "id": "uuid",
    "customerName": "Ali",
    "address": "Lahore",
    "restaurantId": "r1",
    "items": [
      { "id": "m1", "name": "Chicken Biryani", "price": 6.99, "quantity": 2 },
      { "id": "m2", "name": "Paneer Tikka", "price": 5.49, "quantity": 1 }
    ],
    "total": 19.47,
    "status": "placed",
    "createdAt": "2026-02-26T00:00:00.000Z"
  }
  ```
- `GET /api/orders/:id` — Fetch an order by id
Screenshots
![alt text](<Screenshot 2026-02-26 194153.png>)![alt text](<Screenshot 2026-02-26 194257.png>)![alt text](<Screenshot 2026-02-26 194331.png>)![alt text
](<Screenshot 2026-02-26 194354.png>)
Screen Recording
<video controls src="Online food ordering system.mp4" title="Title"></video>
## Notes
- Currency: Views show prices as `RS`. API returns numeric price values to allow client-side formatting if needed.
- This project uses a simple JSON store for learning and assignments. For production, replace with a real database (e.g., MongoDB or PostgreSQL) and add authentication.

## License
ISC
