# Assignment 2 — Restaurant App with Server and Database

## Deliverables

- Updated Software Requirements Specification: `SRS_v2.pdf`
- Updated diagrams
- Node.js and Express backend
- MongoDB database models and seed script
- REST API routes and controllers
- Postman API collection: `restaurant-api.postman_collection.json`
- React Native frontend connected to the API

## Backend Setup

1. Install dependencies with `npm install` inside `server`.
2. Create a local `.env` using `.env.example`.
3. Configure `MONGO_URI` and `JWT_SECRET`.
4. Seed demo data with `npm run seed`.
5. Start the API with `npm start`.

## API Testing

Test the menu endpoint at `/api/menu` and health endpoint at `/api/health`.

Do not commit `.env`, real database credentials, or `node_modules`.
