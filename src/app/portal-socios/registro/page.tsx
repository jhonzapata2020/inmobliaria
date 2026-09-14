'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Handshake, 
  Building,
  Users,
  MapPin
} from 'lucide-react';
import { registerPartnerAction } from '../../actions/partners';
import { UserType } from '../../../types/property';

const MUNICIPALITIES_LIST = [
  'Riohacha (La Guajira)',
  'Dibulla (La Guajira)',
  'Maicao (La Guajira)',
  'San Juan del Cesar (La Guajira)',
  'Uribia (La Guajira)',
  'Manaure (La Guajira)',
  'Fonseca (La Guajira)',
  'Barrancas (La Guajira)',
  'Albania (La Guajira)',
  'Hatonuevo (La Guajira)',
  'Villanueva (La Guajira)',
  'El Molino (La Guajira)',
  'Distracción (La Guajira)',
  'La Jagua del Pilar (La Guajira)',
  'Urumita (La Guajira)',
  'Turbo',
  'Necoclí',
  'Apartadó',
  'Carepa',
  'Chigorodó',
  'Arboletes',
  'San Pedro de Urabá',
  'San Juan de Urabá',
  'Mutatá',
  'Los Córdobas',
  'Montería',
  'Tierralta',
  'Acandí',
  'Unguía',
  'Otro Municipio'
];

function PartnerRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as UserType) || 'broker';

  const [userType, setUserType] = useState<UserType>(
    initialType === 'owner' ? 'owner' : 'broker'
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [municipalityBase, setMunicipalityBase] = useState('Turbo');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('El teléfono móvil / WhatsApp es obligatorio para la verificación comercial.');
      setLoading(false);
      return;
    }

    try {
      const res = await registerPartnerAction({
        email,
        password,
        fullName,
        userType,
        phone,
        companyName,
        municipalityBase,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Ocurrió un error al registrar la cuenta.');
        setLoading(false);
        return;
      }

      router.push('/socios/dashboard');
      router.refresh();
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setErrorMsg('Error inesperado de registro. Inténtalo nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-center items-center p-4 font-sans text-[#1C1917]">
      <div className="w-full max-w-lg bg-white border border-[#E5E1D8] rounded-3xl shadow-xl p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#1E3A2F] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <UserCheck className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1C1917]">
              REGISTRO DE SOCIO O ALIANZA
            </h1>
            <p className="text-xs font-mono text-[#1E3A2F] font-bold uppercase tracking-wider mt-0.5">
              Red Comercial Urabá & Córdobas — Darién S.A.S.
            </p>
          </div>
        </div>

        {/* User Type Selector */}
        <div className="space-y-1.5">
          <label className="block text-stone-600 font-mono font-bold text-[11px] uppercase">
            Rol / Perfil Comercial *
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F8F7F4] border border-[#E5E1D8] rounded-2xl">
            <button
              type="button"
              onClick={() => setUserType('owner')}
              className={`py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 ${
                userType === 'owner'
                  ? 'bg-[#1E3A2F] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#1C1917]'
              }`}
            >
              <Building className="w-4 h-4 text-emerald-300" />
              <span className="text-center leading-tight">Propietario Titular</span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('broker')}
              className={`py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 ${
                userType === 'broker'
                  ? 'bg-[#1E3A2F] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#1C1917]'
              }`}
            >
              <Handshake className="w-4 h-4 text-emerald-300" />
              <span className="text-center leading-tight">Corredor Independiente</span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('broker_group')}
              className={`py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 ${
                userType === 'broker_group'
                  ? 'bg-[#1E3A2F] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#1C1917]'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-300" />
              <span className="text-center leading-tight">Grupo de Corretaje Zonal</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-600 font-mono font-bold mb-1 uppercase">
              Nombre y Apellidos *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Carlos Mario Restrepo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#1C1917] font-medium focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 font-mono font-bold mb-1 uppercase">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                placeholder="socio@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#1C1917] font-medium focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F]"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-mono font-bold mb-1 uppercase">
                Teléfono / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="+57 300 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#1C1917] font-medium focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 font-mono font-bold mb-1 uppercase">
                Municipio Base *
              </label>
              <select
                value={municipalityBase}
                onChange={(e) => setMunicipalityBase(e.target.value)}
                className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#1C1917] font-medium focus:outline-none focus:border-[#1E3A2F]"
              >
                {MUNICIPALITIES_LIST.map((muni) => (
                  <option key={muni} value={muni}>
                    {muni}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-600 font-mono font-bold mb-1 uppercase">
                Empresa / Grupo (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Inmobiliaria Urabá / Red Zonal"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#1C1917] font-medium focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 font-mono font-bold mb-1 uppercase">
              Contraseña de Acceso *
            </label>
            <input
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F8F7F4] border border-[#E5E1D8] rounded-xl px-3.5 py-3 text-[#1C1917] font-mono font-medium focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F]"
            />
          </div>

          {/* Business guarantee notice */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 font-mono uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Garantía Comercial Darién S.A.S.</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-tight">
              Tus radicación de predios está respaldada bajo acuerdos contractuales claros y esquemas flexibles de comisión protegida.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#1E3A2F] hover:bg-[#152921] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Registrando socio y creando cuenta...</span>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Completar Registro e Ingresar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login CTA */}
        <div className="pt-3 border-t border-[#E5E1D8] text-center">
          <p className="text-xs text-stone-600">
            ¿Ya estás registrado?{' '}
            <Link
              href="/portal-socios/login"
              className="font-bold text-[#1E3A2F] hover:underline"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function PartnerRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center text-xs font-mono text-[#1E3A2F]">
          Cargando formulario de registro...
        </div>
      }
    >
      <PartnerRegisterForm />
    </Suspense>
  );
}
