1. Purpose and scope
Product: Public church website and member/admin tools for 10th Avenue Bible Chapel.
Out of scope in code: The frontend assumes a separate REST API (JSON) at a configurable base URL; it does not implement server logic.
2. Technical stack
Area	Requirement
Runtime / framework	React 19 with Create React App (react-scripts 5.0.1), TypeScript 4.9.x
Routing	react-router-dom 7.x, BrowserRouter, lazy-loaded route components with Suspense
Calendar	FullCalendar (@fullcalendar/react, daygrid, interaction)
Dates	date-fns
HTTP	Native fetch via a central API layer (api.ts)
Testing	Jest + React Testing Library (CRA defaults)
Optional tooling	wrangler in devDependencies (deployment/target not enforced by app code alone)
3. Environment and configuration
Build-time variable: REACT_APP_API_URL — base URL for the API (must include path prefix if the API is mounted under /api). If unset, the app falls back to a hard-coded production URL in api.ts (document this for ops).
Secrets: No API keys in the frontend; JWT stored in localStorage under token.
4. Deployment / hosting expectations
SPA: Client-side routes must resolve to index.html on refresh/deep links.
Documented server behavior: public/.htaccess supports Apache / LiteSpeed rewrite to index.html (with optional subfolder RewriteBase).
5. Information architecture (routes)
From App.tsx:

Path	Page
/	Home
/about	About
/bulletin	Bulletin
/prayer	Prayer
/sermon	Sermons listing
/sermon/:seriesId	Sermon series detail
/contact	Contact
/login	Login / registration flow
/members	Members area (tabs differ for admin vs member)
/profile	User profile
Global shell: Header, Footer, scroll-to-top on navigation, global ErrorBoundary, Toast provider, Auth provider.

6. Functional requirements (by feature)
Public / mixed

Home / About / Contact: Static or CMS-like church content (contact uses API — see below).
Bulletin: Consumes announcements API for public bulletin content (with admin edit capability surfaced elsewhere per page logic).
Prayer: Submit prayer requests (public POST); listing/management may require auth per API design.
Sermons: List/filter sermons; navigate by series; detail views backed by sermons API.
Calendar: Display events; admin can manage events in Members when role === "ADMIN" (FullCalendar integration).
Contact form: POST to /contact with name, email, message.
Authentication

Login and registration via /auth/login, /auth/register.
Session: JWT in localStorage; on load, if token exists, call /auth/me to restore user; invalid token is cleared.
Profile: view/update via /auth/me (GET, PATCH).
Authorization (as implemented)

ADMIN: Extra tabs in /members for announcements, calendar, sermons, and user approval (PATCH /users/:id/approval).
isApproved: Shown in Profile; admins are treated as approved in context logic; non-approved users see pending state where UI exposes it.
7. Backend contract (API surface used by the frontend)
The client expects JSON endpoints under API_BASE_URL (normalized with a trailing / semantics in resolveApiUrl):

Auth: POST /auth/login, POST /auth/register, GET /auth/me, PATCH /auth/me
Announcements: CRUD under /announcements (public read as used by bulletin; mutating routes use Authorization: Bearer)
Calendar: CRUD under /calendar
Sermons: CRUD under /sermons, plus GET /sermons/series/:seriesName
Prayer requests: /prayer-requests (create may be unauthenticated; list/update/delete use Bearer where coded)
Users (admin): /users, /users/:id, /users/:id/approval, delete user
Contact: POST /contact
Non-functional: Responses for errors should be JSON where possible (client parses with apiErrorHandler). CORS must allow the frontend origin. Network failures surface a dedicated NetworkError message.

8. UX and quality attributes
Code splitting on routes to reduce initial bundle size.
Loading states (e.g. LoadingSpinner during lazy load).
Accessible/error UX: ErrorBoundary, formatted API errors, toasts on auth/actions.
Visual polish: Scroll-reveal hooks, skeleton loaders for sermon cards, pagination where lists are long.
9. Content constants
Church copy, nav labels, weekly service times, Zoom links, contact block, and event category metadata live largely in src/constants/index.ts (not purely API-driven).
