# Vibesta

Vibesta is a social media application inspired by Instagram, built with the MERN stack. It provides a platform for users to share photos, connect with others, and interact through real-time chat messaging.

## Features

- **User Authentication**: JWT-based sign up, login, and logout with password hashing.
- **Photo Sharing**: Upload images (processed with `multer` + `sharp`) stored via Cloudinary.
- **User Profiles**: Create and manage your profile, including profile picture, bio, and personal details.
- **Chat Messaging**: Real-time one-to-one messaging powered by Socket.IO.
- **Social Engagement**: Like and comment on posts from users you follow.
- **Feed**: View a dynamic feed of posts from the people you follow.
- **Profile Customization**: Update profile details, including profile picture and bio.

## Project Structure

Vibesta is a monorepo managed with [Turborepo](https://turbo.build/) and npm workspaces:

```
.
├── apps
│   ├── backend                    # Express.js API + Socket.IO server
│   │   ├── app.js                 # Entry point; wires up middleware and routes
│   │   ├── controllers/           # Request handlers for users, posts, messages
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # /api/v1/user, /api/v1/post, /api/v1/message
│   │   ├── middlewares/           # Auth, upload, and validation middleware
│   │   ├── socket/                # Socket.IO server + connection handling
│   │   ├── utils/                 # DB connection and helpers
│   │   └── scripts/               # seed.js, verify.js (sample/bulk data)
│   └── frontend                   # React + Vite client
│       ├── src/components/        # UI components (Radix/shadcn-style)
│       ├── src/redux/             # Redux Toolkit slices + persisted store
│       ├── src/hooks/             # Custom hooks (e.g. Socket.IO)
│       ├── src/lib/               # Utilities and client setup
│       ├── app.jsx                # App shell + routes
│       ├── main.jsx               # React entry point
│       └── index.css              # Tailwind entry styles
├── package.json                   # Workspace root + turbo scripts
└── turbo.json                     # Turborepo task pipeline
```

## API Endpoints

The backend exposes three REST namespaces under the `/api/v1` prefix:

| Namespace | Description |
| --- | --- |
| `/api/v1/user` | Authentication and profile operations |
| `/api/v1/post` | Post upload, like, comment, and feed operations |
| `/api/v1/message` | Chat/conversation endpoints |

## Technologies Used

- **Monorepo**: Turborepo with npm workspaces
- **Frontend**: React 18, Vite, React Router, Redux Toolkit + Redux Persist, Tailwind CSS, Radix UI (shadcn-style), Axios, Socket.IO client, sonner (toasts)
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Mongoose, Multer + Sharp, Cloudinary, Socket.IO, cookie-parser
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO

## Getting Started

### Prerequisites

- Node.js (v18 or later — this repo uses npm@10 via `packageManager`)
- npm
- A MongoDB instance (local or Atlas)
- A Cloudinary account (for image uploads)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vibesta.git
   ```

2. Navigate to the project directory:
   ```bash
   cd vibesta
   ```

3. Install all workspace dependencies:
   ```bash
   npm install
   ```

4. Configure the environment variables. Create `apps/backend/.env` (the app reads it from there) with the following keys:

   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/vibesta
   SECRET_KEY=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Development

Run both the backend and frontend dev servers concurrently:

```bash
npm run dev
```

- Backend API runs at `http://localhost:3000` by default (falls back to `3000` when `PORT` is unset; override it in `.env`).
- Frontend dev server runs at `http://localhost:5173` (the only permitted CORS origin).

### Creating Sample Data

To populate the database with bulk/faker data (useful for development):

```bash
npm run seed            # Seed the database
npm run seed:verify     # Verify the inserted data
```

> These are scoped to the backend workspace. Alternatively run them from `apps/backend`.

### Build

Build all packages with Turborepo:

```bash
npm run build
```

> Note: the frontend produces a Vite production build (`dist/`), while the backend `build` step performs a Node syntax check — it does not bundle code.

### Production

Production is split across two hosts:

- **Frontend** – `https://vibesta-frontend.vercel.app` (Vercel, serves the Vite
  `dist/` build)
- **Backend / API** – `https://vibesta.onrender.com` (Render, Express +
  Socket.IO)

Key production configuration:

- **CORS** – `app.js` and `socket/socket.js` whitelist
  `https://vibesta.onrender.com` and `https://vibesta-frontend.vercel.app` by
  default.  Additional origins can be added at deploy time via the
  `CORS_ORIGINS` environment variable (comma-separated).
- **Frontend API** – `src/lib/api.js` falls back to
  `https://vibesta.onrender.com` when `VITE_API_BASE_URL` is unset.  A committed
  `.env.production` pins both `VITE_API_BASE_URL` and `VITE_SOCKET_URL` to the
  Render backend so that `vite build` embeds the correct endpoints.
- **Keep-alive** – `utils/keepAlive.js` pings
  `https://vibesta.onrender.com/login` (and `streamtalk.onrender.com`) to keep
  the free-tier Render service warm.  URLs are configurable via
  `KEEP_ALIVE_URLS`.
- **Secrets** – keep `MONGO_URI`, `SECRET_KEY`, and Cloudinary credentials in
  the Render dashboard environment, not in the committed `.env`.

Build the frontend and start the backend API:

```bash
npm run build
npm start
```

### Other Commands

```bash
npm run lint            # Run linters across all workspaces
npm run format          # Format all sources with Prettier
npm run format:check    # Verify formatting without writing
npm run clean           # Clean build artifacts/caches
```

## Usage

- Create an account or log in to access the app.
- Upload photos, send messages, and interact with other users.

## Contributing

Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all the contributors and the open-source community.