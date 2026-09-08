import type { Metadata } from 'next';
import './globals.css';
import { DossierProvider } from '../context/DossierContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { CompareProvider } from '../context/CompareContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { QuickQuoteDrawer } from '../components/dossier/QuickQuoteDrawer';
import { ExecutiveDossierModal } from '../components/dossier/ExecutiveDossierModal';
import { CompareModal } from '../components/compare/CompareModal';

export const metadata: Metadata = {
  metadataBase: new URL('https://inmobliaria.vercel.app'),
  title: 'ACTIVOS & INVERSIONES DARIEN | Inversión Territorial & Custodia SAE',
  description: 'Plataforma de gestión patrimonial, custodia de activos especiales SAE, fincas y oportunidades inmobiliarias en Urabá y Colombia.',
  keywords: ['Fincas en Urabá', 'Lotes en Darién', 'Bodegas en Apartadó', 'Custodia SAE', 'PropTech Colombia', 'Inversión Inmobiliaria Antioquia'],
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ACTIVOS & INVERSIONES DARIEN',
    description: 'Activos con propósito. Inversiones con territorio.',
    url: 'https://inmobliaria.vercel.app',
    siteName: 'Activos & Inversiones Darién S.A.S.',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACTIVOS & INVERSIONES DARIEN',
    description: 'Activos con propósito. Inversiones con territorio.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#F8F7F2] text-[#242321] min-h-screen flex flex-col font-sans selection:bg-[#1E3A2F] selection:text-white">
        <DossierProvider>
          <FavoritesProvider>
            <CompareProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              
              {/* Global Modals & Drawers */}
              <QuickQuoteDrawer />
              <ExecutiveDossierModal />
              <CompareModal />
            </CompareProvider>
          </FavoritesProvider>
        </DossierProvider>
      </body>
    </html>
  );
}
