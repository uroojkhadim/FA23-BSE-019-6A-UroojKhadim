# ☕ Cafeteria Management System (Elite Edition)

A premium, full-stack management solution designed for modern cafeterias and coffee shops. This system features a high-contrast glassmorphic UI, robust POS functionality, and real-time operational insights.

---

## ✨ Key Features

### 🔐 Secure Authentication
- **Multi-Role Access**: Dedicated dashboards for Administrators and Users.
- **JWT Protection**: Secure session handling using JSON Web Tokens.
- **Bcrypt Security**: Industry-standard password hashing.

### 🍱 Elite POS Terminal
- **Intuitive Ordering**: Categorized menu browsing with a dynamic shopping cart.
- **Real-time Calculations**: Automatic subtotal, discount, and grand total processing.
- **Integrated Payments**: Supports Cash flow and Mobile Account (JazzCash) settlements with transaction tracking.

### 📊 Executive Dashboards
- **Admin Dashboard**: Real-time trade intelligence, revenue tracking, and menu CRUD management.
- **User Dashboard**: Personalized welcome screen and historical activity ledger.
- **Data Intelligence**: Exportable audit logs in XLS/PDF formats.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 + Vite, Framer Motion, Lucide Icons |
| **Backend** | Node.js + Express.js |
| **Database** | LowDB (JSON-based persistence) |
| **Styling** | Vanilla CSS + Advanced Design Patterns |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher)
- npm (v7.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "Cafeteria Management system"
   ```

2. **Setup the Server**:
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Setup the Client**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---

## 📂 Project Structure

- `client/`: React frontend containing pages (POS, Dashboards, Auth) and components.
- `server/`: Express backend with routes for authentication, menu management, and order processing.
- `server/db.json`: Local database file for persistent storage.

---

## 🎨 Design Philosophy
The system utilizes a **Glassmorphic** design language, characterized by:
- Deep dark backgrounds with translucent overlays.
- Dynamic HSL color system (Vibrant Primary vs Elegant Accents).
- Smooth micro-animations for enhanced user engagement.
  ## Screenshots
  <img width="1354" height="632" alt="Screenshot 2026-04-03 092217" src="https://github.com/user-attachments/assets/7e7ce6c9-f8a5-46ac-ab66-eaccf5b1d5b2" /><img width="1356" height="630" alt="Screenshot 2026-04-03 093507" src="https://github.com/user-attachments/assets/e30e1710-0f40-49d5-b5cc-5b0d85170da2" /><img width="1338" height="633" alt="Screenshot 2026-04-03 093444" src="https://github.com/user-attachments/assets/ea2d3517-dab6-4749-8d06-6cde7099e456" /><img width="1357" height="636" alt="Screenshot 2026-04-03 093418" src="https://github.com/user-attachments/assets/a6e50ce7-35d0-47b4-8df3-929ca348d567" /><img width="1356" height="633" alt="Screenshot 2026-04-03 093527" src="https://github.com/user-attachments/assets/d7109089-e021-414e-b950-751332e0f5b7" /><img width="1350" height="633" alt="Screenshot 2026-04-03 093552" src="https://github.com/user-attachments/assets/623fa8ee-3c71-474a-90af-0f4974fcd7c4" /><img width="426" height="632" alt="image" src="https://github.com/user-attachments/assets/fb175c24-e242-4dab-a720-ce38f1b47946" />







