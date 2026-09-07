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
  title: 'ACTIVOS & INVERSIONES DARIEN S.A.S. | Plataforma Inmobiliaria & Custodia SAE',
  description: 'Comercialización, arrendamiento, custodia SAE, administración y puesta en valor de fincas, terrenos, bodegas y activos en Urabá, Darién, Antioquia y Chocó.',
  keywords: ['Fincas en Urabá', 'Lotes en Darién', 'Bodegas en Apartadó', 'Custodia SAE', 'PropTech Colombia', 'Inversión Inmobiliaria Antioquia']
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
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
