
## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Git

## Setup

### 1. Clone

```bash
git clone <your-repository-url>
cd lms-project
```

### 2. Database

```bash
psql -U postgres
```

```sql
CREATE DATABASE lms_db;
\q
```

### 3. Backend

```bash
cd backend
python -m venv venv

# macOS / Linux
source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env        # Windows: copy .env.example .env
```

Open `backend/.env` and set your values:

```env
SECRET_KEY=any-long-random-string
DEBUG=True
DB_NAME=db_lms
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
```

Run migrations, load the categories and start the server:

```bash
python manage.py migrate
python manage.py shell -c "from courses.models import Category; [Category.objects.get_or_create(name=n) for n in ['Programming','Web Development','Design','Data Science','Marketing']]"
python manage.py runserver
```

The API runs at http://127.0.0.1:8000/api/

### 4. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173/

To use a different API address, create `frontend/.env` with:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Admin

Create an admin account:

```bash
python manage.py createsuperuser
```

Then log in at http://127.0.0.1:8000/admin/

## Create test users

The React app has a Login page only (per the requirements), so register users through the API:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Pass12345!","role":"teacher"}'

curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Sarah Khan","email":"sarah@example.com","password":"Pass12345!","role":"student"}'
```

Then log in at http://localhost:5173/login.

Lessons are also added through the API:

```bash
curl -X POST http://127.0.0.1:8000/api/courses/1/lessons/ \
  -H "Authorization: Bearer <teacher-access-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Introduction to React","description":"What is React","video_url":"https://youtu.be/abc1","order":1}'
```

## API Endpoints

| Method | URL | Access |
|---|---|---|
| POST | `/api/auth/register/` | public |
| POST | `/api/auth/login/` | public |
| POST | `/api/auth/token/refresh/` | public (valid refresh token) |
| GET | `/api/categories/` | logged in |
| GET | `/api/courses/` | logged in (published courses) |
| GET | `/api/courses/<id>/` | logged in (draft: owner only) |
| GET | `/api/courses/my/` | teacher |
| POST | `/api/courses/` | teacher |
| PUT / PATCH / DELETE | `/api/courses/<id>/` | owner teacher |
| POST | `/api/enrollments/` | student |
| GET | `/api/enrollments/my-courses/` | student |
| GET | `/api/courses/<id>/lessons/` | owner teacher, enrolled student |
| POST | `/api/courses/<id>/lessons/` | owner teacher |
| GET | `/api/lessons/<id>/` | owner teacher, enrolled student |
| PUT / PATCH / DELETE | `/api/lessons/<id>/` | owner teacher |
| GET | `/api/comments/?commentable_type=course&commentable_id=1` | logged in, with access to the target |
| POST | `/api/comments/` | logged in, with access to the target |

Send the token as `Authorization: Bearer <access-token>`.

Comment body:

```json
{ "commentable_type": "course", "commentable_id": 1, "body": "Great course!" }
```

`commentable_type` accepts only `course` or `lesson`. Anything else returns 400, and a missing target returns 404.



- The JWT access token lasts 1 day to keep the frontend simple. A production app would use a short lifetime with refresh.
- The token is stored in `localStorage` for simplicity.