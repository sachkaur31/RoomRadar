# RoomRadar

Smart classroom and study space finder – React frontend MVP.
No backend: rooms, timetables and sensor availability are simulated in `src/data.js`; bookings are saved in the browser (localStorage).

## Run locally
    npm install
    npm run dev

Open http://localhost:5173 (Node.js 18+ required).

## Build / preview
    npm run build
    npm run preview

## Deploy (Vercel)
Import the GitHub repo in Vercel. Preset: Vite. Build command `npm run build`, output directory `dist`.

## Structure
- src/main.jsx            entry point
- src/App.jsx             state, tabs, filters, reminders
- src/data.js             rooms, facilities, timetable and simulated occupancy
- src/utils.js            availability logic and recommendation scoring
- src/components/         RoomCard, Recommender, Timetable, BookingModal, MyBookings, Chips
- src/styles.css          all styling (light/dark)

To change rooms or timetables, edit `ROOMS` in src/data.js.
