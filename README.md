# ZenithPost

ZenithPost is a full-stack web application designed to provide a seamless and engaging platform for reading and publishing articles, similar to Medium. It features a modern frontend built with React and Tailwind CSS, and a robust backend powered by Hono, running on Cloudflare Workers with Prisma ORM for database interactions.

## ✨ Features

*   **User Authentication:** Secure signup and signin functionality using JWT.
*   **Blog Post Management (CRUD):**
    *   Create new blog posts with a rich text editor (or markdown).
    *   Read published blog posts.
    *   Update existing blog posts (author only).
    *   Delete blog posts (author only).
*   **Browse Posts:** View a list of all published blog posts.
*   **Responsive Design:** User-friendly interface across various devices.
*   **Optimistic Updates (Optional):** For a smoother user experience when creating/updating content.

## 🚀 Tech Stack

**Frontend:**
*   **React:** JavaScript library for building user interfaces.
*   **Vite:** Next-generation frontend tooling for fast development.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **React Router DOM:** For client-side routing.
*   **Axios (or Fetch API):** For making HTTP requests to the backend.
*   **Zod (via common package):** For frontend validation of shared types.

**Backend:**
*   **Hono:** A small, simple, and ultrafast web framework for the Edge.
*   **Cloudflare Workers:** Serverless execution environment.
*   **Prisma:** Next-generation ORM for Node.js and TypeScript.
*   **PostgreSQL (or your chosen DB):** Relational database.
*   **JWT (JSON Web Tokens):** For authentication.
*   **BcryptJs:** Password hashing and storing the hashed password in the DB.
*   **Zod:** For input validation.
*   **TypeScript:** Superset of JavaScript adding static types.

**Common Package (`@NIGHTMARE09/zenithpost-common` or similar):**
*   **Zod Schemas:** Shared data validation schemas between frontend and backend.
*   **TypeScript Types:** Shared type definitions.

## 🏁 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm, yarn, or pnpm
*   Access to a PostgreSQL database (or your chosen database)
*   A Cloudflare account (if deploying the backend to Cloudflare Workers)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/NIGHTMARE09/ZenithPost.git
    cd ZenithPost
    ```

2.  **Setup Backend:**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        # or yarn install or pnpm install
        ```
    *   Create a `.env` file by copying `.env.example`:
        ```bash
        cp .env.example .env
        ```
    *   Update the `.env` file with your database connection string (`DATABASE_URL`) and JWT secret (`JWT_SECRET`).
        ```env
        DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
        JWT_SECRET="your-super-secret-jwt-key"
        # Add any other necessary backend environment variables
        ```
    *   Run Prisma migrations to set up the database schema:
        ```bash
        npx prisma migrate dev
        # or yarn prisma migrate dev
        ```
    *   (Optional) Seed the database if you have a seed script:
        ```bash
        npx prisma db seed
        # or yarn prisma db seed
        ```

3.  **Setup Frontend:**
    *   Navigate to the frontend directory (from the root):
        ```bash
        cd ../frontend 
        # or cd frontend if you are in the root directory
        ```
    *   Install dependencies:
        ```bash
        npm install
        # or yarn install or pnpm install
        ```
    *   Create a `.env` file by copying `.env.example` (if you have one for the frontend):
        ```bash
        cp .env.example .env
        ```
    *   Update the `.env` file with the backend URL. For Vite, it would be something like:
        ```env
        VITE_BACKEND_URL="http://localhost:8787" 
        # Change port if your backend runs on a different one locally
        ```

4.  **Setup Common Package (if developing locally):**
    *   If you have a `common` package within your monorepo that you're linking locally (e.g., using npm workspaces, yarn workspaces, or pnpm workspaces), ensure it's built or linked correctly. If it's published to npm, this step might just be part of the `npm install` in frontend/backend.
    *   Navigate to the common directory (from the root):
        ```bash
        cd ../common 
        # or cd common if you are in the root directory
        ```
    *   Install dependencies and build (if necessary):
        ```bash
        npm install
        npm run build # If you have a build script for the common package
        ```

### Running Locally

1.  **Start the Backend Server:**
    *   In the `backend` directory:
        ```bash
        npm run dev 
        # This command might be 'wrangler dev' if using Cloudflare Workers
        ```
    *   The backend should typically be running on `http://localhost:8787` (Cloudflare Workers default) or another port if configured.

2.  **Start the Frontend Development Server:**
    *   In the `frontend` directory:
        ```bash
        npm run dev
        ```
    *   The frontend should typically be running on `http://localhost:5173` (Vite default) or another port.

3.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

## 🔧 API Endpoints (Overview)

Here are some of the main API endpoints:

*   **Users:**
    *   `POST /api/v1/user/signup`: Register a new user.
    *   `POST /api/v1/user/signin`: Log in an existing user.
*   **Blogs:**
    *   `POST /api/v1/blog`: Create a new blog post (Auth required).
    *   `PUT /api/v1/blog`: Update an existing blog post (Auth required, author only).
    *   `GET /api/v1/blog/:id`: Get a specific blog post.
    *   `GET /api/v1/blog/bulk`: Get all blog posts (consider pagination).
    *   `DELETE /api/v1/blog/:id`: Delete a blog post (Auth required, author only).

*(Refer to the backend route definitions for detailed request/response formats.)*

## ☁️ Deployment

*   **Backend (Cloudflare Workers):**
    *   Configure your Cloudflare account and Wrangler.
    *   Use `wrangler deploy` (or `npm run deploy` if aliased) from the `backend` directory.
    *   Make sure to set up environment variables (DATABASE_URL, JWT_SECRET) in your Cloudflare Worker settings.

*   **Frontend (Vercel/Netlify/etc.):**
    *   Connect your GitHub repository to Vercel (or your preferred hosting provider).
    *   Configure the build command (e.g., `npm run build` or `vite build`).
    *   Set the publish directory (e.g., `dist` for Vite).
    *   Add environment variables (e.g., `VITE_BACKEND_URL` pointing to your deployed backend worker URL).

## 🤝 Contributing (Optional)

Contributions are welcome! If you'd like to contribute, please follow these steps:
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License (Optional)

This project is licensed under the MIT License - see the `LICENSE` file for details (if you choose to add one).

---
**Author**

Shivam Jha / (https://github.com/NIGHTMARE09)

---
