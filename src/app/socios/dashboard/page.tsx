'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  ShieldCheck, 
  Handshake, 
  Building,
  MapPin,
  Tag,
  Eye,
  RefreshCw
} from 'lucide-react';
import { getPartnerProfileAction, getPartnerPropertiesAction } from '../../actions/partners';
import { UserProfile, Property } from '../../../types/property';
import { createClient } from '../../../lib/supabase/client';
import { formatCurrency, formatArea } from '../../../lib/formatters';

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const profileRes = await getPartnerProfileAction();
      if (!profileRes.success || !profileRes.data) {
        router.push('/portal-socios/login?redirectedFrom=/socios/dashboard');
        return;
      }

      setProfile(profileRes.data);

      const propertiesRes = await getPartnerPropertiesAction();
      if (propertiesRes.success) {
        setProperties(propertiesRes.data);
      }
    } catch (err: unknown) {
      console.error('Error loading partner dashboard:', err);
      setErrorMsg('No se pudieron cargar tus datos de socio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/portal-socios');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center font-sans p-4">
        <div className="flex items-center gap-3 text-[#1E3A2F] font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Cargando tu Panel de Socio...</span>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalCaptaciones = properties.length;
  const pendingCount = properties.filter((p) => p.editorialStatus === 'review' || (p.editorialStatus as string) === 'pending_review').length;
  const publishedCount = properties.filter((p) => p.editorialStatus === 'published').length;
  const archivedCount = properties.filter((p) => p.editorialStatus === 'archived' || p.availability === 'Archivado').length;

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-[#1C1917]">
      
      {/* Partner Top Navigation Bar */}
      <header className="bg-[#1E3A2F] text-white border-b border-emerald-900/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-xs tracking-tight block">
                ACTIVOS & INVERSIONES DARIÉN S.A.S.
              </span>
              <span className="text-[10px] font-mono text-emerald-300 uppercase block">
                Panel de Socios & Corredores Aliados
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/socios/nuevo-activo"
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Captar Nuevo Activo</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Card */}
        {profile && (
          <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1E3A2F] text-white flex items-center justify-center shrink-0">
                {profile.userType === 'owner' ? (
                  <Building className="w-7 h-7 text-emerald-300" />
                ) : (
                  <Handshake className="w-7 h-7 text-emerald-300" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                    {profile.fullName || profile.email}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase ${
                    profile.userType === 'owner' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {profile.userType === 'owner' ? 'Propietario Directo' : 'Corredor Aliado (50/50)'}
                  </span>
                  {profile.isVerified ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verificado</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-100 text-stone-600 border border-stone-200">
                      En Verificación
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-600 font-mono space-x-3">
                  <span>{profile.email}</span>
                  {profile.phone && <span>• Tel: {profile.phone}</span>}
                  {profile.companyName && <span>• Empresa: {profile.companyName}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/socios/nuevo-activo"
                className="px-5 py-3 rounded-2xl bg-[#1E3A2F] hover:bg-[#152921] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <PlusCircle className="w-4.5 h-4.5 text-emerald-300" />
                <span>Registrar Captación</span>
              </Link>
            </div>
          </div>
        )}

        {/* Commercial Trust Banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-mono font-bold uppercase block">Acuerdo de Corretaje Compartido 50/50</span>
            <p className="text-emerald-800 leading-relaxed">
              Tus captaciones están protegidas bajo el acuerdo de corretaje compartido 50/50 de Activos & Inversiones Darién S.A.S. Los datos del titular original permanecen encriptados y solo son accesibles por el departamento administrativo para la moderación y firma contractual.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E1D8] rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-mono font-bold text-stone-500 uppercase block">Total Captaciones</span>
            <div className="text-2xl font-serif font-bold text-[#1C1917]">{totalCaptaciones}</div>
            <p className="text-[11px] text-stone-500 font-mono">Activos ingresados al portal</p>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm space-y-2 bg-amber-50/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-800 uppercase">En Moderación</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-amber-900">{pendingCount}</div>
            <p className="text-[11px] text-amber-700 font-mono">En proceso de revisión jurídica</p>
          </div>

          <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-2 bg-emerald-50/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase">Publicados</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-emerald-900">{publishedCount}</div>
            <p className="text-[11px] text-emerald-700 font-mono">Visibles en catálogo público</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-500 uppercase">Archivados</span>
              <AlertCircle className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl font-serif font-bold text-stone-700">{archivedCount}</div>
            <p className="text-[11px] text-stone-500 font-mono">Cerrados o no disponibles</p>
          </div>
        </div>

        {/* Captaciones List / Table */}
        <div className="bg-white border border-[#E5E1D8] rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5E1D8] flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                Mis Captaciones Inmobiliarias
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                Gestión de inmuebles registrados para moderación comercial
              </p>
            </div>

            <Link
              href="/socios/nuevo-activo"
              className="px-4 py-2 rounded-xl bg-[#1E3A2F] text-white text-xs font-bold hover:bg-[#152921] transition-all inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>Nuevo Activo</span>
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-stone-800 text-base">
                  Aún no has registrado captaciones
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Comienza ingresando fincas, terrenos o predios para iniciar el proceso de evaluación técnica y comisión compartida.
                </p>
              </div>
              <Link
                href="/socios/nuevo-activo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Registrar Mi Primera Captación</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F7F4] text-stone-600 font-mono uppercase font-bold text-[11px] border-b border-[#E5E1D8]">
                  <tr>
                    <th className="px-6 py-3.5">Código / Título</th>
                    <th className="px-6 py-3.5">Ubicación</th>
                    <th className="px-6 py-3.5">Tipo / Extensión</th>
                    <th className="px-6 py-3.5">Precio Sugerido</th>
                    <th className="px-6 py-3.5">Estado Moderación</th>
                    <th className="px-6 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D8] font-medium text-stone-800">
                  {properties.map((prop) => {
                    const isPublished = prop.editorialStatus === 'published';
                    const isPending = prop.editorialStatus === 'review' || (prop.editorialStatus as string) === 'pending_review';

                    return (
                      <tr key={prop.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 space-y-1">
                          <span className="font-mono text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            {prop.code}
                          </span>
                          <div className="font-bold text-stone-900 line-clamp-1">{prop.title}</div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-stone-700">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>{prop.municipality}, {prop.department}</span>
                          </div>
                          {prop.vereda && (
                            <span className="text-[11px] text-stone-500 block font-mono">Vd. {prop.vereda}</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div>{prop.assetType}</div>
                          <div className="text-[11px] text-stone-500 font-mono">
                            {formatArea(prop.landAreaHa, prop.landAreaM2)}
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono font-bold text-stone-900">
                          {formatCurrency(prop.salePriceCop)}
                        </td>

                        <td className="px-6 py-4">
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Publicado</span>
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>En Moderación</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-300">
                              <span>{prop.editorialStatus || 'En revisión'}</span>
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {isPublished && prop.slug ? (
                            <Link
                              href={`/propiedades/${prop.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-stone-600" />
                              <span>Ver Público</span>
                            </Link>
                          ) : (
                            <span className="text-[11px] font-mono text-stone-400">
                              En revisión
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}
