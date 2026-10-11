# Restaurant App MVP — Assignments 1 & 2

A Restaurant App built with React Native and Expo, Node.js, Express, and MongoDB for Fall 2026.

## Features

- Browse and search menu items by category.
- Add menu items to the cart.
- Register and log in as a customer or manager.
- Store menu items, users, tables, reservations, and orders in MongoDB.
- Access restaurant data through REST API endpoints.
- Support manager operations through protected API routes.

## Technology Stack

- Frontend: React Native, Expo
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose
- Authentication: bcryptjs and JSON Web Tokens (JWT)

## Run the Frontend

From the project directory:

```bash
npm install
npx expo start
```

For browser testing, use the web option if supported by the project.

## Run the Backend

Open a terminal in the `server` directory:

```bash
npm install
```

Create a local `.env` file using `.env.example` as a template. Configure `MONGO_URI` and `JWT_SECRET` with your own values. Never commit `.env` or database credentials.

Seed the demo data:

```bash
npm run seed
```

Start the API:

```bash
npm start
```

The API runs on port 5000 by default. Check its health endpoint at `/api/health`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server health |
| GET | `/api/menu` | Retrieve menu items |
| GET | `/api/menu/:id` | Retrieve one menu item |
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Log in |
| GET/POST/PUT/DELETE | `/api/orders` and related routes | Order operations, subject to implemented routes |

## Demo Credentials

Customer:
- Email: `customer@restaurant.app`
- Password: `Customer123`

Manager:
- Email: `manager@restaurant.app`
- Password: `Manager123`

These are local demonstration credentials only. Change them before any real deployment.

## Documentation

- A1 SRS: `A1/SRS.pdf`
- A1 UML diagrams: `A1/UML/`
- Screenshots: `docs/screenshots/`
- A2 documentation and API collection: `A2/` (add the required files here)

## Configuration and Security

Update `BASE_URL` in `src/api/client.js` when changing the API host. Use `http://localhost:5000` for browser testing on the same PC, and your computer's LAN IP for a phone on the same Wi-Fi.

Do not commit `.env`, database passwords, or `node_modules`.

## Academic Project

This project demonstrates React Native development, hooks, state management, REST API integration, MongoDB persistence, and software engineering practices.
