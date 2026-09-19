# i-Computers

## Deployment architecture

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Product images: Cloudinary
- Authentication: JWT + Google OAuth

### Why Cloudinary?

Render's local filesystem is not persistent for runtime uploads. Product images uploaded by an admin must therefore be stored in an external object/image service.

## Render environment variables

Set these in the backend Render service:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=long_random_secret

CLIENT_URLS=https://YOUR-VERCEL-DOMAIN.vercel.app,http://localhost:5173

GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
```

Do not put these secrets in GitHub.

## Vercel environment variables

Set these for the frontend:

```env
VITE_BACKEND_URL=https://YOUR-RENDER-SERVICE.onrender.com/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com
```

Because Vite variables are embedded at build time, redeploy the Vercel project after changing them.

## Google OAuth

Use one Google OAuth **Web application** client ID.

Authorized JavaScript origins should include:

```text
http://localhost:5173
https://YOUR-VERCEL-DOMAIN.vercel.app
```

If you have a custom Vercel domain, add that exact origin too.

The value must be identical in:

- Render: `GOOGLE_CLIENT_ID`
- Vercel: `VITE_GOOGLE_CLIENT_ID`

## Important image migration note

Old products created by the previous version may contain local filenames such as:

```text
1789763050536-image.jpg
```

Those old files are served by `/uploads` only as a legacy fallback. New uploads are saved as permanent Cloudinary URLs.

If an old image is missing after deployment, edit that product and upload the image again. After that it will use Cloudinary and will survive Render restarts/redeploys.

## Deploy

### Backend on Render

Root directory:

```text
i-computers-backend-batch-tweleve-main
```

Build command:

```text
npm install
```

Start command:

```text
npm start
```

### Frontend on Vercel

Root directory:

```text
i-computers-frontend-batch-tweleve-main
```

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

`vercel.json` is included so React Router deep links work.

## After deployment

1. Open `https://YOUR-RENDER-SERVICE.onrender.com/`
2. Confirm the API returns `i-Computers API is running`.
3. Open the Vercel site.
4. Test normal email/password login.
5. Test Google login.
6. Log in as admin.
7. Add a product with an image.
8. Refresh the page and confirm the image still loads.
9. Edit the product and replace its image.
10. Refresh again and confirm the new image loads.
