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
