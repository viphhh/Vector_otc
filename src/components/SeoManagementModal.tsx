import React, { useState, useEffect } from "react";
import { SiteSeo, CategorySeo, TagSeo } from "../types";
import { loadStoredSeo, saveStoredSeo, applySeoToDom, requestAiSeo, DEFAULT_SITE_SEO } from "../utils/seoHelper";
import { db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  Sparkles,
  Globe,
  Share2,
  Tag,
  Folder,
  Code,
  Check,
  RotateCcw,
  ExternalLink,
  Eye,
  Smartphone,
  Monitor,
  AlertCircle,
  X,
  Copy,
  Sliders,
  FileText
} from "lucide-react";

interface SeoManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: { id: string; nameAr: string; count?: number }[];
  tags?: { id: string; name: string }[];
}

export const SeoManagementModal: React.FC<SeoManagementModalProps> = ({
  isOpen,
  onClose,
  categories = [],
  tags = [],
}) => {
  const [activeTab, setActiveTab] = useState<"site" | "categories" | "tags" | "schema">("site");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [seo, setSeo] = useState<SiteSeo>(loadStoredSeo());
  const [keywordInput, setKeywordInput] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.nameAr || "استراتيجيات التداول");
  const [categorySeoMap, setCategorySeoMap] = useState<Record<string, CategorySeo>>({});
  const [selectedTag, setSelectedTag] = useState<string>(tags[0]?.name || "#سكالبنج");
  const [tagSeoMap, setTagSeoMap] = useState<Record<string, TagSeo>>({});

  useEffect(() => {
    if (isOpen) {
      setSeo(loadStoredSeo());
      setIsSaved(false);
      setAiMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Character count feedback
  const titleLength = seo.siteTitle.length;
  const descLength = seo.metaDescription.length;

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim().replace(",", "");
      if (val && !seo.keywords.includes(val)) {
        setSeo({ ...seo, keywords: [...seo.keywords, val] });
      }
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setSeo({
      ...seo,
      keywords: seo.keywords.filter((_, i) => i !== index),
    });
  };

  // AI Auto-Generate for Site
  const handleAiGenerateSiteSeo = async () => {
    try {
      setIsGeneratingAi(true);
      setAiMessage(null);
      const res = await requestAiSeo({ type: "site" });
      if (res.success) {
        const updated: SiteSeo = {
          siteTitle: res.siteTitle || seo.siteTitle,
          metaDescription: res.metaDescription || seo.metaDescription,
          keywords: res.keywords || seo.keywords,
          canonicalUrl: res.canonicalUrl || seo.canonicalUrl,
          ogImage: res.ogImage || seo.ogImage,
          ogSiteName: res.ogSiteName || seo.ogSiteName,
          twitterCard: res.twitterCard || seo.twitterCard,
          structuredDataType: res.structuredDataType || "WebApplication",
        };
        setSeo(updated);
        setAiMessage("✨ تم توليد هوية السيو الذكية تلقائياً بنجاح عبر Gemini AI!");
      }
    } catch (err: any) {
      setAiMessage("⚠️ تعذر الاتصال بالذكاء الاصطناعي، تم استخدام التنسيق القياسي.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // AI Generate for Category
  const handleAiGenerateCategorySeo = async (catName: string) => {
    try {
      setIsGeneratingAi(true);
      const res = await requestAiSeo({ type: "category", category: catName });
      if (res.success) {
        setCategorySeoMap((prev) => ({
          ...prev,
          [catName]: {
            id: catName,
            seoTitle: res.seoTitle,
            seoDescription: res.seoDescription,
            keywords: res.keywords || [],
          },
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // AI Generate for Tag
  const handleAiGenerateTagSeo = async (tagName: string) => {
    try {
      setIsGeneratingAi(true);
      const res = await requestAiSeo({ type: "tag", tagName: tagName });
      if (res.success) {
        setTagSeoMap((prev) => ({
          ...prev,
          [tagName]: {
            id: tagName,
            seoTitle: res.seoTitle,
            seoDescription: res.seoDescription,
            relatedTags: res.relatedTags || [],
          },
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save Settings
  const handleSaveSeo = async () => {
    saveStoredSeo(seo);
    applySeoToDom(seo);

    // Save to Firestore if available
    try {
      const seoRef = doc(db, "settings", "site_seo");
      await setDoc(seoRef, {
        siteTitle: seo.siteTitle,
        metaDescription: seo.metaDescription,
        keywords: seo.keywords,
        canonicalUrl: seo.canonicalUrl,
        ogImage: seo.ogImage,
        ogSiteName: seo.ogSiteName,
        twitterCard: seo.twitterCard,
        structuredDataType: seo.structuredDataType || "WebApplication",
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      // Non-blocking if offline or permission denied
      console.log("Firestore SEO sync notice:", e);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm("هل تريد استعادة إعدادات السيو الافتراضية لمنصة Vector_OTC؟")) {
      setSeo(DEFAULT_SITE_SEO);
      saveStoredSeo(DEFAULT_SITE_SEO);
      applySeoToDom(DEFAULT_SITE_SEO);
      setAiMessage("تمت استعادة الإعدادات الافتراضية بنجاح.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0e0819] border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/60 overflow-hidden my-auto text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-[#120a22] to-fuchsia-950/30">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-600 p-0.5 shadow-lg shadow-fuchsia-600/30">
              <div className="w-full h-full bg-theme-deep rounded-[14px] flex items-center justify-center text-fuchsia-400">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-black text-white tracking-wide">
                  مركز تحسين محركات البحث (SEO Master Studio)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  ذكاء اصطناعي ✨
                </span>
              </div>
              <p className="text-xs text-purple-300/70 mt-0.5">
                تخصيص هوية الموقع، عناوين محركات البحث، بطاقات التواصل، سيو المدونة، الأقسام والوسوم.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAiGenerateSiteSeo}
              disabled={isGeneratingAi}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-md shadow-fuchsia-600/30 transition-all cursor-pointer disabled:opacity-50"
              title="توليد كافة بيانات السيو تلقائياً بالذكاء الاصطناعي"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? "animate-spin" : ""}`} />
              <span>توليد السيو بالذكاء الاصطناعي</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-purple-500/15 bg-[#0b0615] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("site")}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "site"
                ? "border-fuchsia-500 text-fuchsia-400 bg-fuchsia-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>هوية وسيو الموقع الرئيسي</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "categories"
                ? "border-fuchsia-500 text-fuchsia-400 bg-fuchsia-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>سيو أقسام وتصنيفات المدونة</span>
          </button>
          <button
            onClick={() => setActiveTab("tags")}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "tags"
                ? "border-fuchsia-500 text-fuchsia-400 bg-fuchsia-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>سيو العناوين والوسوم (#)</span>
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "schema"
                ? "border-fuchsia-500 text-fuchsia-400 bg-fuchsia-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-4 h-4" />
            <span>البيانات الهيكلية (JSON-LD)</span>
          </button>
        </div>

        {/* Notification Banner */}
        {aiMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <span>{aiMessage}</span>
            </div>
            <button onClick={() => setAiMessage(null)} className="text-purple-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {activeTab === "site" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* AI Quick Button Mobile */}
                <div className="sm:hidden">
                  <button
                    onClick={handleAiGenerateSiteSeo}
                    disabled={isGeneratingAi}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>توليد كل السيو بالذكاء الاصطناعي</span>
                  </button>
                </div>

                {/* Page Title */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      عنوان الموقع لمحركات البحث (Meta Title):
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        titleLength > 60 ? "text-amber-400 font-bold" : "text-slate-400"
                      }`}
                    >
                      {titleLength}/60 حرف {titleLength > 60 && "(طويل نسبياً)"}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seo.siteTitle}
                    onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                    className="w-full bg-[#150d26] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                    placeholder="Vector_OTC | منصة إشارات التداول والخيارات الثنائية"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    هذا العنوان يظهر كعنوان رئيسي في نتائج بحث Google وشريط المتصفح.
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      وصف الموقع لمحركات البحث (Meta Description):
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        descLength > 160
                          ? "text-amber-400 font-bold"
                          : descLength < 120
                          ? "text-slate-400"
                          : "text-emerald-400 font-bold"
                      }`}
                    >
                      {descLength}/160 حرف {descLength >= 120 && descLength <= 160 ? "✅ مثالي" : ""}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={seo.metaDescription}
                    onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                    className="w-full bg-[#150d26] border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-fuchsia-500 transition-colors leading-relaxed"
                    placeholder="اكتب وصفاً جذاباً يشجع الزوار على النقر والدخول للمنصة..."
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    يُنصح بأن يكون الطول بين 120 إلى 160 حرفاً لتجنب اقتطاع الوصف في بحث Google.
                  </p>
                </div>

                {/* Focus Keywords */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    الكلمات المفتاحية المستهدفة (Focus Keywords):
                  </label>
                  <div className="bg-[#150d26] border border-purple-500/30 rounded-xl p-3 min-h-[85px] flex flex-wrap gap-2 items-center">
                    {seo.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(idx)}
                          className="hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleAddKeyword}
                      className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none flex-1 min-w-[140px]"
                      placeholder="أضف كلمة واضغط Enter..."
                    />
                  </div>
                </div>

                {/* Additional Technical Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      اسم الهوية (Brand Site Name):
                    </label>
                    <input
                      type="text"
                      value={seo.ogSiteName}
                      onChange={(e) => setSeo({ ...seo, ogSiteName: e.target.value })}
                      className="w-full bg-[#150d26] border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      الرابط الأساسي (Canonical URL):
                    </label>
                    <input
                      type="text"
                      value={seo.canonicalUrl}
                      onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                      className="w-full bg-[#150d26] border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500 font-mono"
                    />
                  </div>
                </div>

                {/* Social Share Image URL */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    صورة بطاقة المشاركة الاجتماعية (OpenGraph & Twitter Image):
                  </label>
                  <input
                    type="text"
                    value={seo.ogImage}
                    onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                    className="w-full bg-[#150d26] border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-fuchsia-500 font-mono"
                  />
                </div>

              </div>

              {/* Right Column: Real-time Live Google Search Preview (SERP Preview) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-fuchsia-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>معاينة الظهور الحية في Google (SERP Preview)</span>
                  </h4>
                  <div className="flex items-center gap-1 bg-[#150d26] border border-purple-500/30 rounded-lg p-0.5">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                        previewDevice === "desktop" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                      title="معاينة شاشات الكمبيوتر"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                        previewDevice === "mobile" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                      title="معاينة الهواتف الذكية"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Google Snippet Box */}
                <div
                  className={`bg-white text-[#202124] rounded-2xl p-4 shadow-xl border border-slate-300 font-sans transition-all text-right ${
                    previewDevice === "mobile" ? "max-w-[340px] mx-auto" : "w-full"
                  }`}
                  dir="rtl"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#1a0f35] flex items-center justify-center text-[10px] font-bold text-fuchsia-400">
                      V
                    </div>
                    <div className="text-[12px] leading-tight text-[#202124]">
                      <span className="font-semibold">{seo.ogSiteName || "Vector_OTC"}</span>
                      <span className="text-[#5f6368] mx-1">›</span>
                      <span className="text-[#5f6368] text-[11px] font-mono">https://vectorotc.app</span>
                    </div>
                  </div>

                  <h3 className="text-[17px] md:text-[19px] leading-snug font-normal text-[#1a0dab] hover:underline cursor-pointer mb-1.5">
                    {seo.siteTitle || "عنوان الموقع في محرك البحث"}
                  </h3>

                  <p className="text-[13px] leading-relaxed text-[#4d5156] line-clamp-3">
                    {seo.metaDescription || "الوصف التعريفي الذي يظهر للمستخدمين عند البحث في محرك جوجل..."}
                  </p>
                </div>

                {/* Social Share Card Preview (OpenGraph / Twitter) */}
                <div className="mt-4">
                  <h4 className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5 mb-2">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>معاينة بطاقة المشاركة الاجتماعية (Twitter & WhatsApp)</span>
                  </h4>
                  <div className="rounded-2xl overflow-hidden border border-purple-500/20 bg-[#140c26] shadow-lg">
                    {seo.ogImage && (
                      <div className="h-36 w-full overflow-hidden bg-black/40">
                        <img
                          src={seo.ogImage}
                          alt="OpenGraph preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="p-3.5">
                      <span className="text-[10px] font-mono uppercase text-fuchsia-400 tracking-wider block mb-1">
                        {seo.ogSiteName || "vectorotc.app"}
                      </span>
                      <h4 className="font-bold text-sm text-white line-clamp-1 mb-1">
                        {seo.siteTitle}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {seo.metaDescription}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === "categories" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20">
                <div>
                  <h4 className="font-extrabold text-sm text-white">تحسين سيو أقسام وتصنيفات المدونة</h4>
                  <p className="text-xs text-purple-300/70 mt-0.5">
                    اختر القسم وقم بإنشاء وتخصيص عناوين السيو والأوصاف لاستهداف الكلمات البحثية في التداول.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAiGenerateCategorySeo(selectedCategory)}
                    disabled={isGeneratingAi}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>توليد سيو للقسم بالذكاء الاصطناعي</span>
                  </button>
                </div>
              </div>

              {/* Category selector */}
              <div className="flex flex-wrap gap-2">
                {(categories.length > 0
                  ? categories.map((c) => c.nameAr)
                  : [
                      "استراتيجيات التداول",
                      "تداول الذهب والنفط",
                      "السكالبنج والتحليل الفني",
                      "أسرار أسواق OTC",
                      "المؤشرات والتأكيد",
                      "إدارة المخاطر ورأس المال",
                    ]
                ).map((catName) => (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === catName
                        ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30"
                        : "bg-[#150d26] text-slate-300 hover:bg-[#1f1438] border border-purple-500/20"
                    }`}
                  >
                    {catName}
                  </button>
                ))}
              </div>

              {/* Category SEO editor */}
              <div className="bg-[#120a22] border border-purple-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-fuchsia-300">
                    بيانات سيو قسم: {selectedCategory}
                  </span>
                  {categorySeoMap[selectedCategory] && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      تم التوليد بنجاح
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    عنوان السيو للتصنيف (Category SEO Title):
                  </label>
                  <input
                    type="text"
                    value={
                      categorySeoMap[selectedCategory]?.seoTitle ||
                      `مقالات ${selectedCategory} | مدونة Vector_OTC للمتداولين`
                    }
                    onChange={(e) =>
                      setCategorySeoMap((prev) => ({
                        ...prev,
                        [selectedCategory]: {
                          id: selectedCategory,
                          seoTitle: e.target.value,
                          seoDescription:
                            prev[selectedCategory]?.seoDescription ||
                            `دليل وشروحات متقدمة في ${selectedCategory}.`,
                          keywords: prev[selectedCategory]?.keywords || [],
                        },
                      }))
                    }
                    className="w-full bg-[#180f2d] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    وصف الميتا للتصنيف (Category Meta Description):
                  </label>
                  <textarea
                    rows={2}
                    value={
                      categorySeoMap[selectedCategory]?.seoDescription ||
                      `تصفح أحدث التحليلات والشروحات في ${selectedCategory} واستراتيجيات تداول الخيارات الثنائية والـ OTC الناجحة.`
                    }
                    onChange={(e) =>
                      setCategorySeoMap((prev) => ({
                        ...prev,
                        [selectedCategory]: {
                          id: selectedCategory,
                          seoTitle:
                            prev[selectedCategory]?.seoTitle ||
                            `مقالات ${selectedCategory} | Vector_OTC`,
                          seoDescription: e.target.value,
                          keywords: prev[selectedCategory]?.keywords || [],
                        },
                      }))
                    }
                    className="w-full bg-[#180f2d] border border-purple-500/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "tags" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20">
                <div>
                  <h4 className="font-extrabold text-sm text-white">سيو الوسوم والعناوين التداولية (#Tags)</h4>
                  <p className="text-xs text-purple-300/70 mt-0.5">
                    توليد أوصاف سيو مخصصة لصفحات الوسوم لتتصدر نتائج البحث لكلمات التداول الرائجة.
                  </p>
                </div>
                <button
                  onClick={() => handleAiGenerateTagSeo(selectedTag)}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>توليد سيو الوسم بالذكاء الاصطناعي</span>
                </button>
              </div>

              {/* Tags Cloud */}
              <div className="flex flex-wrap gap-2">
                {(tags.length > 0
                  ? tags.map((t) => t.name)
                  : [
                      "#الذهب_XAUUSD",
                      "#النفط_USOIL",
                      "#سكالبنج_5ثواني",
                      "#الاستراتيجية_الأوروبية",
                      "#PocketOption",
                      "#مؤشر_ستوكاستيك",
                      "#بولنجر_باند",
                      "#إدارة_المخاطر",
                    ]
                ).map((tName) => (
                  <button
                    key={tName}
                    onClick={() => setSelectedTag(tName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTag === tName
                        ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30"
                        : "bg-[#150d26] text-purple-300 hover:bg-[#1f1438] border border-purple-500/20"
                    }`}
                  >
                    {tName}
                  </button>
                ))}
              </div>

              {/* Tag SEO Box */}
              <div className="bg-[#120a22] border border-purple-500/30 rounded-2xl p-5 space-y-4">
                <span className="text-sm font-extrabold text-fuchsia-300 block">
                  بيانات سيو الوسم: {selectedTag}
                </span>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    عنوان سيو الوسم:
                  </label>
                  <input
                    type="text"
                    value={
                      tagSeoMap[selectedTag]?.seoTitle ||
                      `مقالات وتحليلات وسم ${selectedTag} | مدونة Vector_OTC`
                    }
                    onChange={(e) =>
                      setTagSeoMap((prev) => ({
                        ...prev,
                        [selectedTag]: {
                          id: selectedTag,
                          seoTitle: e.target.value,
                          seoDescription:
                            prev[selectedTag]?.seoDescription || "",
                          relatedTags: prev[selectedTag]?.relatedTags || [],
                        },
                      }))
                    }
                    className="w-full bg-[#180f2d] border border-purple-500/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    وصف ميتا مختصر للوسم:
                  </label>
                  <input
                    type="text"
                    value={
                      tagSeoMap[selectedTag]?.seoDescription ||
                      `تصفح مقالات واستراتيجيات وسم ${selectedTag} المخصصة لمتداولي الخيارات الثنائية والـ OTC.`
                    }
                    onChange={(e) =>
                      setTagSeoMap((prev) => ({
                        ...prev,
                        [selectedTag]: {
                          id: selectedTag,
                          seoTitle: prev[selectedTag]?.seoTitle || "",
                          seoDescription: e.target.value,
                          relatedTags: prev[selectedTag]?.relatedTags || [],
                        },
                      }))
                    }
                    className="w-full bg-[#180f2d] border border-purple-500/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "schema" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20">
                <h4 className="font-extrabold text-sm text-white">البيانات الهيكلية المنظمة (Schema.org JSON-LD)</h4>
                <p className="text-xs text-purple-300/70 mt-0.5">
                  هذا الكود الهيكلي يُدرج تلقائياً في رأس صفحة الموقع لمساعدة محركات البحث مثل Google على فهم نوع المنصة كـ WebApplication مالية.
                </p>
              </div>

              <div className="relative bg-[#07030d] border border-purple-500/25 rounded-2xl p-4 font-mono text-xs text-fuchsia-300/90 overflow-x-auto">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(
                        {
                          "@context": "https://schema.org",
                          "@type": "WebApplication",
                          "name": seo.ogSiteName || "Vector_OTC Options",
                          "alternateName": "Vector_OTC",
                          "applicationCategory": "FinanceApplication",
                          "operatingSystem": "All",
                          "description": seo.metaDescription,
                          "url": seo.canonicalUrl,
                        },
                        null,
                        2
                      )
                    );
                    alert("تم نسخ كود الـ JSON-LD بنجاح!");
                  }}
                  className="absolute top-3 left-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="نسخ الكود"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <pre>
                  {JSON.stringify(
                    {
                      "@context": "https://schema.org",
                      "@type": "WebApplication",
                      "name": seo.ogSiteName || "Vector_OTC Options",
                      "alternateName": "Vector_OTC",
                      "applicationCategory": "FinanceApplication",
                      "operatingSystem": "All",
                      "description": seo.metaDescription,
                      "url": seo.canonicalUrl,
                      "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-5 md:p-6 border-t border-purple-500/20 bg-[#0b0615]">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الإعدادات الافتراضية</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSaveSeo}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs md:text-sm shadow-lg shadow-fuchsia-600/30 transition-all cursor-pointer active:scale-95"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>تم الحفظ والتطبيق!</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>حفظ وتطبيق إعدادات السيو</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
