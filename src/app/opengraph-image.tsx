import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'ACTIVOS & INVERSIONES DARIEN S.A.S.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#1E3A2F',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Acento dorado decorativo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '10px',
            backgroundColor: '#C6A15B',
          }}
        />

        {/* Encabezado / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              color: '#1E3A2F',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            D
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#F8F7F2', letterSpacing: '2px' }}>
              ACTIVOS & INVERSIONES
            </span>
            <span style={{ fontSize: '15px', color: '#8FAE9D', letterSpacing: '3px' }}>
              DARIEN S.A.S. • GESTIÓN PATRIMONIAL
            </span>
          </div>
        </div>

        {/* Título Central */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '950px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(198, 161, 91, 0.15)',
              border: '1px solid #C6A15B',
              color: '#C6A15B',
              fontSize: '18px',
              fontWeight: '600',
              width: 'fit-content',
            }}
          >
            Plataforma Inmobiliaria & Custodia SAE
          </div>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: '800',
              color: '#FFFFFF',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Activos con propósito. <br />
            Inversiones con territorio.
          </h1>
          <p style={{ fontSize: '24px', color: '#E5E1D8', margin: 0 }}>
            Fincas ganaderas, bodegas logísticas y predios estratégicos en Urabá y Darién.
          </p>
        </div>

        {/* Footer con micro-datos */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(229, 225, 216, 0.2)',
            paddingTop: '30px',
          }}
        >
          <span style={{ fontSize: '20px', color: '#8FAE9D', fontWeight: '500' }}>
            Urabá • Darién • Antioquia • Chocó
          </span>
          <span style={{ fontSize: '20px', color: '#F8F7F2', fontWeight: 'bold' }}>
            inmobliaria.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
