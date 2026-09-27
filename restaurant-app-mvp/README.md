# Restaurant App MVP — Assignment 1

Frontend-only React Native/Expo MVP for Fall 2026. No backend or external API is required.

## Run
1. Install Node.js LTS.
2. `npm install`
3. `npx expo start`
4. Scan the QR code with Expo Go, or press `w` for web.

Expo's official documentation recommends `create-expo-app` for starting React Native/Expo projects. See the official Expo docs: https://docs.expo.dev/get-started/create-a-project/

## Mock credentials
- Customer: `customer@example.com` / `Customer123`
- Manager: `manager@example.com` / `Manager123`

## Required hooks demonstrated
| Hook/feature | Demonstrated in |
|---|---|
| useState | Login, Menu, Cart, Reservation |
| useEffect | local loading, debounce, order timers |
| useRef | search/list refs and render counter |
| useContext | Auth, Theme, Cart |
| useReducer | theme toggle and cart reducer |
| useMemo | derived menu filtering/sorting |
| useCallback | auth actions and menu handlers |
| React.memo | planned component optimization point |
| Custom hooks | useForm, useDebounce, useReservation |
| FlatList | Menu screen |

## Screenshots required for submission
Take real screenshots after running the app: Login, Menu/Search, Cart/Order Summary, Reservation, Order Tracking, Manager Dashboard, and Dark Theme.

## Scope
Mock/local data only. Real payments, backend services, push notifications, external APIs and production authentication are out of scope.
