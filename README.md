# Vibesta

Vibesta is a social media application inspired by Instagram, built with the MERN stack. It provides users with a platform to share photos, connect with others, and interact through chat messaging.

## Features

- **User Authentication**: Sign up and log in to access personalized features.
- **Photo Sharing**: Upload and share images with your network.
- **User Profiles**: Create and manage your profile, including updating personal details.
- **Chat Messaging**: Real-time messaging feature to communicate with friends using Socket.IO.
- **Comments**: Engage with shared content by liking and commenting on posts.
- **Feed**: View a dynamic feed of posts from users you follow.
- **Profile Customization**: Change profile details, including profile picture and bio.

## Project Structure

The project is a monorepo managed with [Turborepo](https://turbo.build/) and npm workspaces:

```
.
├── apps
│   ├── backend      # Express.js API and Socket.IO server
│   └── frontend     # React + Vite client
├── package.json     # Workspace root, turbo scripts
└── turbo.json       # Turborepo task pipeline
```

## Technologies Used

- **Monorepo**: Turborepo with npm workspaces
- **Frontend**: React, Vite, Redux (for state management), Tailwind CSS and Axios
- **Backend**: Node.js, Express.js, JWT, Bcrypt and Cloudinary
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB instance (local or Atlas)

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

4. Configure the environment variables in `apps/backend/.env`:
   `PORT`, `MONGO_URI`, `SECRET_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

### Development

Run both the backend and frontend dev servers concurrently:

```bash
npm run dev
```

- Backend API runs at `http://localhost:8000` (or the PORT from `.env`).
- Frontend dev server runs at `http://localhost:5173`.

### Build

Build all packages with Turborepo:

```bash
npm run build
```

### Production

Build the frontend, then start the backend API:

```bash
npm run build
npm start
```

### Other Commands

```bash
npm run lint    # Run linters across all workspaces
npm run clean   # Clean build artifacts
```

## Usage

- Create an account or log in to access the app.
- Upload photos, send messages, and interact with other users.

## Contributing

Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all the contributors and the open-source community.
