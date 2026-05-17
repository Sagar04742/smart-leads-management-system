# Leadflow — Smart Lead Management

Full-stack Lead Management Dashboard. MERN + TypeScript + Vite.

## Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, React Query, React Router
- **Backend**: Node.js, Express, TypeScript, Mongoose
- **Auth**: JWT + bcrypt
- **DevOps**: Docker + Docker Compose

## Setup

### Manual (development)

**Backend**
```bash
cd backend
cp .env.example .env    # edit MONGO_URI + JWT_SECRET
npm install
npm run dev             # → http://localhost:5000
```

**Frontend**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev             # → http://localhost:5173
```

### Docker
```bash
docker-compose up --build
```

## API

All lead routes require `Authorization: Bearer <token>`.

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/leads | List (filtered + paginated) |
| POST | /api/leads | Create |
| GET | /api/leads/:id | Single lead |
| PUT | /api/leads/:id | Update |
| DELETE | /api/leads/:id | Delete |
| GET | /api/leads/export/csv | CSV export |

### Filters

```
GET /api/leads?status=Qualified&source=Instagram&search=rahul&sort=latest&page=1
```

## RBAC

| Action | Admin | Sales |
|--------|-------|-------|
| All leads | ✅ | Own only |
| Create | ✅ | ✅ |
| Update | Any | Own only |
| Delete | Any | Own only |
| CSV Export | ✅ | ✅ (filtered) |
