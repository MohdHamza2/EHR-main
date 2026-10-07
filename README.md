# Metapharsic Lifesciences EHR

Market-leading electronic health record system designed for modern healthcare providers. Built with Next.js, TypeScript, and Prisma.

## Key Features

- **Clinical Engine:** Advanced rule-based clinical decision support and data processing.
- **Patient Management:** Comprehensive API for retrieving, updating, and managing patient records (`/api/patients`).
- **Secure Authentication:** Integrated with NextAuth for secure, role-based access control.
- **Modern UI:** Built with Radix UI, Tailwind CSS, and Framer Motion for an accessible and responsive user experience.
- **Database Architecture:** Powered by PostgreSQL and Prisma ORM, complete with extensive clinical seed data.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database & ORM:** PostgreSQL & [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **State Management:** Zustand & React Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy the `.env.example` file to `.env` and fill in your database and authentication variables:
```bash
cp .env.example .env
```

3. Initialize the database:
Generate the Prisma client, apply migrations, and seed the clinical data:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js application routes and API endpoints.
- `/src/lib` - Core business logic, clinical engine, and authentication utilities.
- `/prisma` - Database schema (`schema.prisma`) and seeding scripts (`seed_clinical.ts`).

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run db:studio`: Opens Prisma Studio to view and manage database records.
- `npm run type-check`: Runs TypeScript compiler checks.
- `npm test`: Runs the test suite using Vitest.
