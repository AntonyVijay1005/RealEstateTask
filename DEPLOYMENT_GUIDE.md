# Deployment Guide for Rently & Co

This guide outlines the steps to deploy your Full Stack Spring Boot + React application.
- **Frontend**: Deploying to [Vercel](https://vercel.com)
- **Backend**: Deploying to [Render](https://render.com)
- **Database**: Using a MySQL Database (Provider required)

## Prerequisites

1.  **Git Repository**: Ensure your code is pushed to a GitHub repository.
2.  **Accounts**:
    *   Create a [Render Account](https://render.com).
    *   Create a [Vercel Account](https://vercel.com).
    *   (Optional but recommended) A managed MySQL database (e.g., Aiven, DigitalOcean, or Render's PostgreSQL if you switch drivers). *This guide assumes you have a MySQL Connection URL.*
        *   *Note*: You can use [Aiven for MySQL](https://aiven.io/mysql) (Free tier) to get a MySQL database URL.
        *   The URL usually looks like: `mysql://user:password@host:port/defaultdb?ssl-mode=REQUIRED`

---

## Phase 1: Deploy Backend (Render)

1.  **Dashboard**: Go to your Render Dashboard and click **New +** -> **Web Service**.
2.  **Connect Repo**: Select your GitHub repository.
3.  **Basic Configuration**:
    *   **Name**: `rently-backend` (or similar)
    *   **Region**: Closest to you (e.g., Singapore, Frankfurt)
    *   **Branch**: `main` (or your working branch)
    *   **Root Directory**: `backend` (Important! Do not leave empty)
    *   **Runtime**: **Docker** (Render will automatically detect the Dockerfile we created)
    *   **Instance Type**: Free
4.  **Environment Variables**:
    Scroll down to "Environment Variables" and add the following:
    *   `SPRING_DATASOURCE_URL`: Your generic MySQL URL.
        *   Example: `jdbc:mysql://<HOST>:<PORT>/<DB_NAME>?createDatabaseIfNotExist=true`
    *   `SPRING_DATASOURCE_USERNAME`: Your database username.
    *   `SPRING_DATASOURCE_PASSWORD`: Your database password.
    *   `JWT_SECRET`: A long random string (e.g., generated via `openssl rand -base64 64` or just a long secure phrase).
    *   `PORT`: `8080` (Render might set this automatically, but good to be explicit).
    *   `ALLOWED_ORIGINS`: `*` (For now, enabling all origins so we can test. We will update this after frontend deployment).
5.  **Deploy**: Click **Create Web Service**.
    *   Render will build your Docker image. This may take a few minutes.
    *   Wait for the logs to show "Started RentlyBackendApplication".
    *   **Copy your Backend URL**: e.g., `https://rently-backend.onrender.com`.

---

## Phase 2: Deploy Frontend (Vercel)

1.  **Dashboard**: Go to your Vercel Dashboard and click **Add New...** -> **Project**.
2.  **Connect Repo**: Import the same GitHub repository.
3.  **Project Configuration**:
    *   **Framework Preset**: **Vite** (Should be detected automatically).
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    *   Expand "Environment Variables".
    *   Key: `VITE_API_URL`
    *   Value: `https://<YOUR_BACKEND_URL>/api/v1`
        *   *Important*: Do not forget the `/api/v1` at the end (unless your backend URL already includes it, which standard Render URLs do not).
        *   Example: `https://rently-backend.onrender.com/api/v1`
5.  **Deploy**: Click **Deploy**.
    *   Vercel will build and deploy your site.
    *   Once done, you will get a **Deployment Domain** (e.g., `https://rently-frontend.vercel.app`).

---

## Phase 3: Secure & Link

Now that the frontend is live, we should secure the backend to only accept requests from your specific frontend domain.

1.  **Update Backend**:
    *   Go back to your **Render Dashboard** -> Your Web Service -> **Environment**.
    *   Edit `ALLOWED_ORIGINS`.
    *   Value: `https://rently-frontend.vercel.app` (Your actual Vercel domain).
    *   Save Changes.
    *   Render will automatically redeploy the backend with the new configuration.

## Verification

1.  Open your Vercel URL.
2.  Try to **Register** a new account.
3.  If successful, log in.
4.  Check the "Network" tab in your browser's Developer Tools (F12) to ensure requests are going to your Render backend and returning `200 OK`.

---

### Troubleshooting

*   **Database Connection Failed**: check your `SPRING_DATASOURCE_URL` in Render logs. Ensure the MySQL server allows connections from public IPs (Render uses dynamic IPs).
*   **CORS Errors**: Check the Developer Console. If you see "Access to XMLHttpRequest... has been blocked by CORS policy", verify your `ALLOWED_ORIGINS` in Render matches your Vercel URL exactly (no trailing slash is usually best).
*   **404 Not Found**: Verify `VITE_API_URL` includes `/api/v1`.
