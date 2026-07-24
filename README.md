# Viquoe Hub

A lightweight, high-trust B2B procurement web application purpose-built for African institutional buyers and regional suppliers. Viquoe Hub streamlines the corporate procurement lifecycle into a fast, transparent Request for Quote (RFQ) system, solving regional bottlenecks around supplier trust, network latency, and multi-channel communication.

## 🚀 The Vision

Traditional e-commerce carts and chaotic email threads fail complex corporate procurement workflows. Viquoe Hub bridges this gap by introducing a resilient, secure platform that optimizes the B2B supply chain across Africa.

## ⚡ Key MVP Features

* **Single Corporate Buyer Model**: A lean, single-tier workflow to create RFQs, invite bids, compare offers, and award contracts instantly.
* **Lightweight Verification Pipeline**: Secure business vetting via document uploads (CAC/Business Registration and address validation) managed via an admin verification toggle.
* **Mobile-First Supplier Channels**: Automated [WhatsApp](https://whatsapp.com) alerts paired with a fast web interface so suppliers can review and bid on opportunities from anywhere.

## 🛠️ Tech Stack

### Frontend & Design
* **Framework**: [Next.js](https://nextjs.org) (App Router)
* **Styling**: [Tailwind CSS](https://tailwindcss.com)
* **Performance**: Optimized via React Server Components for sub-2-second loads on 3G networks.
* **Typography**: **[Inter](https://google.com)** for dense, readable data tables and **[Plus Jakarta Sans](https://google.com)** for modern headings.

### Backend & Infrastructure
* **Database & BaaS**: [Supabase](https://supabase.com) (PostgreSQL)
* **Security**: Row Level Security (RLS) policies for complete multi-tenant data isolation.
* **Authentication**: Secure session cookie authentication via `@supabase/ssr`.
* **Asynchronous Notifications**: [Next.js API Routes](https://nextjs.orgdocs/app/building-your-application/routing/route-handlers) integrated with [Twilio](https://twilio.com) / [Meta WhatsApp APIs](https://facebook.com) for automated supplier matching and pinging.

---

## 💻 Getting Started

Clone the repository and install the dependencies to get the development environment running locally.

### Prerequisites

* Node.js (v18+)
* npm, yarn, or pnpm
* A Supabase Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com
cd viquoe-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env.local` file in the root directory and add your Supabase and Twilio credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
WHATSAPP_PHONE_NUMBER=your_twilio_whatsapp_number
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🤝 Contributing

We welcome contributions to Viquoe Hub! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

*viquoe-hub/
├── app/
│   ├── (auth)/                  # Auth route group (shared layout if needed)
│   │   ├── login/
│   │   │   └── page.tsx         # /login
│   │   └── signup/
│   │       └── page.tsx         # /signup
│   │
│   ├── (buyer)/                 # Buyer Portal (Protected)
│   │   └── buyer/
│   │       └── rfq/
│   │           ├── new/         # /buyer/rfq/new (Create RFQ)
│   │           └── [id]/        # /buyer/rfq/[id] (View RFQ details)
│   │
│   ├── (supplier)/              # Supplier Portal (Protected)
│   │   └── dashboard/
│   │       ├── page.tsx         # /dashboard (Supplier Feed/Bids)
│   │       └── onboarding/      # /dashboard/onboarding (Supplier Profile setup)
│   │
│   ├── api/                     # Backend Webhooks / API Handlers
│   │   └── auth/
│   │       └── callback/        # Supabase OAuth/Email verification callback
│   │           └── route.ts
│   │
│   ├── layout.tsx               # Root Layout
│   ├── page.tsx                 # Public Landing Page (/)
│   └── global.css
│
├── lib/
│   └── supabase/                # Supabase Clients
│       ├── client.ts            # Browser Client (createBrowserClient)
│       ├── server.ts            # Server Component/Action Client (createServerClient)
│       └── middleware.ts        # Middleware helper for token refresh
│
├── middleware.ts                # Root Next.js Middleware (Role & Auth Routing Guard)
└── .env.local
*
# Creating of DB is on Supabase via sonof account


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
