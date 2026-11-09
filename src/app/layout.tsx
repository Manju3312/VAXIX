import type { Metadata } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VAXIX | The Autonomous Software Immune Network",
  description:
    "Autonomous immune system for third-party API integrations. Vaxix detects upstream SaaS schema drift, contains damage early, and automatically generates verified AST pull requests with mandatory human review.",
  keywords: [
    "API Resilience",
    "Autonomous Immune System",
    "Schema Drift Detection",
    "AST Codemod",
    "Human in the Loop PR",
    "Enterprise Software",
  ],
  authors: [{ name: "VAXIX Sovereign Defense Labs" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "VAXIX | The Autonomous Software Immune Network",
    description:
      "Your integrations, immune to vendor surprises. Detects upstream SaaS drift early, contains damage, and generates tested pull requests for humans to approve.",
    url: "https://vaxix.network",
    siteName: "VAXIX Network",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <head>
        {/* Suppress third-party password manager & autofill extension noise (e.g. fdprocessedid) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var origError = console.error;
                console.error = function() {
                  for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] === 'string' && arguments[i].indexOf('fdprocessedid') !== -1) {
                      return;
                    }
                  }
                  return origError.apply(console, arguments);
                };
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-[#0B0B0C] antialiased selection:bg-[#D4AF37] selection:text-[#0B0B0C]">
        {children}
      </body>
    </html>
  );
}
