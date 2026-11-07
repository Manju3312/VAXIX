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
  title: "IMMUNIX | The Autonomous Software Immune Network",
  description:
    "Sovereign-grade resilience for the global API economy. Immunix intercepts upstream schema drift and breaking contract mutations in 0.4ms wire-time, repairing codebases deterministically with zero downtime.",
  keywords: [
    "API Resilience",
    "Autonomous Immune System",
    "Zero Downtime",
    "eBPF Proxy",
    "AST Codemod",
    "Model Context Protocol",
    "Enterprise Software",
  ],
  authors: [{ name: "IMMUNIX Sovereign Defense Labs" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "IMMUNIX | The Autonomous Software Immune Network",
    description:
      "World's first autonomous immune system for cloud software. 0.4ms in-flight wire inception, automated AST repair, global herd immunity.",
    url: "https://immunix.network",
    siteName: "IMMUNIX Network",
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
