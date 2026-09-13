'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, Lock, ShieldCheck, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Credenciales inválidas. Por favor verifica tus datos.');
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(redirectedFrom);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg('Error inesperado de autenticación. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-center items-center p-4 font-sans text-[#1C1917]">
      
      {/* Container */}
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-3xl shadow-xl p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#1E3A2F] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1C1917]">
              ACTIVOS & INVERSIONES DARIEN S.A.S.
            </h1>
            <p className="text-xs font-mono text-[#1E3A2F] font-bold uppercase tracking-wider mt-1">
              Acceso Seguro — Panel Administrativo
            </p>
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
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-600 font-mono font-bold mb-1.5 uppercase">
              Correo Institucional
            </label>
            <input
              type="email"
              required
              placeholder="admin@activosdarien.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F8F7F4] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-[#1C1917] font-medium focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F]"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-mono font-bold mb-1.5 uppercase">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F8F7F4] border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-[#1C1917] font-mono font-medium focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#1E3A2F] hover:bg-[#152921] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Ingresar al Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#E5E7EB] text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#1E3A2F] font-mono font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#1E3A2F]" />
            <span>Conexión Cifrada SSL — Supabase PostgreSQL</span>
          </div>
          <p className="text-[10px] text-stone-400 font-mono">
            Plataforma Corporativa © {new Date().getFullYear()} Activos & Inversiones Darién S.A.S.
          </p>
        </div>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center text-xs font-mono text-[#1E3A2F]">
        Cargando autenticación...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
