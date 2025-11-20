import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/toast-provider';
import { Toaster } from 'react-hot-toast';
import MainLayout from '@/components/layout/main-layout';
import ScrollProgress from '@/components/ui/scroll-progress';
import CustomCursor from '@/components/ui/custom-cursor';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <>
      {/* Interactions globales modernes */}
      <ScrollProgress />
      <CustomCursor />
      
      {/* Provider pour next-intl */}
      <NextIntlClientProvider locale={locale} messages={messages}>
        {/* Provider pour le thème */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Layout principal avec header et footer */}
          <MainLayout>
            {children}
          </MainLayout>
          
          {/* Toast notifications */}
          <ToastProvider />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#374151',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #f3f4f6',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                maxWidth: '500px'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff'
                },
                style: {
                  border: '2px solid #10b981'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff'
                },
                style: {
                  border: '2px solid #ef4444'
                }
              }
            }}
          />
        </ThemeProvider>
      </NextIntlClientProvider>
      
      {/* Scripts d'analytics (optionnel) */}
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}