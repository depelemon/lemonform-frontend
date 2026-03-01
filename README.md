# 🍋 LemonForm Frontend

The frontend for **LemonForm** — a form builder application (like Google Forms) with a lemon twist. Built with [Next.js](https://nextjs.org), [React](https://react.dev), [TypeScript](https://www.typescriptlang.org), and [Tailwind CSS](https://tailwindcss.com).

---

## 🚀 Features

- **Welcome landing page** — Hero section with CTAs for unauthenticated visitors
- **Authentication** — Register & login with JWT stored in localStorage
- **Form management** — Create, edit, and delete forms with live question editing
- **Question types** — Short answer, radio, checkbox, and dropdown
- **Search, filter & sort** — Find forms by title, filter by status, sort by date or title
- **Public form responses** — Share a link for anyone to fill out (no login needed)
- **Response viewer** — View all submissions for a form
- **Dark mode** — Full dark theme with custom color palette
- **Custom components** — Reusable Button, Input, Select, NavBar, and Footer

---

## 📁 Project Structure

```
lemonform-frontend/
├── app/
│   ├── page.tsx              # Welcome / landing page
│   ├── layout.tsx            # Root layout with NavBar & Footer
│   ├── globals.css           # Tailwind + custom theme variables
│   ├── components/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── NavBar.tsx
│   │   ├── Footer.tsx
│   │   └── Providers.tsx     # Auth context provider wrapper
│   ├── lib/
│   │   ├── api.ts            # API client functions
│   │   ├── AuthContext.tsx    # JWT auth state management
│   │   └── types.ts          # TypeScript interfaces
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   └── forms/
│       ├── page.tsx          # Form list (search, filter, sort)
│       ├── new/              # Create new form
│       └── [id]/
│           ├── page.tsx      # View form detail & responses
│           ├── edit/         # Edit form & questions
│           └── respond/      # Public response page
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config (via postcss)
```

---

## 💠 Getting Started

### Prerequisites

- Node.js 18 or newer
- The [LemonForm Backend](https://github.com/depelemon/lemonform-backend) running

### Installation

```bash
# Clone the repository
git clone https://github.com/depelemon/lemonform-frontend.git
cd lemonform-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE` | Base URL of the LemonForm backend API |

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run fullstack  # Run frontend + backend concurrently
```

---

## 📄 License

This project is licensed under the MIT License.
