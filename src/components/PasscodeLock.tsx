import React, { useState, useEffect, useRef } from "react";
import { Lock, Unlock, ShieldAlert, ShieldCheck, Eye, EyeOff, Delete, RotateCcw, Sparkles, KeyRound } from "lucide-react";

interface PasscodeLockProps {
  onUnlock: () => void;
  logoUrl?: string;
}

const CORRECT_PIN = "736387";
const PIN_LENGTH = 6;

export default function PasscodeLock({ onUnlock, logoUrl }: PasscodeLockProps) {
  const [pin, setPin] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showDigits, setShowDigits] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input on mount & on click anywhere on card
  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  const handleDigitPress = (digit: string) => {
    if (isSuccess) return;
    if (pin.length < PIN_LENGTH) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg("");
      if (nextPin.length === PIN_LENGTH) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (isSuccess) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg("");
  };

  const handleClear = () => {
    if (isSuccess) return;
    setPin("");
    setErrorMsg("");
  };

  const verifyPin = (candidatePin: string) => {
    if (candidatePin === CORRECT_PIN) {
      setIsSuccess(true);
      setErrorMsg("");
      try {
        if (rememberMe) {
          localStorage.setItem("site_access_unlocked", "true");
        } else {
          sessionStorage.setItem("site_access_unlocked", "true");
        }
      } catch (e) {
        console.error("Storage error:", e);
      }
      setTimeout(() => {
        onUnlock();
      }, 700);
    } else {
      setIsShaking(true);
      setErrorMsg("رمز الأمان غير صحيح! يرجى التأكد وإعادة المحاولة.");
      setTimeout(() => {
        setIsShaking(false);
        setPin("");
      }, 600);
    }
  };

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess) return;
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClear();
      } else if (e.key === "Enter" && pin.length === PIN_LENGTH) {
        e.preventDefault();
        verifyPin(pin);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, isSuccess, rememberMe]);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    const cleanNumbers = pasted.replace(/\D/g, "").slice(0, PIN_LENGTH);
    if (cleanNumbers.length > 0) {
      setPin(cleanNumbers);
      if (cleanNumbers.length === PIN_LENGTH) {
        verifyPin(cleanNumbers);
      }
    }
  };

  return (
    <div
      id="passcode-lock-screen"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#070A13] text-white p-4 overflow-y-auto selection:bg-cyan-500 selection:text-black"
      onClick={() => hiddenInputRef.current?.focus()}
    >
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0088FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00E676]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[#FF3366]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden real input for mobile keyboard and paste support */}
      <input
        ref={hiddenInputRef}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={PIN_LENGTH}
        value={pin}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH);
          setPin(val);
          if (val.length === PIN_LENGTH) {
            verifyPin(val);
          }
        }}
        onPaste={handlePaste}
        className="opacity-0 absolute -z-10 w-0 h-0"
        aria-label="أدخل رمز المرور"
        autoFocus
      />

      <div
        className={`relative w-full max-w-md bg-[#0D1322]/90 backdrop-blur-xl border ${
          isSuccess
            ? "border-emerald-500/80 shadow-2xl shadow-emerald-500/20"
            : errorMsg
            ? "border-rose-500/80 shadow-2xl shadow-rose-500/20"
            : "border-white/10 shadow-2xl shadow-black/60"
        } rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
          isShaking ? "animate-bounce" : ""
        }`}
        dir="rtl"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            {logoUrl ? (
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[#090D1A] border border-cyan-500/40 p-1 shadow-lg shadow-cyan-500/20 overflow-hidden">
                <img
                  src={logoUrl}
                  alt="Vector OTC"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#0088FF] via-[#00E676] to-[#FF3366] rounded-2xl blur opacity-30" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
            )}

            {/* Lock Status Pill Icon */}
            <div
              className={`absolute -bottom-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#0D1322] shadow-md ${
                isSuccess
                  ? "bg-emerald-500 text-white"
                  : errorMsg
                  ? "bg-rose-500 text-white"
                  : "bg-[#0088FF] text-white"
              }`}
            >
              {isSuccess ? (
                <Unlock className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>تصفح محمي برمز مرور</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            منصة <span className="text-cyan-400 font-semibold">Vector_OTC Options</span> مقفلة. يرجى إدخال رمز الأمان المكون من 6 أرقام لفتح الموقع.
          </p>
        </div>

        {/* PIN Indicators Display */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              رمز الأمان (6 أرقام)
            </span>
            <button
              type="button"
              onClick={() => setShowDigits(!showDigits)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title={showDigits ? "إخفاء الأرقام" : "إظهار الأرقام"}
            >
              {showDigits ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showDigits ? "إخفاء" : "إظهار"}</span>
            </button>
          </div>

          {/* 6 PIN Slots */}
          <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
            {Array.from({ length: PIN_LENGTH }).map((_, index) => {
              const char = pin[index];
              const isFilled = char !== undefined;
              const isCurrent = pin.length === index;

              return (
                <div
                  key={index}
                  className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl border flex items-center justify-center font-mono text-xl sm:text-2xl font-bold transition-all duration-200 select-none ${
                    isSuccess
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/20"
                      : errorMsg
                      ? "border-rose-500 bg-rose-500/20 text-rose-300"
                      : isFilled
                      ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-300 shadow-sm shadow-cyan-500/10 scale-105"
                      : isCurrent
                      ? "border-cyan-500 bg-slate-900 text-white animate-pulse"
                      : "border-white/10 bg-slate-900/60 text-slate-500"
                  }`}
                >
                  {isFilled ? (
                    showDigits ? (
                      char
                    ) : (
                      <span className="w-3 h-3 rounded-full bg-cyan-300 inline-block" />
                    )
                  ) : (
                    <span className="text-slate-700 text-sm">_</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Status / Error Banner */}
          <div className="min-h-[28px] mt-3 flex items-center justify-center text-center">
            {isSuccess ? (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>تم التحقق بنجاح! جاري فتح الموقع...</span>
              </div>
            ) : errorMsg ? (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>يمكنك استخدام لوحة المفاتيح أو النقر على الأرقام أدناه</span>
              </div>
            )}
          </div>
        </div>

        {/* On-Screen Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-5" dir="ltr">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitPress(num)}
              disabled={isSuccess}
              className="h-12 sm:h-13 rounded-xl bg-white/5 hover:bg-white/10 active:bg-cyan-500/20 active:scale-95 border border-white/5 hover:border-white/20 text-lg sm:text-xl font-bold font-mono text-white transition-all duration-150 cursor-pointer flex items-center justify-center select-none disabled:opacity-50"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            disabled={isSuccess || pin.length === 0}
            className="h-12 sm:h-13 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/20 hover:border-rose-500/40 text-xs sm:text-sm font-bold text-rose-300 transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed select-none"
            title="مسح الكل"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مسح</span>
          </button>

          {/* 0 Button */}
          <button
            type="button"
            onClick={() => handleDigitPress("0")}
            disabled={isSuccess}
            className="h-12 sm:h-13 rounded-xl bg-white/5 hover:bg-white/10 active:bg-cyan-500/20 active:scale-95 border border-white/5 hover:border-white/20 text-lg sm:text-xl font-bold font-mono text-white transition-all duration-150 cursor-pointer flex items-center justify-center select-none disabled:opacity-50"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            onClick={handleBackspace}
            disabled={isSuccess || pin.length === 0}
            className="h-12 sm:h-13 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-150 cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed select-none"
            title="حذف رقم"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Remember device option & footer */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-300 transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span>تذكر فتح القفل على هذا الجهاز</span>
          </label>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ShieldCheck className="w-3 h-3" />
            <span>حماية نشطة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
