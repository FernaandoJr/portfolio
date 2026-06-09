import type { Metadata } from 'next';
import { Geist, JetBrains_Mono, Merriweather } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/header';
import { BGPattern } from '@/components/ui/bg-pattern';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-serif' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Fernando Jr — Portfolio',
  description: 'Portfolio de desenvolvimento web',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geist.variable} ${merriweather.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <BGPattern
              variant="grid"
              mask="fade-edges"
              fill="color-mix(in oklch, var(--border) 40%, transparent)"
              size={96}
              className="fixed"
            />
            <Header />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
