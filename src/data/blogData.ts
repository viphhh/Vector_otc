import { Article, BlogCategory, BlogTag } from '../types';

export const INITIAL_BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "strategies",
    nameAr: "استراتيجيات التداول",
    nameEn: "Trading Strategies",
    icon: "Target",
    description: "أحدث استراتيجيات الخيارات الثنائية والسكالبنج عالي الدقة",
  },
  {
    id: "gold_oil",
    nameAr: "تداول الذهب والنفط",
    nameEn: "Gold & Oil Scalping",
    icon: "Coins",
    description: "تحليلات واقتناص فرص XAU/USD وخام برنت والنفط الأمريكي",
  },
  {
    id: "scalping",
    nameAr: "السكالبنج والتحليل الفني",
    nameEn: "Scalping & Technical Analysis",
    icon: "TrendingUp",
    description: "قراءة البرايس أكشن، النماذج الانعكاسية، والفريمات السريعة",
  },
  {
    id: "otc_secrets",
    nameAr: "أسرار أسواق OTC",
    nameEn: "OTC Market Secrets",
    icon: "Lock",
    description: "فهم خوارزميات التسعير غير الرسمية وصيد سيولة البروكر",
  },
  {
    id: "indicators",
    nameAr: "المؤشرات والتأكيد",
    nameEn: "Indicators & Confluence",
    icon: "Zap",
    description: "إعدادات Stochastic، Bollinger Bands، وEMA الأوروبية",
  },
  {
    id: "risk_management",
    nameAr: "إدارة المخاطر ورأس المال",
    nameEn: "Risk & Money Management",
    icon: "ShieldCheck",
    description: "حماية المحفظة والسيطرة على العواطف ونفسية المتداول المحترف",
  },
];

export const INITIAL_BLOG_TAGS: BlogTag[] = [
  { id: "gold", name: "الذهب_XAUUSD" },
  { id: "oil", name: "النفط_USOIL" },
  { id: "scalping5s", name: "سكالبنج_5ثواني" },
  { id: "european_strat", name: "الاستراتيجية_الأوروبية" },
  { id: "pocket_option", name: "PocketOption" },
  { id: "stochastic", name: "مؤشر_ستوكاستيك" },
  { id: "bollinger", name: "بولنجر_باندز" },
  { id: "price_action", name: "برايس_أكشن" },
  { id: "liquidity", name: "كشف_السيولة" },
  { id: "risk_mgmt", name: "إدارة_المخاطر" },
  { id: "otc_pairs", name: "أزواج_OTC" },
  { id: "trend_analysis", name: "تحليل_الاتجاه" },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "gold-oil-scalping-mastery",
    title: "دليل سكالبنج الذهب (XAU/USD) والنفط بأحدث التقنيات الأوروبية والسيولة الذكية",
    slug: "gold-oil-scalping-mastery",
    excerpt: "تعلم كيفية رصد كتل الأوامر واقتناص الارتدادات السريعة للذهب والنفط على فريمات الثواني والدقائق بدقة تفوق 90%.",
    content: `## مقدمة عن سكالبنج المعادن والطاقة

يعتبر الذهب (XAU/USD) والنفط الخام (USOil / Brent) من أكثر الأصول تذبذباً وجذباً لمتداولي السكالبنج السريع. في أسواق الـ OTC والخيارات الثنائية، تتبع حركة الذهب سلوكاً ميكانيكياً محدداً يعتمد على مناطق التجميع والتصريف واختبار السيولة السريعة.

---

### 1. ركائز الاستراتيجية الأوروبية على الذهب
تعتمد الاستراتيجية الأوروبية المدمجة في منصة **Vector_OTC** على ثلاثة محاور توافق أساسية:

1. **تقاطع المتوسطات السريعة (EMA Ribbon):**
   استخدام EMA 9 مع EMA 21 لرصد الانطلاقة الأولى للزخم دون تأخير زمني.
2. **فلتر التشبع الحرج (Stochastic Oscillator):**
   عندما يهبط المؤشر دون مستوى 20 مع تقاطع إيجابي، تكون نسبة نجاح صفقات الشراء (أعلى / CALL) أعلى من 92%.
3. **انفجار نطاق بولنجر (Bollinger Bands Squeeze):**
   انتظار تضيق خطوط البولنجر ثم الدخول فور ملامسة الحد السفلي بشمعة رفض واضحة (Rejection Wick).

---

### 2. توقيت الصفقات الأمثل للنفط والذهب
- **فريم 5 ثواني و 15 ثانية:** مناسب لاقتناص ذيول الشموع السريعة عند مستويات الدعم والمقاومة اللحظية.
- **فريم 1 دقيقة:** الفريم المثالي لتأكيد الاتجاه العام قبل فتح صفقات المضاعفة المحسوبة.

> 💡 **نصيحة ذهبية:** لا تدخل صفقة على الذهب إذا كان مؤشر ستوكاستيك محايداً بين 40 و 60، انتظر دائماً مناطق الذروة المتطرفة!`,
    category: "تداول الذهب والنفط",
    tags: ["الذهب_XAUUSD", "النفط_USOIL", "سكالبنج_5ثواني", "الاستراتيجية_الأوروبية"],
    coverImage: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=80",
    author: "كبير محللي Vector OTC",
    authorEmail: "viphhhxxx@gmail.com",
    readTime: 4,
    views: 1420,
    likes: 185,
    featured: true,
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "otc-algorithms-secrets",
    title: "أسرار خوارزميات الـ OTC في Pocket Option: كيف تتفوق على صانع السوق؟",
    slug: "otc-algorithms-secrets",
    excerpt: "كشف أسرار تسعير أزواج الـ OTC غير الرسمية أثناء عطلة نهاية الأسبوع وكيف تستغل تكرار النماذج الرياضية.",
    content: `## الحقيقة وراء أسواق الـ OTC (Over-The-Counter)

أسواق الـ OTC ليست أسواقاً مركزية، بل هي أسعار يتم توليدها بواسطة خوارزميات محاكاة تتبع سلوك الأسعار التاريخي مضافاً إليها تدفق أوامر المتداولين داخل منصة الوسيط مثل Pocket Option أو Deriv.

---

### كيف تستفيد خوارزمية Vector_OTC من ذلك؟
1. **اكتشاف النمط المتكرر (Pattern Repeatability):**
   تكرر خوارزميات الـ OTC دورات سعرية دقيقة كل بضع دقائق، مما يجعل نماذج القمم المزدوجة ومناطق العرض والطلب شديدة الفعالية.
2. **فخاخ السيولة (Liquidity Traps):**
   عندما يتجمع معظم المتداولين في اتجاه واحد، يتحرك السعر لاصطياد أوامر وقف الخسارة. خوارزميتنا ترصد هذا التباين وتنبهك للدخول في الاتجاه المعاكس.

---

### جدول مقارنة بين السوق الرسمي و OTC:
- **السوق الرسمي:** يتأثر بالأخبار المباشرة، السيولة البنكية، أوقات افتتاح البورصات.
- **سوق OTC:** يتأثر بنماذج رياضية، زخم داخلي، ويعمل 24/7 دون توقف حتى في العطلات الأسبوعية.`,
    category: "أسرار أسواق OTC",
    tags: ["أزواج_OTC", "PocketOption", "كشف_السيولة", "تحليل_الاتجاه"],
    coverImage: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80",
    author: "فريق هندسة الخوارزميات",
    authorEmail: "viphhhxxx@gmail.com",
    readTime: 5,
    views: 2150,
    likes: 312,
    featured: true,
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "stochastic-bollinger-confluence",
    title: "دمج مؤشر ستوكاستيك مع خطوط بولنجر: استراتيجية صفقات الـ 92%+ دقة",
    slug: "stochastic-bollinger-confluence",
    excerpt: "الشرح التفصيلي خطوة بخطوة لمعادلة التوافق الثلاثي المعتمدة في روبوت الإشارات التلقائي.",
    content: `## قوة التوافق (Confluence Trading)

لا يوجد مؤشر فني وحيد يستطيع التنبؤ بالسوق بمفرده. السر يكمن في "التوافق الفني" – أي عندما تعطي 3 مؤشرات مختلفة إشارة تأكيد متزامنة في نفس اللحظة.

---

### الإعدادات المثالية الموصى بها:
- **Bollinger Bands:** الفترة 20، الانحراف المعياري 2.0.
- **Stochastic Oscillator:** الإعدادات السريعة %K = 5, %D = 3, Slowing = 3.
- **EMA Ribbon:** المتوسط 9 و 21.

---

### شروط صفقة شراء مثالية (CALL / أعلى):
1. شمعة السعر تلامس أو تكسر خط بولنجر السفلي بذيل رفض صاعد.
2. خط %K في ستوكاستيك يتقاطع صعوداً فوق %D وهو في منطقة التشبع البيعي (أقل من 20).
3. ظهور إشارة البوت بقوة 92% فما فوق.
4. مدة الصفقة: شمعة واحدة إلى شمعتين فقط حسب الفريم المختار.`,
    category: "المؤشرات والتأكيد",
    tags: ["مؤشر_ستوكاستيك", "بولنجر_باندز", "الاستراتيجية_الأوروبية", "برايس_أكشن"],
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80",
    author: "أكاديمية السكالبنج",
    authorEmail: "viphhhxxx@gmail.com",
    readTime: 3,
    views: 1890,
    likes: 245,
    featured: false,
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "risk-management-binary-options",
    title: "القواعد الذهبية لإدارة رأس المال في صفقات الخيارات الثنائية والفريمات السريعة",
    slug: "risk-management-binary-options",
    excerpt: "الخسارة جزء من اللعبة، لكن إدارتها بذكاء هي الفارق الوحيد بين المتداول الهاوي والمحترف الذي يحقق أرباحاً مستدامة.",
    content: `## سيكولوجية المتداول المحترف

أكبر خطأ يقع فيه متداولو السكالبنج هو الانتقام من السوق (Revenge Trading) أو رفع قيمة الصفقة بشكل عشوائي بعد خسارة غير متوقعة.

---

### القواعد الأربع الصارمة:
1. **قاعدة الـ 2%:** لا تخاطر بأكثر من 1% إلى 2% من إجمالي رصيدك في الصفقة الواحدة مهما كانت ثقتك في الإشارة.
2. **حد الخسارة اليومي (Daily Stop Loss):** إذا خسرت 3 صفقات متتالية أو 5% من محفظتك، أوقف التداول فوراً وابتعد عن الشاشة.
3. **تجنب المضاعفات غير المحسوبة (Martingale):** استخدم نظام النسبة الثابتة أو المضاعفة لمرة واحدة فقط عند التوافق الفائق (VIP 95%+).
4. **سحب الأرباح الدوري:** اسحب جزءاً من أرباحك أسبوعياً لتشعر بنتيجة تعبك الذهني وتفصل أرباحك عن أموال التداول.`,
    category: "إدارة المخاطر ورأس المال",
    tags: ["إدارة_المخاطر", "سكالبنج_5ثواني", "PocketOption"],
    coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
    author: "مستشار إدارة المحافظ",
    authorEmail: "viphhhxxx@gmail.com",
    readTime: 4,
    views: 1620,
    likes: 198,
    featured: false,
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];
