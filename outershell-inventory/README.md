# 🛍️ OuterShell — AI-Powered Inventory Management System

A full-stack inventory and product management system built for **OuterShell Clothing** — a multi-branch retail brand with 4 stores across Mumbai. Features real-time stock tracking, purchase order management, and AI-powered product descriptions using Claude AI.

---

## ✨ Features

- 📦 **Product Management** — Add, edit, delete products with stock tracking across 4 branches
- 🛒 **Order Management** — Create purchase orders with auto stock deduction and status tracking
- 📊 **Dashboard Analytics** — Real-time metrics: inventory value, revenue, low stock alerts, charts
- 🤖 **AI Description Generator** — Claude AI generates product descriptions and marketing copy
- 🏪 **Multi-Branch Support** — Andheri, Bandra, Dadar, Thane — switch and filter per branch
- ⚠️ **Low Stock Alerts** — Automatic alerts when stock drops below threshold
- 📱 **Instagram & WhatsApp Copy** — AI generates ready-to-post captions and messages

---

## 🛠️ Tech Stack

**Frontend:** React.js, React Router, Recharts, Axios, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth

**AI:** Anthropic Claude API (claude-sonnet-4-20250514)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Anthropic API Key

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/outershell-inventory.git
cd outershell-inventory

# Install all dependencies
npm run install-all
```

### Setup Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/outershell
JWT_SECRET=your_secret_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Run the App

```bash
# Run backend and frontend together
npm run dev

# Or separately:
npm run backend    # Runs on http://localhost:5000
npm run frontend   # Runs on http://localhost:3000
```

---

## 📁 Project Structure

```
outershell-inventory/
├── backend/
│   ├── models/
│   │   ├── Product.js       # Product schema with auto status
│   │   └── Order.js         # Order schema with auto ID generation
│   ├── routes/
│   │   ├── products.js      # CRUD + stats endpoints
│   │   ├── orders.js        # Order management + revenue stats
│   │   ├── auth.js          # JWT authentication
│   │   └── ai.js            # Claude AI integration
│   ├── server.js            # Express app entry point
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Sidebar.js   # Navigation with branch switcher
│       │   └── Topbar.js    # Page header with actions
│       ├── pages/
│       │   ├── Dashboard.js # Analytics overview
│       │   ├── Products.js  # Product management
│       │   ├── Orders.js    # Order management
│       │   └── AIAssistant.js # AI content generator
│       ├── api.js           # Axios API service layer
│       ├── App.js           # Router and layout
│       └── index.js
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (filter by branch, search) |
| POST | `/api/products` | Add new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/stats/dashboard` | Get dashboard stats |
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Place new order (auto deducts stock) |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET | `/api/orders/stats/revenue` | Get revenue stats |
| POST | `/api/ai/describe` | Generate AI product description |
| POST | `/api/ai/marketing` | Generate full marketing copy |
| POST | `/api/auth/login` | Login (returns JWT) |

---

## 👤 Default Login

```
Email: admin@outershell.com
Password: outershell123
```

---

## 🙏 Built By

**Aniket Jha** — Full Stack Developer & AI Engineer
- Email: jhaaniket60@gmail.com
- LinkedIn: linkedin.com/in/aniket-jha-1b77552a3
