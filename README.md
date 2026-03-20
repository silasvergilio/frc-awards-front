# FRC Awards Frontend

Frontend application for managing FRC/FTC (FIRST Robotics Competition / FIRST Tech Challenge) award deliberations at tournament events. Built with Vue 3 and Vuetify 3, this app allows judges and administrators to manage events, nominate teams for awards, track judge visits, and visualize award deliberation results.

## Table of Contents

- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Routes](#routes)
- [Components](#components)
  - [Page Components](#page-components)
  - [Utility Components](#utility-components)
- [Composables (Services)](#composables-services)
- [Store (State Management)](#store-state-management)
- [Plugins](#plugins)
- [Role-Based Access](#role-based-access)

## Technologies

| Technology | Version | Description |
|---|---|---|
| [Vue.js](https://vuejs.org/) | ^3.3.4 | Progressive JavaScript framework |
| [Vuetify](https://vuetifyjs.com/) | ^3.5.0 | Material Design component library for Vue 3 |
| [Vue Router](https://router.vuejs.org/) | ^4.3.0 | Official router for Vue.js |
| [Pinia](https://pinia.vuejs.org/) | ^3.0.3 | State management (with `pinia-plugin-persistedstate` ^4.5.0) |
| [Auth0 (auth0-vue)](https://auth0.com/) | ^2.4.0 | Authentication and authorization via OAuth 2.0 / JWT |
| [VeeValidate](https://vee-validate.logaretm.com/) | ^4.15.1 | Form validation with Yup schema support |
| [Yup](https://github.com/jquense/yup) | ^1.7.1 | Schema-based form validation |
| [Axios](https://axios-http.com/) | ^1.6.7 | HTTP client (used in some legacy components) |
| [vuedraggable](https://sortablejs.github.io/vue.draggable.next/) | ^4.1.0 | Drag-and-drop list reordering |
| [print-js](https://printjs.crabbly.com/) | ^1.0.63 | Browser printing utility |
| [vue-the-mask](https://github.com/vuejs-tips/vue-the-mask) | ^0.11.1 | Input masking directive |
| [@mdi/font](https://materialdesignicons.com/) | ^7.2.96 | Material Design Icons |
| [Sass](https://sass-lang.com/) | ^1.66.1 | CSS preprocessor |
| [@vue/cli-service](https://cli.vuejs.org/) | ^5.0.8 | Build tooling (Webpack-based) |
| [Node.js](https://nodejs.org/) | v14+ recommended | JavaScript runtime |

## Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm**
- A running instance of the [FRC Awards Backend](https://github.com/Silver-Robotics/frc-awards-backend)
- An [Auth0](https://auth0.com/) application configured for this frontend

## Environment Variables

Create a `.env` file in the project root (or use `.env.local`):

```env
VUE_APP_SERVER_DOMAIN=http://localhost:3000
VUE_APP_OAUTH_DOMAIN=your-auth0-domain.us.auth0.com
VUE_APP_OAUTH_CLIENT_ID=your_auth0_client_id
```

| Variable | Description |
|---|---|
| `VUE_APP_SERVER_DOMAIN` | Base URL of the backend API (e.g., `http://localhost:3000` for local dev) |
| `VUE_APP_OAUTH_DOMAIN` | Auth0 tenant domain |
| `VUE_APP_OAUTH_CLIENT_ID` | Auth0 application Client ID |

## Installation

```bash
# Clone the repository
git clone https://github.com/Silver-Robotics/frc-awards-front.git

# Navigate to the project directory
cd frc-awards-front

# Install dependencies
npm install
```

## Running the Application

```bash
# Development server (with hot-reload)
npm run dev

# Production build
npm run build

# Lint and fix files
npm run lint
```

The development server runs via `vue-cli-service serve` and is available at `http://localhost:8080` by default.

The production build outputs to the `dist/` folder. The `static.json` file configures SPA routing for static hosting (e.g., Heroku).

## Project Structure

```
frc-awards-front/
├── public/
│   ├── favicon.ico              # App favicon
│   └── index.html               # HTML entry point
├── src/
│   ├── assets/                  # Static assets (logos, team photos)
│   │   ├── logo_frc.png         # FRC program logo
│   │   ├── logo_ftc.png         # FTC program logo
│   │   ├── logo_text.png        # FRC app text logo
│   │   ├── logo_text_ftc.png    # FTC app text logo
│   │   ├── first_age_logo.png   # FIRST logo (footer)
│   │   ├── warning.png          # Warning dialog image
│   │   └── fotos_times/         # Team photos directory
│   ├── components/              # Vue page & utility components
│   │   ├── Awards.vue           # Award deliberation grid
│   │   ├── Dashboard.vue        # Admin dashboard (event init + judges)
│   │   ├── ListTeams.vue        # Team listing table
│   │   ├── NominateTeam.vue     # Award nomination form
│   │   ├── NonNominated.vue     # Teams without nominations
│   │   ├── Visits.vue           # Judge visit tracking
│   │   ├── Login.vue            # Login page
│   │   ├── Home.vue             # Welcome/home page
│   │   ├── AddTeam.vue          # Single team registration form
│   │   ├── AddUser.vue          # User registration form
│   │   ├── AddPicture.vue       # Team photo upload
│   │   ├── BulkAddTeam.vue      # Bulk team import from FIRST API
│   │   ├── CallBack.vue         # Awards summary/print matrix
│   │   ├── CardTitlePage.vue    # Reusable page title card
│   │   └── Loader.vue           # Loading overlay spinner
│   ├── composables/             # Vue 3 composable functions (services)
│   │   ├── useApi.js            # Authenticated API request handler
│   │   └── useSnackbar.js       # Global snackbar notification service
│   ├── plugins/                 # Plugin configurations
│   │   ├── validation.js        # VeeValidate rules & pt-BR locale
│   │   └── vuetify.js           # Vuetify theme configuration
│   ├── stores/                  # Pinia stores
│   │   └── eventStore.js        # Global event selection state
│   ├── App.vue                  # Root component (layout, nav, event selector)
│   └── main.js                  # App entry point (router, plugins, Auth0)
├── babel.config.js              # Babel configuration
├── vue.config.js                # Vue CLI configuration
├── vite.config.js               # Vite configuration (alternative build)
├── static.json                  # SPA routing for static hosting
├── package.json                 # Dependencies and scripts
└── .gitignore                   # Git ignore rules
```

## Authentication

The app uses **Auth0** for authentication. On load, unauthenticated users are redirected to Auth0's login page. After successful login, a JWT token is obtained and sent with every API request via the `useApi` composable.

Auth0 configuration (set via environment variables):
- **Domain:** `VUE_APP_OAUTH_DOMAIN`
- **Client ID:** `VUE_APP_OAUTH_CLIENT_ID`
- **Audience:** `https://frc-awards.api`
- **Scopes:** `read:events`, `write:events`

A route guard in `main.js` protects all routes except `/login` and `/adduser`, redirecting unauthenticated users to the login page.

## Routes

| Path | Component | Description |
|---|---|---|
| `/login` | `Login` | User login page |
| `/home` | `Home` | Welcome page |
| `/dashboard` | `Dashboard` | Admin panel for event initialization and judge management |
| `/listTeams` | `ListTeams` | List all teams for the selected event |
| `/nominateteam` | `NominateTeam` | Nominate a team for an award |
| `/awards` | `Awards` | View and manage all award nominations |
| `/non-nominated` | `NonNominated` | View teams that haven't been nominated |
| `/visits` | `Visits` | Track judge visits to teams (AE, MCI, Extra) |
| `/addTeam` | `AddTeam` | Manually add a single team |
| `/addTeams` | `BulkAddTeam` | Bulk import teams from the FIRST API |
| `/adicionar-foto` | `AddPicture` | Upload a photo for a team |
| `/callback` | `CallBack` | Awards summary matrix (printable) |
| `/adduser` | `AddUser` | Register a new user |
| `/*` (catch-all) | - | Redirects to `/listTeams` |

## Components

### Page Components

| Component | File | Description |
|---|---|---|
| **Awards** | `Awards.vue` | Displays all award nominations grouped by award name in a card grid. Supports drag-and-drop reordering (FTC mode via `vuedraggable`), toggling nomination/awarded status, deleting nominations, and viewing nomination details in a dialog. Automatically calculates the "Inspire Award" based on category coverage. |
| **Dashboard** | `Dashboard.vue` | Admin-only panel with two tabs: **Initialization** (create a new event by fetching data from the FIRST API for FRC or FTC programs) and **Judges** (list current judges and add new ones). |
| **ListTeams** | `ListTeams.vue` | Displays all teams for the selected event in a data table with state, name, number, and school columns. Clicking a row opens a dialog showing the team's photo. |
| **NominateTeam** | `NominateTeam.vue` | Form to nominate a team for an award. Includes dropdowns for award selection (different lists for FRC vs FTC), team selection, judge pair/room, a justification textarea, and an optional image upload. |
| **NonNominated** | `NonNominated.vue` | Shows a data table of teams that have not yet been nominated for any award in the current event. Clicking a row shows the team's photo. |
| **Visits** | `Visits.vue` | Displays a table of all teams with checkboxes for three visit types: AE (Team Attribute), MCI (Mechanical/Control/Innovation), and Extra. Toggling a checkbox immediately updates the backend. |
| **Login** | `Login.vue` | Login form with username and password fields, validated with VeeValidate + Yup. Submits credentials via Passport local strategy to the backend. |
| **Home** | `Home.vue` | Simple welcome card. |
| **AddTeam** | `AddTeam.vue` | Form to manually register a single team with name, number, school, and state (Brazilian states dropdown). |
| **AddUser** | `AddUser.vue` | User registration form with full name, username, password, password confirmation, and permission level. Validated with VeeValidate + Yup. |
| **AddPicture** | `AddPicture.vue` | Upload a photo for a selected team. The image is sent to the backend and stored in AWS S3. |
| **BulkAddTeam** | `BulkAddTeam.vue` | One-click button to bulk import all teams from the FIRST Events API into the system for the current event. |
| **CallBack** | `CallBack.vue` | Legacy awards summary matrix showing all teams vs. all FRC award categories. Supports printing via `print-js`. |

### Utility Components

| Component | File | Description |
|---|---|---|
| **CardTitlePage** | `CardTitlePage.vue` | Reusable styled card for page titles with an icon and description text. |
| **Loader** | `Loader.vue` | Full-screen overlay with a circular progress indicator for loading states. |

## Composables (Services)

### `useApi` (`src/composables/useApi.js`)

Centralized HTTP request handler with built-in Auth0 token management and error handling.

**Features:**
- Automatically attaches Auth0 JWT Bearer token to requests
- Prepends `VUE_APP_SERVER_DOMAIN/api/` to all request URLs
- Handles `401` responses by logging the user out
- Displays error messages via the global snackbar
- Supports both JSON and FormData (multipart) request bodies

**Usage:**
```js
const { apiRequest } = useApi();
const data = await apiRequest("teams", {
  method: "GET",
  headers: { eventCode: "BRBA" },
});
```

### `useSnackbar` (`src/composables/useSnackbar.js`)

Global notification service using shared reactive state.

**Features:**
- `showMessage(message, type)` — displays a success (green) or error (red) snackbar
- Snackbar state is shared across all components via module-level `ref`s

## Store (State Management)

### `eventStore` (`src/stores/eventStore.js`)

Pinia store managing the globally selected event.

**State:**
- `availableEvents` — list of events the user has access to (parsed from Auth0 roles)
- `selectedEvent` — currently selected event (`{ text, value, program }`)
- `selectedProgram` — the program type of the selected event (`"frc"` or `"ftc"`)

**Persistence:** The selected event and program are saved to `localStorage` and restored on page reload.

**Usage:** Components use `eventStore.selectedEvent` to scope API calls to a specific event via the `eventCode` header.

## Plugins

### Validation (`src/plugins/validation.js`)

Configures VeeValidate with global rules (`required`, `email`, `min`, `max`) from `@vee-validate/rules` and sets the locale to **Brazilian Portuguese** (`pt_BR`). Validation runs on input by default.

### Vuetify (`src/plugins/vuetify.js`)

Configures Vuetify 3 with a light theme and custom colors:
- **Primary:** `#0083AE`
- **Secondary:** `#68C3E2`
- **Accent:** `#ABD8E7`

Material Design Icons (`@mdi/font`) are used as the default icon set.

## Role-Based Access

User roles are extracted from the Auth0 JWT token (claim: `https://myapp.example.com/roles`). The navigation menu dynamically shows/hides items based on the user's role:

| Role | Access |
|---|---|
| **admin** | Full access to all pages including Dashboard, event initialization, and judge management |
| **judge** | Access to all pages except team/event creation (AddTeam, BulkAddTeam) |
| **unauthenticated** | Login page only |

Event access is also role-based: each user's roles include event codes (e.g., `BRBA-frc`) that determine which events appear in the event selector dropdown. 
