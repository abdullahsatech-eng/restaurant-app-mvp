# Restaurant App API v2
Base URL: `http://localhost:5000` (physical device: `http://<laptop-lan-ip>:5000`)

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Server health |
| POST | `/api/auth/register` | Public | Register customer |
| POST | `/api/auth/login` | Public | Login and receive one-day JWT |
| GET | `/api/menu` | Public | List/filter/search menu |
| GET | `/api/menu/:id` | Public | Get one item |
| POST | `/api/menu` | Manager | Create item |
| PUT | `/api/menu/:id` | Manager | Update item |
| DELETE | `/api/menu/:id` | Manager | Delete item |
| GET | `/api/tables` | Public | List active tables |
| POST | `/api/tables` | Manager | Create table |
| POST | `/api/orders` | Authenticated | Place order; server calculates price |
| GET | `/api/orders/my` | Authenticated | Customer's orders |
| GET | `/api/orders` | Manager | All orders |
| PATCH | `/api/orders/:id/status` | Manager | Advance order status |
| GET | `/api/reservations/availability?date=YYYY-MM-DD&time=18:00&partySize=2` | Public | List available tables for a time slot |
| POST | `/api/reservations` | Authenticated | Create booking |
| GET | `/api/reservations/my` | Authenticated | Customer bookings |
| GET | `/api/reservations` | Manager | All bookings |
| PATCH | `/api/reservations/:id` | Authenticated/Manager | Cancel own booking or manager decision |

Protected endpoints use `Authorization: Bearer <token>`. Never commit `.env` or a real MongoDB URI.
