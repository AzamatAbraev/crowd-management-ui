# People Counter Frontend

The web interface for the crowd management platform. It provides live occupancy views, floor plans, analytics, device management, and user administration. Authentication is handled by the gateway — the frontend never communicates with Keycloak directly.

## What it provides

- **Live views** — campus map, building floor plans, area occupancy in real time
- **Schedule page** — timetable for rooms, sourced from the backend
- **Occupancy analytics** — historical charts backed by InfluxDB data via the API
- **Admin panel** — device management, user management, system overview
- **Role-based access** — admin features are only accessible to users with the appropriate Keycloak role

## Stack

- React 19, TypeScript
- Vite 7 (build tool)
- React Router v7
- Recharts (charts)
- Axios (HTTP)
- Lucide React (icons)
- Nginx (production serving inside Docker)

## Pages and routing

| Route | Description |
|---|---|
| `/home` | Landing page after login |
| `/live/campus` | Campus-wide occupancy map |
| `/live/building` | Floor plan view for a building |
| `/live/area` | Detailed view for a specific room or area |
| `/live/schedule` | Room timetable |
| `/occupancy` | Historical occupancy charts |
| `/admin` | Admin landing |
| `/admin/users` | User management (create, update, reset password) |
| `/admin/devices` | Device registry and status |
| `/admin/system` | System management |
| `/admin/monitor` | Live device monitoring |

## API communication

All API calls go through the gateway at `http://localhost:8082`. The gateway forwards requests to the backend and attaches the user's token automatically. The frontend does not hold or manage tokens.

Services in `src/services/`:

| File | Purpose |
|---|---|
| `dashboardService.ts` | Live occupancy data |
| `buildingService.ts` | Building and room data |
| `deviceService.ts` | Device registry and health |
| `timetableService.ts` | Room schedule data |
| `userManagementService.ts` | Admin user CRUD |


## Running with Docker

The Dockerfile has two stages: Node 22 builds the app with `npm run build`, then Nginx serves the output. No local Node installation is required to run the production build.

```bash
docker compose up -d
```

The container maps port `5173` on the host to port `80` inside the container (Nginx).

## Running locally for development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. The gateway must also be running for API calls to work.

## Important notes

- `node_modules/` is not committed. Run `npm install` to restore it for local development. Docker builds do not need it.
- The production build is fully static (HTML/JS/CSS) and served by Nginx. The `nginx.conf` file in the project root handles client-side routing (all paths fall back to `index.html`).
- The frontend is accessible without authentication only for public occupancy endpoints. All other routes require a valid session established through the gateway.
