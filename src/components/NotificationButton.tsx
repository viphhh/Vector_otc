import React, { useEffect, useState } from "react";
import { Bell, BellOff, BellRing, Check, ExternalLink, Sparkles } from "lucide-react";
import {
  getNotificationPermission,
  isNotificationSupported,
  NotificationStatus,
  requestNotificationPermission,
  sendTestNotification
} from "../utils/browserNotifications";

interface NotificationButtonProps {
  onNotifyStatusChange?: (status: NotificationStatus) => void;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ onNotifyStatusChange }) => {
  const [status, setStatus] = useState<NotificationStatus>("default");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    const current = getNotificationPermission();
    setStatus(current);
    onNotifyStatusChange?.(current);
  }, [onNotifyStatusChange]);

  const handleRequest = async () => {
    const res = await requestNotificationPermission();
    setStatus(res);
    onNotifyStatusChange?.(res);
    if (res === "granted") {
      setTestSent(true);
      await sendTestNotification();
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const handleTest = async () => {
    setTestSent(true);
    await sendTestNotification();
    setTimeout(() => setTestSent(false), 3000);
  };

  if (!isNotificationSupported()) {
    return null;
  }

  return (
    <>
      {status === "granted" ? (
        <button
          onClick={() => setIsOpenModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-sm font-bold transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
          title="إشعارات المتصفح Web Push مفعلة وتعمل حتى في الخلفية"
          id="btn-browser-notifications-active"
        >
          <div className="relative flex items-center justify-center">
            <BellRing className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <span className="hidden sm:inline">إشعارات المتصفح</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
            مفعّلة
          </span>
        </button>
      ) : status === "denied" ? (
        <button
          onClick={() => setIsOpenModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-sm font-bold transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
          title="تم حظر الإشعارات من إعدادات المتصفح - اضغط لمعرفة طريقة التفعيل"
          id="btn-browser-notifications-blocked"
        >
          <BellOff className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">إشعارات المتصفح</span>
          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">
            محظورة
          </span>
        </button>
      ) : (
        <button
          onClick={handleRequest}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/50 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-sm font-bold transition-all duration-300 cursor-pointer active:scale-95 shadow-md shadow-cyan-500/10 group animate-pulse hover:animate-none"
          title="تفعيل إشعارات المتصفح لاستلام تنبيهات الصفقات في الخلفية"
          id="btn-enable-browser-notifications"
        >
          <Bell className="w-3.5 h-3.5 text-cyan-300 group-hover:rotate-12 transition-transform" />
          <span>تفعيل الإشعارات 🔔</span>
        </button>
      )}

      {/* Settings & Info Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#0B101E] border border-slate-200 dark:border-white/10 p-6 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${status === "granted" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                  {status === "granted" ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    إشعارات المتصفح (Web Push)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    تنبيهات الصفقات اللحظية في الخلفية
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
              {status === "granted" ? (
                <>
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-400 text-xs sm:text-sm">
                        الإشعارات مفعّلة بنجاح!
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        ستتلقى تنبيهاً منبثقاً فور توليد أي إشارة تداول جديدة أو إشارة VIP حتى وإن كان المتصفح مصغراً أو كنت تعمل على تطبيق آخر.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      تجربة ظهور الإشعار في نظام التشغيل:
                    </span>
                    <button
                      onClick={handleTest}
                      disabled={testSent}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{testSent ? "تم الإرسال ✓" : "إرسال إشعار تجريبي"}</span>
                    </button>
                  </div>
                </>
              ) : status === "denied" ? (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <p className="font-bold text-rose-400 text-sm">
                    الإشعارات محظورة في إعدادات متصفحك!
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    لإعادة تفعيلها:
                    <br />
                    1. اضغط على أيقونة 🔒 (القفل أو إعدادات الموقع) بجانب عنوان الرابط في أعلى المتصفح.
                    <br />
                    2. ابحث عن <strong>الإشعارات (Notifications)</strong> وغيّرها إلى <strong>سماح (Allow)</strong>.
                    <br />
                    3. قم بتحديث الصفحة بعد السماح.
                  </p>
                </div>
              ) : null}

              <div className="rounded-xl p-3 bg-cyan-500/5 border border-cyan-500/15 text-xs text-cyan-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  ميزات نظام Web Push في Vector_OTC:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px] pr-1">
                  <li>تنبيه بالاتجاه (أعلى CALL / أدنى PUT) وسعر الدخول فورياً</li>
                  <li>اهتزاز للهواتف الذكية ونمط رنين متوافق مع نظام التشغيل</li>
                  <li>دعم كامل لصفقات الـ VIP بنسبة دقة 95%+</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
