# React + Vite

## Connecting to the backend

The frontend communicates with the Express API; it does not connect directly to MongoDB.

1. Configure `backend/.env` from `backend/.env.example`, including `MONGO_URI` and `JWT_SECRET`, then start the backend with `npm run dev` from `backend`.
2. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL` to the backend API URL (by default, `http://localhost:5000/api/v1`).
3. Keep `VITE_USE_API=true` to load products from the API and submit orders through the backend.
4. Start the frontend with `npm run dev` from `frontend`.

The API mode requires a running backend and a reachable MongoDB database. Login stores the returned bearer token for protected cart and order requests.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
