import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getTranslation } from "@/lib/i18n";
import CookieBanner from "@/components/CookieBanner";
import { Toaster } from 'react-hot-toast';
import LiveNotifications from '@/components/LiveNotifications';

export const metadata: Metadata = {
  title: "Landskrona stad Bokningsportal",
  description: "Officiell bokningsportal för kulturförvaltningen.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'sv';
  const session = cookieStore.get('session')?.value;
  const t = getTranslation(lang);

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-beige text-slate-900 font-sans selection:bg-morkbla selection:text-white">
        
        {/* Centralized Global Header */}
        <SiteHeader lang={lang} tBack={t("nav.back" as any) as string} session={session} />
        
        <Toaster position="top-right" />
        <LiveNotifications session={session} lang={lang} />
        
        {/* Main Content Area */}
        <div className="flex-grow flex flex-col">
          {children}
        </div>

        {/* Centralized Global Footer */}
        <SiteFooter 
          tDesc={t("footer.desc" as any) as string} 
          tRights={t("footer.rights" as any) as string} 
          tAdmin={t("nav.admin" as any) as string} 
        />
        
        {/* GDPR Cookie Banner */}
        <CookieBanner lang={lang} />
      </body>
    </html>
  );
}
