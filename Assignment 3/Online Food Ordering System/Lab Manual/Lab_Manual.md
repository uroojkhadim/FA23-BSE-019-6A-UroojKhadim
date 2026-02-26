# Lab Manual: Online Food Ordering System

## Course: Undergraduate Web Development

### Project Overview
In this lab, students will build an "Online Food Ordering System" using an MVC framework of their choice (e.g., Laravel, Django, ASP.NET Core). The project is divided into four phases, each focusing on specific learning objectives.

---

## Phase 1: Models & View Generators (Scaffolding)

### Objective:
- Learn to create models and use the framework's scaffolding tools to generate CRUD templates.

### Instructions:
1. **Choose an MVC Framework:**
   - Laravel (PHP)
   - Django (Python)
   - ASP.NET Core (C#)

2. **Create Models:**
   - Define a `MenuItem` model with the following fields:
     - `id` (Primary Key)
     - `name` (String)
     - `description` (Text)
     - `price` (Decimal)
     - `image_url` (String)
   - Define an `Order` model with the following fields:
     - `id` (Primary Key)
     - `customer_name` (String)
     - `customer_email` (String)
     - `menu_item_id` (Foreign Key to MenuItem)
     - `quantity` (Integer)
     - `total_price` (Decimal)

3. **Generate CRUD Views:**
   - Use the framework's scaffolding tools to generate CRUD operations (Create, Read, Update, Delete) for both models.
   - Verify that the generated views are functional.

4. **Submission:**
   - Submit the generated code and a screenshot of the working CRUD views.

---

## Phase 2: Bootstrap Integration

### Objective:
- Enhance the generated HTML templates using Bootstrap for a responsive and modern design.

### Instructions:
1. **Integrate Bootstrap:**
   - Add the Bootstrap CSS and JS files to your project.
   - Use the Bootstrap 12-column grid system to create a responsive layout.

2. **Upgrade the Templates:**
   - Replace plain HTML tables with Bootstrap `Cards` to display menu items.
   - Add a `Navbar` for navigation.
   - Style all forms and buttons using Bootstrap classes (e.g., `btn-primary`, `form-control`).

3. **Responsive Design:**
   - Ensure the layout is fully responsive on different screen sizes.

4. **Submission:**
   - Submit the updated templates and a video demonstrating the responsive design.

---

## Phase 3: REST Principles & Method Selection

### Objective:
- Map UI actions to the correct HTTP methods and document REST principles.

### Instructions:
1. **Map HTTP Methods:**
   - Ensure the following mappings:
     - `GET`: Retrieve resources (e.g., list menu items, view an order).
     - `POST`: Create new resources (e.g., add a menu item, place an order).
     - `PUT`: Update existing resources (e.g., edit a menu item, update an order).
     - `DELETE`: Remove resources (e.g., delete a menu item, cancel an order).

2. **Document REST Principles:**
   - Explain how your API design adheres to `Statelessness` (e.g., passing authentication tokens in headers).
   - Identify which endpoints are `Idempotent` (e.g., `PUT`, `DELETE`).

3. **Submission:**
   - Submit a document with the HTTP method mappings and REST principles explanation.

---

## Phase 4: Resource & URI Design

### Objective:
- Design RESTful API endpoints with proper URI structure.

### Instructions:
1. **Design Endpoints:**
   - Use plural nouns for resource names (e.g., `/menuitems`, `/orders`).
   - Demonstrate a hierarchical structure for related resources (e.g., `/menuitems/{id}/orders`).

2. **Example Endpoints:**
   - `GET /menuitems`: Retrieve all menu items.
   - `POST /menuitems`: Add a new menu item.
   - `PUT /menuitems/{id}`: Update a menu item.
   - `DELETE /menuitems/{id}`: Delete a menu item.
   - `GET /orders`: Retrieve all orders.
   - `POST /orders`: Place a new order.
   - `GET /orders/{id}`: Retrieve a specific order.

3. **Submission:**
   - Submit a list of your API endpoints.

---

### Final Submission Checklist:
- Phase 1: CRUD templates and screenshots.
- Phase 2: Updated templates and responsive design video.
- Phase 3: REST principles document.
- Phase 4: API endpoint list.

---

### Grading Criteria:
- **Phase 1:** 25%
- **Phase 2:** 25%
- **Phase 3:** 25%
- **Phase 4:** 25%

---

### Notes:
- Late submissions will result in a 10% penalty per day.
- Plagiarism will result in a zero grade.