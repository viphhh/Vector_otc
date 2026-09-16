import { useState, useMemo } from "react";
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Calculator,
  HelpCircle,
  X,
  Clock,
  Zap,
  Target,
  ChevronRight,
  ChevronLeft,
  Check,
  Award,
  Play
} from "lucide-react";

interface SignalsEducationAcademyProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLiveSignals?: () => void;
}

export function SignalsEducationAcademy({
  isOpen,
  onClose,
  onOpenLiveSignals
}: SignalsEducationAcademyProps) {
  const [activeTab, setActiveTab] = useState<"cards" | "confluence" | "simulator" | "money_plan" | "quiz">("cards");
  const [simScenario, setSimScenario] = useState<"call" | "put" | "fake">("call");

  // Money Management Calculator State
  const [accountBalance, setAccountBalance] = useState<number>(500);
  const [riskPercent, setRiskPercent] = useState<number>(2);

  // Quick Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  const calculatedTradeAmount = useMemo(() => {
    return Math.max(1, Math.round((accountBalance * (riskPercent / 100)) * 100) / 100);
  }, [accountBalance, riskPercent]);

  const recoveryAmount = useMemo(() => {
    // 1-step recovery: 2.2x to recover loss and earn profit on 90% payout
    return Math.round((calculatedTradeAmount * 2.2) * 100) / 100;
  }, [calculatedTradeAmount]);

  if (!isOpen) return null;

  const quizQuestions = [
    {
      id: 1,
      question: "ماذا تفعل إذا ظهرت إشارة بقوة 97% ولكن تبقى في عداد الثواني 10 ثوانٍ فقط وسعر السوق ابتعد كثيراً عن سعر الدخول؟",
      options: [
        "أدخل فوراً وبمبلغ مضاعف لتعويض التأخير",
        "أتجاهل الصفقة تماماً وأنتظر الإشارة التالية، لأن الدخول المتأخر يزيد المخاطرة",
        "أدخل في الاتجاه المعاكس للصفقة"
      ],
      correct: 1,
      explanation: "القاعدة الذهبية: لا تطارد السعر أبداً. الدخول يكون خلال أول 15-20 ثانية بالقرب من سعر الدخول الموصى به."
    },
    {
      id: 2,
      question: "في صفقة الشراء CALL، كيف يجب أن يكون ترتيب خطوط المتوسطات الأسية EMA Ribbon؟",
      options: [
        "EMA 8 (سماوي) في الأسفل، يليه EMA 21، ثم EMA 55 في الأعلى",
        "EMA 8 (سماوي) أعلى من EMA 21 (ذهبي)، وكلاهما أعلى من EMA 55 (بنفسجي)",
        "جميع الخطوط متداخلة ومتشابكة في خط مستقيم واحد"
      ],
      correct: 1,
      explanation: "الترتيب الصاعد الصحيح: خط الزخم السريع (8) في الأعلى، ثم المتوسط (21)، ثم العام (55) في الأسفل مع تباعد واضح."
    },
    {
      id: 3,
      question: "متى يعطي مؤشر الستوكاستيك (Stochastic 5,3,3) أفضل إشارة لدخول صفقة بيع PUT؟",
      options: [
        "عندما يكون أسفل مستوى 10",
        "عندما يرتد ويتقاطع هبوطاً من منطقة التشبع الشرائي (أعلى من مستوى 80)",
        "عندما يتحرك خط الستوكاستيك أفقياً في المنتصف عند 50"
      ],
      correct: 1,
      explanation: "التشبع الشرائي فوق 80 يوضح أن المشترين استنفدوا قواهم وبدأ البائعون في السيطرة، وتقاطع الخطوط هبوطاً يؤكد صفقة PUT."
    },
    {
      id: 4,
      question: "ما هي النسبة الموصى بها كحد أقصى للمخاطرة في كل صفقة للحفاظ على الحساب؟",
      options: [
        "من 1% إلى 3% فقط من إجمالي رصيد المحفظة",
        "من 20% إلى 50% لتحقيق ربح سريع",
        "كامل الرصيد (All-in) في إشارات VIP 95%+"
      ],
      correct: 0,
      explanation: "المتداول المحترف يحدد مخاطرته بين 1% إلى 3% فقط، حتى لو واجه سلسلة تقلبات غير متوقعة يظل حسابه آمناً تماماً."
    }
  ];

  const handleSelectQuizAnswer = (qIndex: number, optIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const score = Object.keys(quizAnswers).reduce((acc, qIdx) => {
    const q = quizQuestions[Number(qIdx)];
    return acc + (quizAnswers[Number(qIdx)] === q.correct ? 1 : 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 text-slate-100"
        id="academy-guide-container"
      >
        {/* Glow ambient gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-4 border-b border-purple-500/20 bg-[#120a26]/95 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-emerald-500 p-0.5 shadow-lg shadow-purple-500/25 flex-shrink-0">
              <div className="w-full h-full bg-[#0d071a] rounded-[14px] flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                  <span>أكاديمية قراءة الإشارات والتوافق الثلاثي</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                    EMA + STOCH + BB
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                دليلك التعليمي الشامل لفهم آلية صدور الإشارات، قراءة المؤشرات الفنية، وإدارة الصفقات باحترافية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onOpenLiveSignals && (
              <button
                onClick={() => {
                  onClose();
                  onOpenLiveSignals();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>تطبيق على الإشارات الحية</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="إغلاق"
              id="btn-close-academy-guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 pt-3 pb-2 border-b border-purple-500/20 bg-[#0f0921] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("cards")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "cards"
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. تشريح بطاقة الإشارة</span>
          </button>

          <button
            onClick={() => setActiveTab("confluence")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "confluence"
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>2. التوافق الثلاثي (EMA / STOCH / BB)</span>
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "simulator"
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3. المحاكي البصري الحي</span>
          </button>

          <button
            onClick={() => setActiveTab("money_plan")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "money_plan"
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>4. حاسبة وإدارة رأس المال</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "quiz"
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>5. اختبار الجاهزية</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm flex-1 custom-scrollbar">
          
          {/* TAB 1: HOW TO READ SIGNAL CARDS */}
          {activeTab === "cards" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-900/30 via-slate-900 to-fuchsia-950/30 border border-purple-500/30 rounded-2xl p-4 sm:p-5">
                <h3 className="font-extrabold text-white text-base sm:text-lg mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-fuchsia-400" />
                  <span>عناصر بطاقة الإشارة: كيف تفهم كل رقم وكل رمز؟</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  كل إشارة يصدرها نظام Vector OTC ليست مجرد اتجاه عشوائي، بل هي نتيجة معادلة رياضية فورية تجمع بين حركة السعر اللحظية والمؤشرات الفنية الثلاثة. إليك كيفية قراءتها في ثوانٍ معدودة:
                </p>
              </div>

              {/* Interactive Annotated Signal Card Mockup */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Visual Mockup Card (Left/Top) */}
                <div className="lg:col-span-6 bg-slate-950/80 border-2 border-emerald-500/50 rounded-2xl p-4 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                      <span className="font-bold text-white text-sm">EUR/USD OTC</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono">
                        M1 (دقيقة)
                      </span>
                    </div>
                    <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> VIP 98%
                    </span>
                  </div>

                  <div className="flex items-center justify-between my-3">
                    <div>
                      <span className="text-xs text-slate-400 block">نوع الصفقة المطلوب:</span>
                      <span className="inline-flex items-center gap-1.5 text-base font-black px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <TrendingUp className="w-4 h-4" /> CALL ▲ شراء (صعود)
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-xs text-slate-400 block">سعر الدخول الموصى به:</span>
                      <span className="font-mono font-black text-lg text-emerald-300">1.08450</span>
                    </div>
                  </div>

                  {/* Micro-Badges for Confluence */}
                  <div className="flex items-center gap-1.5 my-2.5 text-[10px] font-mono">
                    <span className="bg-sky-950/60 px-2 py-1 rounded text-sky-400 border border-sky-500/30">
                      ✓ EMA Ribbon (8&gt;21&gt;55)
                    </span>
                    <span className="bg-purple-950/60 px-2 py-1 rounded text-purple-300 border border-purple-500/30">
                      ✓ Stoch &lt; 20 (Bull Cross)
                    </span>
                    <span className="bg-amber-950/60 px-2 py-1 rounded text-amber-300 border border-amber-500/30">
                      ✓ Lower Band Bounce
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-[#120a26] p-2.5 rounded-xl text-center text-xs border border-white/5 my-2">
                    <div>
                      <span className="text-slate-400 text-[11px] block">دقة التوافق</span>
                      <span className="font-mono font-black text-emerald-400 text-base">98%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">الزمن المتبقي</span>
                      <span className="font-mono font-black text-amber-400 text-base animate-pulse">42 ث</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">منصة التنفيذ</span>
                      <span className="font-bold text-slate-200 text-xs">Pocket Option</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[70%]" />
                  </div>
                </div>

                {/* Explanation Details (Right) */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/10 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm mb-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
                      <span>نوع الصفقة (CALL صعود / PUT هبوط)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pr-7">
                      إذا كانت الإشارة <strong>CALL (خضراء)</strong> تضغط على الزر الأخضر (أعلى / Higher) في منصتك. إذا كانت <strong>PUT (حمراء)</strong> تضغط على الزر الأحمر (أدنى / Lower).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/10 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm mb-1">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">2</span>
                      <span>سعر الدخول والتوقيت اللحظي (Entry Price)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pr-7">
                      حاول دائماً الدخول في نفس سعر الإشارة المكتوب أو أفضل منه (مثلاً في CALL يفضّل سعر مساوٍ أو أقل قليلاً، وفي PUT يفضّل سعر مساوٍ أو أعلى).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/10 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center gap-2 text-fuchsia-400 font-bold text-xs sm:text-sm mb-1">
                      <span className="w-5 h-5 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-xs">3</span>
                      <span>نسبة التوافق وشارة VIP (Strength Confluence)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pr-7">
                      الإشارات التي تحمل نسبة <strong>95% فأعلى</strong> مع وسم <span className="text-amber-300">VIP</span> تعني أن المؤشرات الثلاثة (المتوسطات، الستوكاستيك، والبولنجر) متوافقة بنسبة 100%، وهي الأفضل والأقوى للبدء بها.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/10 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-xs sm:text-sm mb-1">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-xs">4</span>
                      <span>عداد الثواني المتبقية (Seconds Remaining)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pr-7">
                      ادخل الصفقة طالما العداد فوق <strong>25-30 ثانية</strong>. إذا بقي أقل من 15 ثانية، لا تدخل، لأن الشمعة قد تكون تحركت بالفعل وحان وقت الاستعداد للإشارة القادمة.
                    </p>
                  </div>
                </div>

              </div>

              {/* Steps To Enter Trade Fast */}
              <div className="bg-[#150d2e] border border-purple-500/30 rounded-2xl p-4 sm:p-5">
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>خطوات التنفيذ الثلاثية على منصة التداول (Pocket Option / Quotex / OlympTrade):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <span className="text-emerald-400 font-mono font-bold block mb-1">الخطوة الأولى 01</span>
                    <p className="text-slate-300">افتح الزوج المعروض بالإشارة (مثلاً EUR/USD OTC) وتأكد من ضبط وقت الشمعة وصفقة الخيارات على <strong>1 دقيقة (M1)</strong>.</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <span className="text-amber-400 font-mono font-bold block mb-1">الخطوة الثانية 02</span>
                    <p className="text-slate-300">حدد مبلغ الصفقة وفق إدارة رأس المال (1% إلى 3% كحد أقصى من رصيدك).</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <span className="text-fuchsia-400 font-mono font-bold block mb-1">الخطوة الثالثة 03</span>
                    <p className="text-slate-300">اضغط على زر (أعلى CALL) أو (أدنى PUT) فور صدور الإشارة دون تردد، ثم انتظر انتهاء الدقيقة.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRIPLE CONFLUENCE (EMA, STOCHASTIC, BOLLINGER) */}
          {activeTab === "confluence" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base mb-1">
                  <Activity className="w-5 h-5" />
                  <span>ما هو التوافق الثلاثي (Triple Confluence) ولماذا هو سر النجاح؟</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  معظم المتداولين يخسرون لأنهم يعتمدون على مؤشر واحد فقط (مثل التقاطع أو التشبع بمفرده). خوارزمية التوافق الأوروبي تدمج <strong>ثلاث طبقات فنية متكاملة</strong> في آن واحد: الاتجاه (EMA)، العزم والتشبع (Stochastic)، وحدود التقلب السعري (Bollinger Bands).
                </p>
              </div>

              {/* Indicator 1: EMA Ribbon */}
              <div className="bg-slate-950/70 border border-sky-500/30 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 border-b border-sky-500/20 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 font-mono font-black text-sm">
                      EMA
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm sm:text-base">
                        المؤشر الأول: شريط المتوسطات الأسية الأوروبي (EMA 8 / 21 / 55)
                      </h4>
                      <p className="text-[11px] text-slate-400">تحديد الاتجاه المؤسسي الصاعد أو الهابط وفلترة الضوضاء</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    فلتر الاتجاه العام
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#0b1424] p-3 rounded-xl border border-sky-500/20">
                    <strong className="text-sky-300 block mb-1 font-mono">1. EMA 8 (الخط السماوي)</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      يمثل الزخم السريع اللحظي. حركة الشموع فوقه تدل على قوة اندفاع صاعدة قوية، وأسفله تدل على سيطرة بياعة.
                    </p>
                  </div>
                  <div className="bg-[#1c180b] p-3 rounded-xl border border-amber-500/20">
                    <strong className="text-amber-300 block mb-1 font-mono">2. EMA 21 (الخط الذهبي)</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      خط الاتجاه المتوسط والديناميكي للدعم والمقاومة. ارتداد السعر منه يعطي فرص دخول مثالية مع الاتجاه (Pullback).
                    </p>
                  </div>
                  <div className="bg-[#1a0f2b] p-3 rounded-xl border border-purple-500/20">
                    <strong className="text-purple-300 block mb-1 font-mono">3. EMA 55 (الخط البنفسجي)</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      صمام الأمان والتريند الرئيسي. لا ندخل صفقات شراء إذا كان السعر أسفله، ولا صفقات بيع إذا كان السعر أعلاه.
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-xs text-sky-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>
                    <strong>قاعدة التوافق:</strong> يجب أن تكون الخطوط الثلاثة مرتبة ومتباعدة مثل المروحة المفتوحة، وتجنب التداول تماماً إذا كانت الخطوط متشابكة (سوق عرضي غير واضح).
                  </span>
                </div>
              </div>

              {/* Indicator 2: Stochastic Oscillator */}
              <div className="bg-slate-950/70 border border-purple-500/30 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 border-b border-purple-500/20 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 font-mono font-black text-sm">
                      STOCH
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm sm:text-base">
                        المؤشر الثاني: مذبذب ستوكاستيك فائق السرعة (Stochastic 5, 3, 3)
                      </h4>
                      <p className="text-[11px] text-slate-400">توقيت إطلاق الصفقة عند انتهاء التصحيح وانطلاق الموجة الجديدة</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    توقيت الدخول بالثانية
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>إشارة الشراء CALL (التشبع البيعي &lt; 20):</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      عندما يهبط المؤشر تحت مستوى 20 ثم يتقاطع الخط السريع مع البطيء صعوداً، هذا يعني أن البائعين فقدوا قوتهم والمشترون يستعدون لرفع السعر فوراً.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                      <ArrowDownRight className="w-4 h-4" />
                      <span>إشارة البيع PUT (التشبع الشرائي &gt; 80):</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      عندما يصعد المؤشر فوق مستوى 80 ثم يتقاطع هبوطاً، هذا يعني أن السعر وصل لذروة الصعود وسينعكس هبوطاً بقوة.
                    </p>
                  </div>
                </div>
              </div>

              {/* Indicator 3: Bollinger Bands */}
              <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-black text-sm">
                      BB
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-sm sm:text-base">
                        المؤشر الثالث: قنوات بولينجر باند (Bollinger Bands 20, 2)
                      </h4>
                      <p className="text-[11px] text-slate-400">تحديد حدود السعر القصوى وانفجار السيولة</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    حدود التقلب والانفجار
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <strong className="text-amber-300 block mb-1">الحد السفلي (Lower Band):</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      يمثل منطقة دعم ديناميكي قوية جداً؛ ملامسة الشمعة له مع ذيل ارتدادي يؤكد انطلاق صفقة CALL صاعدة.
                    </p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <strong className="text-slate-200 block mb-1">خط المنتصف (Middle SMA 20):</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      هو العمود الفقري للقناة؛ اختراق الشمعة له بقوة يؤكد استمرار الزخم في اتجاه الاختراق.
                    </p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <strong className="text-rose-300 block mb-1">الحد العلوي (Upper Band):</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      يمثل أقصى امتداد سعري طبيعي؛ ملامسته تعني احتمالية ارتداد هابط وشيك يؤكد صفقة PUT.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISUAL SIMULATOR */}
          {activeTab === "simulator" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-purple-950/30 p-4 rounded-2xl border border-purple-500/30">
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>المحاكي البصري: شاهد كيف تتوافق المؤشرات في اللحظة الحاسمة</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    اختر السيناريو ولاحظ كيف تتطابق المؤشرات الثلاثة في صفقات النجاح وكيف تكشف الصفقات الفاشلة:
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <button
                    onClick={() => setSimScenario("call")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      simScenario === "call"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    نموذج الشراء CALL 🟢
                  </button>
                  <button
                    onClick={() => setSimScenario("put")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      simScenario === "put"
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    نموذج البيع PUT 🔴
                  </button>
                  <button
                    onClick={() => setSimScenario("fake")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      simScenario === "fake"
                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    فخ وتوافق ضعيف ⚠️
                  </button>
                </div>
              </div>

              {/* Scenario Display */}
              {simScenario === "call" && (
                <div className="bg-slate-950/80 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>سيناريو صفقة الشراء المثالية (CALL 98% Confluence)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      إشارة مؤكدة - ادخل صعود فوراً
                    </span>
                  </div>

                  {/* SVG Chart Diagram */}
                  <div className="w-full bg-[#080b14] border border-white/10 rounded-2xl p-4 overflow-hidden relative">
                    <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
                      <span className="font-mono text-emerald-400 font-bold">نمط الشموع: ابتلاع شرائي فوق خط بولينجر السفلي</span>
                      <span className="font-mono text-sky-300">EMA 8 &gt; EMA 21 &gt; EMA 55</span>
                    </div>

                    {/* Chart visualization */}
                    <svg viewBox="0 0 700 180" className="w-full h-44">
                      {/* Grid lines */}
                      <line x1="0" y1="40" x2="700" y2="40" stroke="#ffffff10" strokeDasharray="4" />
                      <line x1="0" y1="90" x2="700" y2="90" stroke="#ffffff15" strokeDasharray="4" />
                      <line x1="0" y1="140" x2="700" y2="140" stroke="#ffffff10" strokeDasharray="4" />

                      {/* Bollinger Upper Band */}
                      <path d="M 0 35 Q 200 45 400 30 T 700 25" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2" opacity="0.6" />
                      {/* Bollinger Middle Band */}
                      <path d="M 0 85 Q 200 95 400 85 T 700 80" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3" opacity="0.7" />
                      {/* Bollinger Lower Band */}
                      <path d="M 0 135 Q 200 145 400 140 T 700 130" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2" opacity="0.6" />

                      {/* EMA 8 (Cyan) */}
                      <path d="M 0 120 Q 200 110 380 135 T 500 80 T 700 45" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                      {/* EMA 21 (Gold) */}
                      <path d="M 0 125 Q 200 120 380 138 T 500 95 T 700 65" fill="none" stroke="#eab308" strokeWidth="2" />
                      {/* EMA 55 (Purple) */}
                      <path d="M 0 130 Q 200 130 380 140 T 500 115 T 700 90" fill="none" stroke="#a855f7" strokeWidth="1.5" />

                      {/* Candles */}
                      {/* Candle 1 (red) */}
                      <line x1="320" y1="110" x2="320" y2="145" stroke="#ef4444" strokeWidth="1.5" />
                      <rect x="314" y="118" width="12" height="22" fill="#ef4444" rx="1" />

                      {/* Candle 2 (Pin Bar / Bounce from Lower Band) */}
                      <line x1="360" y1="120" x2="360" y2="150" stroke="#10b981" strokeWidth="1.5" />
                      <rect x="354" y="125" width="12" height="15" fill="#10b981" rx="1" />

                      {/* Candle 3 (Strong Bullish Breakout Candle at trigger point) */}
                      <line x1="400" y1="75" x2="400" y2="140" stroke="#10b981" strokeWidth="2" />
                      <rect x="392" y="85" width="16" height="45" fill="#10b981" rx="2" stroke="#34d399" strokeWidth="1" />

                      {/* Signal Call Arrow Indicator */}
                      <circle cx="400" cy="155" r="14" fill="#10b981" opacity="0.9" />
                      <path d="M 395 160 L 400 150 L 405 160 Z" fill="#ffffff" />
                      <text x="420" y="159" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">نقطة انطلاق CALL ▲</text>

                      {/* Continuation Candles */}
                      <rect x="440" y="65" width="14" height="35" fill="#10b981" rx="1" />
                      <line x1="447" y1="55" x2="447" y2="110" stroke="#10b981" strokeWidth="1.5" />

                      <rect x="480" y="45" width="14" height="30" fill="#10b981" rx="1" />
                      <line x1="487" y1="38" x2="487" y2="85" stroke="#10b981" strokeWidth="1.5" />
                    </svg>

                    {/* Stochastic sub-chart visual */}
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-purple-400 font-mono font-bold">مؤشر الستوكاستيك (Stochastic 5,3,3):</span>
                      <span className="text-emerald-400 font-mono font-bold">تقاطع صاعد من مستوى 18 (تشبع بيعي Oversold) ✓</span>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>EMA:</strong> ترتيب صاعد متباعد 8 &gt; 21 &gt; 55</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>Stochastic:</strong> ارتداد صاعد قوي تحت مستوى 20</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>Bollinger:</strong> ارتداد صريح من الحد السفلي للقناة</span>
                    </div>
                  </div>
                </div>
              )}

              {simScenario === "put" && (
                <div className="bg-slate-950/80 border-2 border-rose-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-rose-400 font-extrabold text-base">
                      <CheckCircle2 className="w-5 h-5 text-rose-400" />
                      <span>سيناريو صفقة البيع المثالية (PUT 98% Confluence)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      إشارة مؤكدة - ادخل هبوط فوراً
                    </span>
                  </div>

                  {/* SVG Chart Diagram for Put */}
                  <div className="w-full bg-[#080b14] border border-white/10 rounded-2xl p-4 overflow-hidden relative">
                    <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
                      <span className="font-mono text-rose-400 font-bold">نمط الشموع: شمعة رفض (Pin Bar Rejection) عند الحد العلوي</span>
                      <span className="font-mono text-rose-300">EMA 8 &lt; EMA 21 &lt; EMA 55</span>
                    </div>

                    <svg viewBox="0 0 700 180" className="w-full h-44">
                      {/* Grid lines */}
                      <line x1="0" y1="40" x2="700" y2="40" stroke="#ffffff10" strokeDasharray="4" />
                      <line x1="0" y1="90" x2="700" y2="90" stroke="#ffffff15" strokeDasharray="4" />
                      <line x1="0" y1="140" x2="700" y2="140" stroke="#ffffff10" strokeDasharray="4" />

                      {/* Bollinger Upper Band */}
                      <path d="M 0 45 Q 200 35 400 30 T 700 55" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2" opacity="0.6" />
                      {/* Bollinger Middle Band */}
                      <path d="M 0 95 Q 200 90 400 95 T 700 110" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3" opacity="0.7" />
                      {/* Bollinger Lower Band */}
                      <path d="M 0 145 Q 200 150 400 155 T 700 165" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2" opacity="0.6" />

                      {/* EMA 8 (Cyan) */}
                      <path d="M 0 60 Q 200 70 380 45 T 500 110 T 700 145" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                      {/* EMA 21 (Gold) */}
                      <path d="M 0 55 Q 200 65 380 50 T 500 95 T 700 125" fill="none" stroke="#eab308" strokeWidth="2" />
                      {/* EMA 55 (Purple) */}
                      <path d="M 0 50 Q 200 60 380 55 T 500 80 T 700 105" fill="none" stroke="#a855f7" strokeWidth="1.5" />

                      {/* Pin Bar Candle with long upper wick */}
                      <line x1="370" y1="25" x2="370" y2="70" stroke="#ef4444" strokeWidth="2" />
                      <rect x="363" y="55" width="14" height="15" fill="#ef4444" rx="1" />

                      {/* Big Bearish Candle (Execution Trigger) */}
                      <line x1="410" y1="45" x2="410" y2="120" stroke="#ef4444" strokeWidth="2" />
                      <rect x="402" y="60" width="16" height="50" fill="#ef4444" rx="2" stroke="#f87171" strokeWidth="1" />

                      {/* Signal Put Arrow Indicator */}
                      <circle cx="410" cy="30" r="14" fill="#ef4444" opacity="0.9" />
                      <path d="M 405 25 L 410 35 L 415 25 Z" fill="#ffffff" />
                      <text x="430" y="34" fill="#ef4444" fontSize="11" fontWeight="bold" fontFamily="monospace">نقطة انطلاق PUT ▼</text>

                      {/* Follow-up red candles */}
                      <rect x="450" y="105" width="14" height="35" fill="#ef4444" rx="1" />
                      <line x1="457" y1="95" x2="457" y2="145" stroke="#ef4444" strokeWidth="1.5" />

                      <rect x="490" y="130" width="14" height="25" fill="#ef4444" rx="1" />
                      <line x1="497" y1="125" x2="497" y2="160" stroke="#ef4444" strokeWidth="1.5" />
                    </svg>

                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-purple-400 font-mono font-bold">مؤشر الستوكاستيك (Stochastic 5,3,3):</span>
                      <span className="text-rose-400 font-mono font-bold">تقاطع هابط حاد فوق مستوى 85 (تشبع شرائي Overbought) ✓</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span><strong>EMA:</strong> ترتيب هابط 8 &lt; 21 &lt; 55</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span><strong>Stochastic:</strong> كسر هابط من قمة 85+</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span><strong>Bollinger:</strong> رفض واضح عند السقف العلوي للقناة</span>
                    </div>
                  </div>
                </div>
              )}

              {simScenario === "fake" && (
                <div className="bg-slate-950/80 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-base">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <span>سيناريو الفخ السعري (سوق عرضي وتوافق متعارض ⚠️)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      قاعدة ذهبية: امتنع عن الدخول
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-slate-300 space-y-3">
                    <p className="leading-relaxed">
                      لماذا يخسر المبتدئون في السوق؟ لأنهم يرون مؤشراً واحداً يعطي شراء بينما المؤشر الآخر يعطي بيع! في نظام Vector OTC، إذا كانت قوة الإشارة أقل من <strong>85%</strong> أو ظهرت علامة تعارض، يمتنع النظام عن إعطاء إشارة VIP.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                      <div className="bg-black/40 p-3 rounded-xl border border-rose-500/30">
                        <span className="text-rose-400 font-bold block mb-1">❌ تشابك خطوط EMA</span>
                        <span className="text-slate-400 text-[11px]">الخطوط الثلاثة متداخلة أفقياً = سيولة ضعيفة وتذبذب عشوائي.</span>
                      </div>
                      <div className="bg-black/40 p-3 rounded-xl border border-rose-500/30">
                        <span className="text-rose-400 font-bold block mb-1">❌ ضيق قنوات Bollinger (Squeeze)</span>
                        <span className="text-slate-400 text-[11px]">انضغاط القنوات يعني انفجار قادم لا يُعرف اتجاهه بعد.</span>
                      </div>
                      <div className="bg-black/40 p-3 rounded-xl border border-rose-500/30">
                        <span className="text-rose-400 font-bold block mb-1">❌ الستوكاستيك في المنتصف (50)</span>
                        <span className="text-slate-400 text-[11px]">لا يوجد تشبع واضح، الدخول هنا كرمي العملة المعدنية.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MONEY MANAGEMENT & CALCULATOR */}
          {activeTab === "money_plan" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-purple-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5">
                <h3 className="font-extrabold text-white text-base sm:text-lg mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>إدارة رأس المال الصارمة: الدرع الحامي لكل متداول ناجح</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  حتى مع دقة إشارات تصل إلى 96%+، المتداول الذي لا يدير رأس ماله سيخسر محفظته في لحظة طمع واحدة. إليك الخطة الاحترافية المعتمدة لحسابات الخيارات الثنائية وأزواج OTC:
                </p>
              </div>

              {/* Interactive Calculator */}
              <div className="bg-slate-950/70 border border-purple-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-fuchsia-400 font-bold text-sm">
                  <Calculator className="w-4 h-4" />
                  <span>حاسبة حجم الصفقة والتعويض الآمن (1-Step Recovery):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-bold">
                      رصيد محفظتك الحالي ($):
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100000"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white font-mono font-bold text-sm focus:outline-none focus:border-fuchsia-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-bold">
                      نسبة المخاطرة لكل صفقة (الموصى بها: 1% إلى 3%):
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 5].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setRiskPercent(pct)}
                          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            riskPercent === pct
                              ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30"
                              : "bg-slate-900 text-slate-400 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-emerald-500/30 text-center">
                    <span className="text-xs text-slate-400 block mb-1">مبلغ الصفقة الأولى الأساسية</span>
                    <strong className="text-xl font-mono text-emerald-400 font-extrabold">
                      ${calculatedTradeAmount}
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      ({riskPercent}% من إجمالي المحفظة)
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-amber-500/30 text-center">
                    <span className="text-xs text-slate-400 block mb-1">خطوة التعويض الفردية (إن لزمت فقط)</span>
                    <strong className="text-xl font-mono text-amber-400 font-extrabold">
                      ${recoveryAmount}
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      (تعوض الصفقة الأولى + تحقق ربحاً)
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-rose-500/30 text-center">
                    <span className="text-xs text-slate-400 block mb-1">الحد اليومي لإيقاف التداول (Stop Loss)</span>
                    <strong className="text-xl font-mono text-rose-400 font-extrabold">
                      -${Math.round(accountBalance * 0.05)}
                    </strong>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      (توقف فوراً عند خسارة 5% في اليوم)
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Golden Commandments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>1. توقف عند تحقيق الهدف اليومي (+5% إلى +10%)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    إذا بدأت بـ 500$ وحققت ربح 30$-50$ في اليوم، أغلق المنصة فوراً واستمتع بيومك. الاستمرار في السوق لساعات طويلة يوقعك في فخ الإفراط في التداول (Overtrading).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>2. خطوة تعويض واحدة فقط (ممنوع المضاعفة العشوائية)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    المضاعفة المتكررة (مارتينجال 3 و 4 خطوات) هي أسرع طريقة لتصفير الحسابات. إذا خسرت الصفقة الأولى والتعويضية، تقبل الخسارة بهدوء وانتظر جلسة تداول أخرى.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Clock className="w-4 h-4" />
                    <span>3. تجنب التداول وقت صدور الأخبار العنيفة</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    أخبار الفائدة، التضخم الأمريكي، وبيانات الوظائف غير الزراعية تسبب شموعاً ذيلية متقلبة جداً على أزواج العملات. أوقف التداول قبل الخبر بـ 15 دقيقة وبعده بـ 15 دقيقة.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <Zap className="w-4 h-4" />
                    <span>4. التركيز على أزواج الـ OTC بنسبة عائد 92%+</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    أزواج OTC في Pocket Option تعطي عوائد تصل إلى 92%-94%. هذا يضمن لك أقصى ربحية ممكنة مع نسبة نجاح الإشارات العالية.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: QUICK READINESS QUIZ */}
          {activeTab === "quiz" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-900/30 via-slate-900 to-emerald-950/30 border border-purple-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base sm:text-lg mb-1 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>اختبار جاهزية المتداول السريع (4 أسئلة)</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    تأكد من استيعابك الكامل للقواعد الفنية قبل دخول أول صفقة حقيقية على المنصة:
                  </p>
                </div>

                {showQuizResults && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
                    النتيجة: {score} من {quizQuestions.length}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {quizQuestions.map((q, qIndex) => {
                  const selected = quizAnswers[qIndex];
                  const isAnswered = selected !== undefined;
                  const isCorrect = selected === q.correct;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        showQuizResults
                          ? isCorrect
                            ? "bg-emerald-950/30 border-emerald-500/50"
                            : "bg-rose-950/30 border-rose-500/50"
                          : "bg-slate-950/70 border-white/10"
                      }`}
                    >
                      <h4 className="font-bold text-white text-xs sm:text-sm mb-3 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <span>{q.question}</span>
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selected === optIndex;
                          let optionClasses = "border-white/10 bg-slate-900/60 text-slate-300 hover:bg-slate-800";

                          if (showQuizResults) {
                            if (optIndex === q.correct) {
                              optionClasses = "border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold";
                            } else if (isOptionSelected && !isCorrect) {
                              optionClasses = "border-rose-500 bg-rose-500/20 text-rose-300";
                            }
                          } else if (isOptionSelected) {
                            optionClasses = "border-fuchsia-500 bg-fuchsia-500/20 text-white font-bold";
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => !showQuizResults && handleSelectQuizAnswer(qIndex, optIndex)}
                              disabled={showQuizResults}
                              className={`w-full text-right p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-2 ${optionClasses}`}
                            >
                              <span>{opt}</span>
                              {showQuizResults && optIndex === q.correct && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              )}
                              {showQuizResults && isOptionSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {showQuizResults && (
                        <p className="mt-2.5 pt-2 border-t border-white/10 text-xs text-slate-400 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-fuchsia-400 flex-shrink-0" />
                          <span>{q.explanation}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit Action */}
              <div className="flex items-center justify-between pt-2">
                {!showQuizResults ? (
                  <button
                    onClick={() => setShowQuizResults(true)}
                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      Object.keys(quizAnswers).length >= quizQuestions.length
                        ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    عرض النتيجة وتأكيد الإجابات ({Object.keys(quizAnswers).length}/{quizQuestions.length})
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setShowQuizResults(false);
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    إعادة الاختبار
                  </button>
                )}

                {showQuizResults && score === quizQuestions.length && (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    تهانينا! أنت جاهز تماماً لبدء التداول باحترافية
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-purple-500/20 bg-[#0d071a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>نظام التوافق الثلاثي (EMA Ribbon + Stochastic + Bollinger Bands) يضمن نسبة نجاح 96%+</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all shadow-md shadow-fuchsia-600/30 cursor-pointer active:scale-95 w-full sm:w-auto text-center"
            >
              فهمت الدليل، البدء بالتداول الآن
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
