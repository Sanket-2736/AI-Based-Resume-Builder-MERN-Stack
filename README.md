# AI Resume Builder

A full-stack resume builder with AI-powered enhancements, profile image uploads via ImageKit, and multiple professional templates.

## Features

- **JWT Authentication** — register, login, and protected routes
- **Resume CRUD** — create, update, delete, and fetch resumes
- **AI Enhancements (Gemini)** — enhance professional summaries and job descriptions using Google Gemini via the OpenAI-compatible SDK
- **PDF Import** — upload an existing PDF resume and let AI extract structured data automatically
- **Profile Image Upload (ImageKit)** — upload profile photos with automatic face-crop transformation; optional background removal
- **Public Resume Sharing** — mark a resume as public and share it via a link
- **4 Resume Templates** — choose and preview templates with a custom accent color

---

## Templates

| Template | Description |
|---|---|
| **Modern** | Colored header with profile photo, accent-colored skill badges, two-column education/skills grid |
| **Classic** | Traditional single-column layout with left-bordered experience entries and icon-based contact info |
| **Minimal** | Clean, typography-focused layout with dot-separated skills and wide spacing |
| **Minimal Image** | Two-column sidebar layout with profile photo, sidebar for contact/education/skills, main area for experience and projects |

All templates accept a custom `accentColor` prop for personalization.

---

## Tech Stack

### Client
- React 19 + Vite
- Redux Toolkit (auth state)
- React Router v7
- Tailwind CSS v4
- Axios
- react-pdftotext (PDF parsing)
- lucide-react (icons)

### Server
- Node.js + Express 5
- MongoDB + Mongoose
- JWT + bcrypt (auth)
- Multer (file uploads)
- ImageKit Node SDK (image storage & transformation)
- OpenAI SDK pointed at Gemini API (AI features)

---

## Project Structure

```
├── client/          # React frontend
│   └── src/
│       ├── app/             # Redux store & slices
│       ├── assets/templates # 4 resume templates
│       ├── components/      # Forms, Navbar, ResumePreview, etc.
│       └── pages/           # Home, Login, Dashboard, ResumeBuilder, Preview
└── server/          # Express backend
    ├── configs/     # DB, ImageKit, Multer, AI client
    ├── controllers/ # User, Resume, AI controllers
    ├── middleware/  # JWT auth middleware
    ├── models/      # User & Resume Mongoose models
    └── routes/      # Auth, resume, AI routes
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- [ImageKit](https://imagekit.io) account
- [Google AI Studio](https://aistudio.google.com) API key (Gemini)

### Server Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Gemini via OpenAI-compatible SDK
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

```bash
npm run server   # dev with nodemon
# or
npm start        # production
```

### Client Setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

---

## API Routes

### Auth — `/api/users`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login and receive JWT |
| GET | `/me` | Yes | Get current user |
| GET | `/resumes` | Yes | Get all resumes for user |

### Resumes — `/api/resumes`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create` | Yes | Create a new resume |
| PUT | `/update` | Yes | Update resume (supports image upload) |
| DELETE | `/:resumeId` | Yes | Delete a resume |
| GET | `/:resumeId` | Yes | Get resume by ID |
| GET | `/public/:resumeId` | No | Get a public resume |

### AI — `/api/ai`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/enhance-summary` | Yes | Enhance professional summary |
| POST | `/enhance-description` | Yes | Enhance job description |
| POST | `/upload-resume` | Yes | Parse PDF text into structured resume data |

---

## ImageKit Integration

Profile images are uploaded through the server using the ImageKit Node SDK. On upload, a transformation is applied automatically:

- Face-centered crop to 300×300
- Optional background removal (pass `removeBackground: true`)

The resulting URL is stored in the resume's `personal_info.image` field and rendered in the Modern and Minimal Image templates.

---

## Gemini AI Integration

The server uses the OpenAI-compatible SDK configured to hit the Gemini API endpoint. Three AI features are available:

- **Enhance Summary** — rewrites a professional summary to be ATS-friendly
- **Enhance Description** — rewrites a job description using action verbs and quantifiable results
- **Resume Import** — extracts structured JSON from raw PDF text, creating a fully populated resume in one step
