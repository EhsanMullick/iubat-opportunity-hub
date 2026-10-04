import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Eventora — IUBAT Opportunity Hub | Discover & Publish Events in Bangladesh',
  description:
    'Universal event discovery and opportunity platform for IUBAT students, clubs, communities, and companies across Dhaka and Bangladesh. Find hackathons, seminars, concerts, sports, career expos, and track your applications.',
  keywords: [
    'IUBAT',
    'Eventora',
    'Opportunity Hub',
    'Dhaka Events',
    'Bangladesh Hackathons',
    'Student Competitions',
    'University Events',
    'Seminars Dhaka',
  ],
  authors: [{ name: 'IUBAT Engineering & Student Welfare' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Eventora — IUBAT Opportunity Hub',
    description: 'Discover upcoming hackathons, tech summits, cultural programs, and student opportunities across Bangladesh.',
    url: 'http://localhost:3000',
    siteName: 'Eventora — IUBAT Opportunity Hub',
    locale: 'en_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Leaflet CSS stylesheet for OpenStreetMap integration */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col relative selection:bg-indigo-500 selection:text-white">
        {/* Ambient Frosted Glow Orbs */}
        <div className="glow-blob-1" aria-hidden="true" />
        <div className="glow-blob-2" aria-hidden="true" />
        <div className="glow-blob-3" aria-hidden="true" />

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
