# i-Computers — MERN E-commerce

A complete MERN e-commerce starter with customer shopping, authentication, Google Sign-In, product management, order management and an admin control panel.

## Stack
- Frontend: React + Vite + Tailwind CSS + React Router
- Backend: Node.js + Express
- Database: MongoDB / MongoDB Atlas
- Auth: JWT + Google Identity Services
- Uploads: Multer

## 1. Backend
```bash
cd i-computers-backend-batch-tweleve-main
npm install
```
Copy `.env.example` to `.env` and set:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `GOOGLE_CLIENT_ID` if Google Sign-In is required

Start:
```bash
npm run dev
```
Backend: http://localhost:5000
Health check: http://localhost:5000/api/health

## 2. Create the first admin
Set these values in backend `.env`:
```env
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```
Then run:
```bash
npm run create-admin
```
After that, the admin can open **Admin Panel → Users** and change another user's role to Admin or Customer.

Public registration always creates a Customer account.

## 3. Frontend
```bash
cd i-computers-frontend-batch-tweleve-main
npm install
```
Set frontend `.env`:
```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id.apps.googleusercontent.com
```
Start:
```bash
npm run dev
```
Frontend: http://localhost:5173

## 4. Google Login setup
In Google Cloud Console, create an OAuth Client ID for a **Web application**.
Add this Authorized JavaScript origin:
```text
http://localhost:5173
```
Put the Web Client ID in both:
- frontend `.env` → `VITE_GOOGLE_CLIENT_ID`
- backend `.env` → `GOOGLE_CLIENT_ID`

The backend verifies the Google ID token with Google's tokeninfo endpoint and checks the expected audience before creating the application's JWT session.

## Main features
- Customer register/login/logout
- Google Sign-In / Sign-Up
- Persistent JWT session
- Product catalogue and product details
- Cart with stock-aware quantities
- Checkout and orders
- Customer order history
- Profile settings
- Admin dashboard
- Add/edit/delete products
- Product image uploads
- View/update order status
- Search/filter users
- Block/unblock users
- Promote/demote users between Customer/Admin
- Easy Storefront ↔ Admin Panel navigation
- Responsive modern UI

## Important
Do not commit `.env` files or real secrets to GitHub. Use `.env.example` as the template.
