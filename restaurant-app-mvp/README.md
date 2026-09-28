# Restaurant App MVP — Assignment 1

## Fall 2026 — React Native Frontend

A frontend-only Restaurant App MVP developed for Assignment 1 using React Native and Expo.

The application demonstrates customer and restaurant-manager workflows, including authentication, menu browsing, search, cart management, table reservations, order placement, order tracking, manager operations, theme switching, and React Native state-management concepts.

The project uses mock/local data and does not require a backend server or external API.

---

# 1. Project Overview

The Restaurant App MVP provides two main user roles:

- Customer
- Restaurant Manager

Customers can browse the restaurant menu, search and sort items, add food to a cart, apply promotional codes, make table reservations, place orders, and monitor order progress.

Restaurant managers can access a manager dashboard to view incoming orders, update order status, manage reservations, and control menu item availability.

The application was designed as a frontend-only academic MVP, with the main focus on React Native development, hooks, state management, reusable components, and user-interface workflows.

---

# 2. Technology Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile application development |
| Expo | React Native development and testing |
| JavaScript | Application programming |
| React Hooks | Local state and lifecycle management |
| Context API | Shared application state |
| `useReducer` | Structured state updates |
| Custom Hooks | Reusable application logic |
| `FlatList` | Efficient menu rendering |
| Mock/Local Data | Frontend demonstration |
| Async-style timers | Simulated loading and order tracking |

No backend service, external API, Firebase, Redux, Zustand, or other external state-management library is required.

---

# 3. How to Run

## Requirements

- Node.js LTS
- npm
- Expo development environment
- Expo Go mobile application (optional)

## Installation

Open the project directory:

```bash
cd restaurant-app-mvp

Install dependencies:

npm install

Start the Expo development server:

npx expo start

The application can then be opened using Expo Go by scanning the QR code.

For web testing:

npx expo start --web
4. Mock Login Credentials
Customer

Email:

customer@example.com

Password:

Customer123
Restaurant Manager

Email:

manager@example.com

Password:

Manager123

These credentials are for academic demonstration only.

5. User Roles
Customer

The customer can:

Log in or sign up
Browse menu categories
View available and unavailable items
Search the menu
Sort menu items
Favourite menu items
Add items to the cart
Change quantities
Add special instructions
Apply promotional codes
View order totals
Reserve a restaurant table
Cancel reservations
Place an order
Track order status
Switch between light and dark themes
Restaurant Manager

The manager can:

Log in using the manager account
View incoming orders
Update order status
View customer reservations
Accept or decline reservations
Manage menu item availability
Access manager-only features
6. Main Application Workflow

The main customer workflow is:

Login / Signup
      ↓
Menu
      ↓
Search / Categories / Sorting
      ↓
Menu Item
      ↓
Add to Cart
      ↓
Cart
      ↓
Promo Code
      ↓
Order Summary
      ↓
Place Order
      ↓
Order Tracking

The reservation workflow is:

Menu
  ↓
Reservation
  ↓
Select Date
  ↓
Select Party Size
  ↓
Select Available Time
  ↓
Enter Contact Number
  ↓
Confirm Reservation
  ↓
My Reservations

The manager workflow is:

Manager Login
      ↓
Manager Dashboard
      ↓
Incoming Orders
      ↓
Reservations
      ↓
Menu Management
7. React Hooks and Features

The project demonstrates the React hooks and concepts required by the assignment.

Hook / Feature	Application Usage
useState	Login, menu, cart, reservations, theme and UI state
useEffect	Loading simulation, search behavior and order timers
useRef	Search input, list scrolling and render counter
useContext	Shared authentication, theme and cart data
useReducer	Cart state management
useMemo	Derived menu filtering and sorting
useCallback	Reusable event handlers and callbacks
React.memo	Menu item rendering optimization
Custom Hooks	Form and debounce/reusable reservation logic
FlatList	Menu item rendering
8. Question-by-Question Implementation
Q3 — Login and Signup

The application provides a combined Login/Signup interface.

Features include:

Controlled form inputs
Email validation
Password validation
Confirm password validation
Password visibility control
Customer and Manager roles
Loading indicator
Mock authentication
Authentication failure handling

The login flow uses useState and form-related state.

Q4 — Menu Browsing

The menu contains restaurant food and drink items organized into categories.

Features include:

Multiple menu categories
Daily special items
Menu item descriptions
Prices
Availability status
Add-to-cart controls
Loading state
Error/retry handling
FlatList rendering
Category filtering
Q5 — Search and Scroll Controls

The menu includes search and scrolling functionality.

Features include:

Search input
Search focus control using useRef
Search clearing
Debounced searching
Recent search terms
Empty search results state
Scroll-to-top control
Search render/debug information

The debounce mechanism prevents unnecessary filtering while the user is typing.

Q6 — Authentication and Theme

Shared application information is handled using Context.

The application demonstrates:

Authentication context
Current user information
Login/logout actions
Theme context
Light theme
Dark theme
Role-based manager access

Context avoids passing authentication and theme information through many unrelated components.

Q7 — Cart Management

Cart state is managed using useReducer.

Supported cart operations include:

Add item
Increase quantity
Decrease quantity
Remove item
Clear cart
Update special instructions
Apply promo code
Remove promo code

The cart also displays calculated totals and promotional discounts.

Q8 — Order Summary and Performance

The application demonstrates React performance concepts.

Features include:

useMemo
useCallback
React.memo
Favourite menu items
Menu sorting
Derived menu filtering
Render-count/debug information
Order subtotal
Service charge
Tax
Promo discount
Grand total

The application avoids unnecessary recalculation of derived menu and order-summary values.

Q9 — Table Reservation

The reservation system allows customers to reserve restaurant tables.

Features include:

Reservation date
Party size
Contact mobile number
Available time slots
Table capacity checking
Already-booked slot handling
Minimum one-hour-ahead booking validation
Reservation confirmation
My Reservations
Reservation cancellation
Form validation

Party size is restricted to:

1–12 people

Available reservation times are based on the restaurant's hourly schedule.

Q10 — Order Tracking and Manager Dashboard

The application demonstrates the complete order lifecycle.

Order statuses are:

Pending
   ↓
Preparing
   ↓
Ready
   ↓
Served

For demonstration purposes, the status changes automatically using timers.

Approximate demonstration timing:

Pending → Preparing: 10 seconds
Preparing → Ready: 20 seconds
Ready → Served: 30 seconds

The manager dashboard also provides:

Incoming order management
Manual order status updates
Reservation management
Menu availability management
9. Order Calculation

The order summary demonstrates the following calculations:

Subtotal
   +
Service Charge
   +
Tax
   -
Promo Discount
   =
Grand Total

The current demonstration uses:

Service charge: 5%
Tax: 15%

Promo codes are handled using local/mock data.

10. Reservation Rules

The reservation interface applies the following rules:

Party size must be between 1 and 12.
A valid Pakistani mobile number is required.
The requested reservation must not be in the past.
Booking must be at least one hour ahead.
Only available restaurant time slots can be selected.
A table must have sufficient seating capacity.
Already-reserved slots are disabled.

Example mobile format:

03XX-XXXXXXX
11. Project Structure
restaurant-app-mvp/
│
├── A1/
│   ├── SRS.pdf
│   │
│   └── UML/
│       ├── use-case-diagram
│       ├── class-diagram
│       ├── sequence-diagram
│       ├── state-machine-diagram
│       └── component-diagram
│
├── PROJECT_MEMORY/
│   ├── PROJECT_STATE.md
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── PROGRESS.md
│   └── HANDOFF.md
│
├── docs/
│   └── screenshots/
│
├── src/
│
├── App.js
├── app.json
├── package.json
└── README.md
12. UML Deliverables

The A1/UML/ directory contains the five required UML diagrams:

Use Case Diagram
Class Diagram
Sequence Diagram
State Machine Diagram
Component Diagram

These diagrams document the application's users, classes, interactions, order lifecycle, and React Native component architecture.

13. Software Requirements Specification

The complete Software Requirements Specification is available at:

A1/SRS.pdf

The SRS documents:

Project purpose
Project scope
User roles
User stories
Functional requirements
Non-functional requirements
Client-side data model
UML references
MVP frontend requirements
React Native hook requirements
14. Screenshots

Real screenshots captured from the running application are stored in:

docs/screenshots/

The screenshot set includes:

Login
Menu
Search
Cart
Reservation
Order Tracking
Manager Dashboard
Dark Theme

The screenshots are captured from the working application and are provided as assignment evidence.

15. Testing

The main application workflow was tested using the Expo development environment and a mobile device.

The following workflows were checked:

Customer login
Manager login
Menu browsing
Category selection
Search
Add to cart
Quantity changes
Promo code
Order placement
Order tracking
Reservation
Reservation cancellation
Manager dashboard
Order status updates
Menu availability
Dark theme

The project uses mock/local data because backend services are outside the assignment scope.

16. Scope and Limitations

This is a frontend-only academic MVP.

The following features are outside the project scope:

Real payment processing
Backend services
External APIs
Production database
Push notifications
Production authentication
Real-time server communication
Multi-device synchronization
Production security

The purpose of the application is to demonstrate React Native frontend development, UI design, state management, hooks, reusable components, and restaurant application workflows.

17. Demo Video

A short demonstration video is included as part of the final assignment submission.

The demonstration covers:

Login
→ Menu
→ Search
→ Add to Cart
→ Cart / Promo
→ Reservation
→ Place Order
→ Order Tracking
→ Manager Login
→ Manager Dashboard
→ Dark Theme

The video is kept within the assignment's maximum demonstration time.

18. Assignment Deliverables
Question	Deliverable
Q1	Software Requirements Specification
Q2	Five UML Diagrams
Q3	Login and Signup
Q4	Menu Browsing
Q5	Search and Scroll Controls
Q6	Authentication and Theme Context
Q7	Cart and Reducer
Q8	Order Summary and Performance Features
Q9	Table Reservation and Custom Hooks
Q10	Order Tracking and Manager Dashboard
19. Academic Project Notice

This project was developed as a university assignment for demonstrating React Native frontend development and software engineering concepts.

It is an academic MVP and is not intended for production restaurant operations.


### Then commit it

Use exactly:

```text
docs: finalize restaurant app README
