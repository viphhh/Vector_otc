import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, UserPlus, Clock, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import vectorLogo from '../assets/images/vector_otc_logo_1789462402811.jpg';

export default function AuthScreen() {
  const { user, profile, signIn, registerProfile, logOut, isSigningIn, authError, clearAuthError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: ''
  });

  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleOpenInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-theme-deep text-white flex items-center justify-center p-4 selection:bg-cyan-500/30" dir="rtl">
        <div className="w-full max-w-md bg-theme-deep border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-theme-card border border-cyan-500/40 p-1 mb-6 shadow-lg shadow-cyan-500/10">
            <img src={vectorLogo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-2xl font-bold mb-2">تسجيل الدخول إلى المنصة</h1>
          <p className="text-slate-400 text-sm mb-6">قم بتسجيل الدخول بحساب Google لمتابعة الوصول إلى أدوات التحليل الفني.</p>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-right flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-1">تنبيه في تسجيل الدخول:</p>
                <p>{authError}</p>
                {isInsideIframe && (
                  <button
                    onClick={handleOpenInNewTab}
                    className="mt-2 text-cyan-400 hover:text-cyan-300 underline font-medium flex items-center gap-1"
                  >
                    <span>فتح المنصة في علامة تبويب جديدة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            onClick={signIn}
            disabled={isSigningIn}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 disabled:bg-slate-300 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-cyan-600" />
                <span className="text-slate-700 text-sm">جاري فتح نافذة المصادقة...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>المتابعة باستخدام Google</span>
              </>
            )}
          </button>

          {isInsideIframe && (
            <div className="mt-6 pt-5 border-t border-white/10">
              <button
                onClick={handleOpenInNewTab}
                className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-white/5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>فتح في علامة تبويب مستقلة (لتسهيل تسجيل الدخول)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-theme-deep text-white flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30" dir="rtl">
        <div className="w-full max-w-md bg-theme-deep border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
              <UserPlus className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">إكمال التسجيل</h1>
              <p className="text-xs text-slate-400">يرجى إدخال بياناتك لإرسال طلب الانضمام للمراجعة</p>
            </div>
          </div>

          {registerError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{registerError}</span>
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setRegisterError(null);
              setIsRegistering(true);
              try {
                await registerProfile({
                  name: formData.name.trim(),
                  email: user.email || '',
                  phone: formData.phone.trim(),
                  country: formData.country.trim(),
                });
              } catch (err: any) {
                setRegisterError('تعذر إرسال الطلب: ' + (err?.message || 'يرجى المحاولة مرة أخرى'));
              } finally {
                setIsRegistering(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs text-slate-400 mb-1">الاسم الكامل</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-theme-card border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                placeholder="أحمد محمد"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">البريد الإلكتروني</label>
              <input
                disabled
                type="email"
                value={user.email || ''}
                className="w-full bg-slate-900/50 text-slate-400 border border-white/5 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">رقم الجوال</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-theme-card border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                placeholder="+966 5X XXX XXXX"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">الدولة</label>
              <input
                required
                type="text"
                value={formData.country}
                onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                className="w-full bg-theme-card border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                placeholder="السعودية، مصر، الإمارات..."
              />
            </div>

            <button
              disabled={isRegistering}
              type="submit"
              className="w-full mt-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري إرسال الطلب...</span>
                </>
              ) : (
                'إرسال طلب الانضمام'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={logOut}
              className="text-xs text-slate-500 hover:text-white transition-colors underline"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (profile.status === 'pending') {
    return (
      <div className="min-h-screen bg-theme-deep text-white flex flex-col items-center justify-center p-4 text-center" dir="rtl">
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-amber-400 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold mb-2">طلبك قيد المراجعة</h1>
        <p className="text-slate-400 max-w-md mb-6 leading-relaxed text-sm">
          أهلاً <span className="text-white font-semibold">{profile.name}</span>، لقد تم استلام بياناتك بنجاح. سيقوم المشرف بمراجعة طلبك وتفعيله في أقرب وقت.
        </p>

        <div className="bg-theme-deep border border-white/5 rounded-2xl p-4 w-full max-w-sm mb-6 text-right text-xs space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>البريد الإلكتروني:</span>
            <span className="text-slate-200 font-mono">{profile.email}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>رقم الجوال:</span>
            <span className="text-slate-200 font-mono">{profile.phone}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>الدولة:</span>
            <span className="text-slate-200">{profile.country}</span>
          </div>
          <div className="flex justify-between text-slate-400 pt-2 border-t border-white/5">
            <span>الحالة:</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              قيد الانتظار
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تحديث الحالة</span>
          </button>
          <button
            onClick={logOut}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium transition-colors text-slate-400 hover:text-white"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  if (profile.status === 'rejected') {
    return (
      <div className="min-h-screen bg-theme-deep text-white flex flex-col items-center justify-center p-4 text-center" dir="rtl">
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">عذراً، لم تتم الموافقة على الطلب</h1>
        <p className="text-slate-400 max-w-md mb-8 leading-relaxed text-sm">
          لم تتم الموافقة على انضمامك للمنصة في الوقت الحالي. يمكنك التواصل مع الدعم الفني للاستفسار.
        </p>
        <button
          onClick={logOut}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>
    );
  }

  return null;
}
