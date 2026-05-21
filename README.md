# 🚗 Veluxora — Server

> REST API backend for [Veluxora](https://veluxora.vercel.app/) — a premium luxury car rental platform.

---

## 🌐 Live Site

**[https://veluxora.vercel.app/](https://veluxora.vercel.app/)**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose Driver) |
| Authentication | JWT — verified via `jose` (remote JWKS) |
| Environment | dotenv |
| CORS | cors |

---

## 📁 Project Structure

```
veluxora-server/
├── index.js          # Entry point — all routes & DB logic
├── .env              # Environment variables (not committed)
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
CLIENT_URL=https://veluxora.vercel.app
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default: `5000`) |
| `MONGO_DB_URI` | MongoDB Atlas connection URI |
| `CLIENT_URL` | Frontend origin — used to fetch JWKS for JWT verification |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/veluxora-server.git
cd veluxora-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

```bash
cp .env.example .env
# Fill in your values
```

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

Server will run at `http://localhost:5000`

---

## 🔐 Authentication

Protected routes use **JWT verification** via a remote JWKS endpoint exposed by the Next.js frontend at:

```
GET {CLIENT_URL}/api/auth/jwks
```

The `verifyToken` middleware validates the `Authorization: Bearer <token>` header on every protected request.

---

## 📡 API Endpoints

### 🚘 Cars

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/cars` | ❌ | Get all cars (sorted by price descending) |
| `GET` | `/cars/:id` | ❌ | Get a single car by ID |
| `POST` | `/cars` | ❌ | Add a new car listing |
| `PATCH` | `/cars/:id` | ❌ | Update a car by ID |
| `DELETE` | `/cars/:id` | ❌ | Delete a car by ID |
| `GET` | `/myAddedCars?email=` | ✅ | Get cars added by a specific owner |
| `GET` | `/featured` | ❌ | Get 4 featured cars |

---

### 📅 Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/bookings` | ❌ | Create a new booking |
| `GET` | `/bookings?email=` | ✅ | Get all bookings for a user |
| `GET` | `/bookings/:id` | ❌ | Get a single booking by ID |
| `DELETE` | `/bookings/:id` | ❌ | Cancel/delete a booking |

> ✅ = Requires `Authorization: Bearer <token>` header

---

## 🗄️ Database Collections

**Database:** `veluxora`

| Collection | Purpose |
|---|---|
| `allCars` | Stores all car listings |
| `bookings` | Stores all rental bookings |

---

## 📦 Dependencies

```json
"dependencies": {
  "cors": "^2.x",
  "dotenv": "^16.x",
  "express": "^4.x",
  "jose-cjs": "^2.x",
  "mongodb": "^6.x"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">Built with ❤️ for <a href="https://veluxora.vercel.app/">Veluxora</a></p>
