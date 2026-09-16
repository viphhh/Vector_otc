import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Tag as TagIcon, 
  Image as ImageIcon, 
  Folder, 
  Sparkles, 
  AlertCircle,
  Eye,
  FileText,
  Globe,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Article, BlogCategory, BlogTag } from '../types';
import { requestAiSeo } from '../utils/seoHelper';

interface PublishArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: BlogCategory[];
  allTags: BlogTag[];
  onPublish: (article: Omit<Article, 'id' | 'views' | 'likes' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  currentUserEmail?: string | null;
  currentUserName?: string | null;
  onAddNewCategory?: (cat: BlogCategory) => void;
  onAddNewTag?: (tag: BlogTag) => void;
}

const PRESET_COVERS = [
  { label: "شارت تداول احترافي", url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80" },
  { label: "تداول الذهب والمعادن", url: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1000&q=80" },
  { label: "خوارزميات وسيولة", url: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80" },
  { label: "إدارة المخاطر والمال", url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80" },
  { label: "تداول الطاقة والنفط", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80" },
  { label: "العملات والخيارات", url: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1000&q=80" }
];

export function PublishArticleModal({
  isOpen,
  onClose,
  categories,
  allTags,
  onPublish,
  currentUserEmail,
  currentUserName,
  onAddNewCategory,
  onAddNewTag,
}: PublishArticleModalProps) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]?.nameAr || 'استراتيجيات التداول');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['الاستراتيجية_الأوروبية', 'سكالبنج_5ثواني']);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [author, setAuthor] = useState(currentUserName || 'محلل المنصة');
  const [readTime, setReadTime] = useState(3);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI SEO State
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [focusKeywords, setFocusKeywords] = useState<string[]>([]);
  const [isGeneratingAiSeo, setIsGeneratingAiSeo] = useState(false);
  const [showSeoSection, setShowSeoSection] = useState(true);
  const [aiSuccessBadge, setAiSuccessBadge] = useState(false);

  if (!isOpen) return null;

  // AI Auto-Generate Article SEO & Tags
  const handleAiAutoGenerateSeo = async () => {
    if (!title.trim() && !content.trim()) {
      setErrorMsg("يرجى كتابة عنوان المقال أو جزء من المحتوى أولاً ليتمكن الذكاء الاصطناعي من تحليل السيو.");
      return;
    }
    try {
      setIsGeneratingAiSeo(true);
      setErrorMsg(null);
      const res = await requestAiSeo({
        type: "article",
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim(),
        category: isCustomCategory ? customCategoryName : category,
      });

      if (res.success) {
        if (res.seoTitle) setSeoTitle(res.seoTitle);
        if (res.seoDescription) setSeoDescription(res.seoDescription);
        if (res.slug) setSlug(res.slug);
        if (res.keywords && Array.isArray(res.keywords)) setFocusKeywords(res.keywords);
        if (res.suggestedTags && Array.isArray(res.suggestedTags)) {
          const cleanTags = res.suggestedTags.map((t: string) => t.replace(/^#/, ''));
          setSelectedTags(Array.from(new Set([...selectedTags, ...cleanTags])));
        }
        setAiSuccessBadge(true);
        setTimeout(() => setAiSuccessBadge(false), 4000);
      }
    } catch (e: any) {
      console.error("AI SEO generation error:", e);
      setErrorMsg("تعذر التوليد السحابي، تم توليد إعدادات السيو الأولية.");
    } finally {
      setIsGeneratingAiSeo(false);
    }
  };

  // Estimate read time when content changes
  const handleContentChange = (val: string) => {
    setContent(val);
    const wordCount = val.trim().split(/\s+/).length;
    const est = Math.max(1, Math.ceil(wordCount / 120));
    setReadTime(est);
  };

  const handleAddTag = () => {
    const cleaned = tagInput.trim().replace(/^#/, '');
    if (cleaned && !selectedTags.includes(cleaned)) {
      setSelectedTags([...selectedTags, cleaned]);
      if (onAddNewTag) {
        onAddNewTag({ id: `tag_${Date.now()}`, name: cleaned });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalCategory = isCustomCategory ? customCategoryName.trim() : category;

    if (!title.trim() || title.trim().length < 5) {
      setErrorMsg('يرجى إدخال عنوان واضح للمقال (5 أحرف على الأقل)');
      return;
    }
    if (!excerpt.trim()) {
      setErrorMsg('يرجى إدخال ملخص قصير للمقال');
      return;
    }
    if (!content.trim() || content.trim().length < 30) {
      setErrorMsg('يرجى كتابة محتوى المقال (30 حرفاً على الأقل)');
      return;
    }
    if (!finalCategory) {
      setErrorMsg('يرجى اختيار أو كتابة تصنيف للمقال');
      return;
    }
    if (selectedTags.length === 0) {
      setErrorMsg('يرجى إضافة وسم (Tag) واحد على الأقل للمقال');
      return;
    }

    if (isCustomCategory && customCategoryName.trim() && onAddNewCategory) {
      onAddNewCategory({
        id: `cat_${Date.now()}`,
        nameAr: customCategoryName.trim(),
        nameEn: customCategoryName.trim(),
        description: 'تصنيف مخصص',
      });
    }

    setIsSubmitting(true);
    try {
      await onPublish({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category: finalCategory,
        tags: selectedTags,
        coverImage: customCoverUrl.trim() || coverImage,
        author: author.trim() || 'فريق التحليل الفني',
        authorEmail: currentUserEmail || 'viphhhxxx@gmail.com',
        readTime: Number(readTime) || 3,
        published: true,
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDescription.trim() || excerpt.trim(),
        slug: slug.trim() || title.trim().toLowerCase().replace(/\s+/g, '-'),
        keywords: focusKeywords.length > 0 ? focusKeywords : selectedTags,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'حدث خطأ أثناء نشر المقال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#0a0612] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        id="publish-article-dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#140b2e]/90 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">نشر مقال جديد في المدونة</h2>
              <p className="text-xs text-slate-400">شارك تحليلاتك واستراتيجياتك مع متداولي المنصة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                isPreviewMode 
                  ? 'bg-purple-600 text-white border-purple-500' 
                  : 'bg-purple-900/20 text-purple-300 border-purple-500/30 hover:bg-purple-900/40'
              }`}
            >
              {isPreviewMode ? <FileText className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isPreviewMode ? "وضع التحرير" : "معاينة"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {isPreviewMode ? (
            /* Live Preview */
            <div className="space-y-4">
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-purple-500/20">
                <img
                  src={customCoverUrl.trim() || coverImage}
                  alt="معاينة الغلاف"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  {isCustomCategory ? customCategoryName || 'تصنيف مخصص' : category}
                </span>
                <span className="text-xs text-slate-400">وقت القراءة المقدر: {readTime} دقيقة</span>
              </div>
              <h1 className="text-2xl font-black text-white">{title || 'عنوان المقال سيظهر هنا...'}</h1>
              <p className="text-sm text-purple-200 bg-purple-950/30 p-3 rounded-xl border border-purple-500/20">
                {excerpt || 'ملخص المقال سيظهر هنا...'}
              </p>
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans pt-2">
                {content || 'محتوى المقال سيظهر هنا...'}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4">
                {selectedTags.map((t, idx) => (
                  <span key={idx} className="text-xs text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded-md border border-purple-500/20">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* Edit Fields */
            <>
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1.5">
                  عنوان المقال <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: أسرار التداول على الذهب بفريم 15 ثانية"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140b2e] border border-purple-500/30 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-fuchsia-400 transition-colors"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1.5">
                  ملخص المقال (يظهر في البطاقة الرئيسية) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="موجز سريع في سطرين يلخص ما سيتعلمه القارئ من هذا المقال..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140b2e] border border-purple-500/30 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-fuchsia-400 transition-colors resize-none"
                  required
                />
              </div>

              {/* AI SEO Optimizer & Tags Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#180e30] to-fuchsia-950/50 border border-purple-500/35 shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-white">خيارات السيو والذكاء الاصطناعي (SEO Suite)</h4>
                        {aiSuccessBadge && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> تم التوليد بنجاح!
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-purple-300/70">
                        توليد وتخصيص عنوان السيو، وصف الميتا، الرابط اللطيف (Slug)، والوسوم الرائجة
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAiAutoGenerateSeo}
                      disabled={isGeneratingAiSeo || (!title.trim() && !content.trim())}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-black shadow-md shadow-fuchsia-600/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95 whitespace-nowrap"
                      title="تحليل المقال وكتابة السيو والوسوم تلقائياً عبر Gemini"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAiSeo ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingAiSeo ? "جاري توليد السيو..." : "✨ توليد السيو والوسوم بالذكاء الاصطناعي"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSeoSection(!showSeoSection)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300"
                    >
                      {showSeoSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {showSeoSection && (
                  <div className="pt-2 border-t border-purple-500/20 space-y-3">
                    {/* SEO Title & Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          عنوان السيو لمحركات البحث (SEO Meta Title):
                        </label>
                        <input
                          type="text"
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          placeholder={title || "عنوان مخصص لجذب الزوار في Google..."}
                          className="w-full px-3 py-2 rounded-xl bg-[#110724] border border-purple-500/30 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-fuchsia-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          الرابط الدائم اللطيف (URL Slug):
                        </label>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="gold-scalping-strategy-5s"
                          className="w-full px-3 py-2 rounded-xl bg-[#110724] border border-purple-500/30 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-fuchsia-400 font-mono"
                        />
                      </div>
                    </div>

                    {/* SEO Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-300">
                          وصف الميتا لمحركات البحث (SEO Meta Description):
                        </label>
                        <span className="text-[10px] font-mono text-purple-300">
                          {(seoDescription || excerpt).length}/160 حرف
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder={excerpt || "وصف موجز للمقال في صفحة نتائج البحث..."}
                        className="w-full px-3 py-2 rounded-xl bg-[#110724] border border-purple-500/30 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-fuchsia-400"
                      />
                    </div>

                    {/* Live SERP Preview for this Article */}
                    <div className="bg-white rounded-xl p-3 text-right text-slate-800 shadow-inner">
                      <div className="text-[11px] text-[#202124] flex items-center gap-1.5 mb-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[8px] font-bold">V</span>
                        <span className="font-semibold text-[10px]">vectorotc.app</span>
                        <span className="text-slate-400 text-[10px]">› blog › {slug || 'article-slug'}</span>
                      </div>
                      <h4 className="text-sm font-normal text-[#1a0dab] line-clamp-1 mb-0.5 hover:underline cursor-pointer">
                        {seoTitle || title || "عنوان المقال في نتائج البحث Google"}
                      </h4>
                      <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
                        {seoDescription || excerpt || "وصف المقال الجذاب سيظهر هنا في نتائج محرك البحث لمساعدة المتداولين على الوصول للمحتوى."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Category & ReadTime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-purple-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-fuchsia-400" />
                      التصنيف (Category)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(!isCustomCategory)}
                      className="text-[11px] text-fuchsia-400 hover:underline"
                    >
                      {isCustomCategory ? "اختر من القائمة" : "+ إضافة تصنيف جديد"}
                    </button>
                  </label>

                  {isCustomCategory ? (
                    <input
                      type="text"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      placeholder="اكتب اسم التصنيف الجديد..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140b2e] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-fuchsia-400"
                    />
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#140b2e] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-fuchsia-400"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.nameAr} className="bg-[#140b2e] text-white">
                          {c.nameAr}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-300 mb-1.5">
                    اسم الكاتب / المحلل
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="اسم الكاتب"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140b2e] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-fuchsia-400"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1.5 flex items-center gap-1.5">
                  <TagIcon className="w-3.5 h-3.5 text-fuchsia-400" />
                  الوسوم والكلمات المفتاحية (Tags)
                </label>

                {/* Selected Tag Badges */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Input to add tag */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="اكتب وسماً جديداً ثم اضغط إضافة أو Enter (مثال: الذهب_XAUUSD)"
                    className="flex-1 px-4 py-2 rounded-xl bg-[#140b2e] border border-purple-500/30 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-fuchsia-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                  >
                    + إضافة وسم
                  </button>
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1 mt-2 text-[11px] text-slate-400">
                  <span className="ml-1 text-slate-500">وسوم مقترحة:</span>
                  {allTags.slice(0, 6).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        if (!selectedTags.includes(t.name)) {
                          setSelectedTags([...selectedTags, t.name]);
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 hover:text-white hover:bg-purple-900/60 border border-purple-500/20"
                    >
                      +{t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-fuchsia-400" />
                  صورة غلاف المقال
                </label>

                {/* Presets Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {PRESET_COVERS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCoverImage(preset.url);
                        setCustomCoverUrl('');
                      }}
                      className={`relative h-14 rounded-xl overflow-hidden border cursor-pointer group transition-all ${
                        coverImage === preset.url && !customCoverUrl 
                          ? 'border-fuchsia-500 ring-2 ring-fuchsia-500/50 scale-105' 
                          : 'border-purple-500/30 hover:border-purple-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                        <span className="text-[9px] text-white font-medium leading-tight truncate">{preset.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <input
                  type="url"
                  value={customCoverUrl}
                  onChange={(e) => setCustomCoverUrl(e.target.value)}
                  placeholder="أو أدخل رابط صورة مخصصة (URL)..."
                  className="w-full px-4 py-2 rounded-xl bg-[#140b2e] border border-purple-500/30 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-fuchsia-400"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-xs font-bold text-purple-300 mb-1.5 flex items-center justify-between">
                  <span>محتوى المقال الكامل <span className="text-rose-400">*</span></span>
                  <span className="text-[11px] text-slate-400">يدعم تنسيق العناوين (## و ###) وقوائم النقاط (- )</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder={`اكتب المقال بالتفصيل هنا...
مثال:
## أسرار الدخول القوي
شرح المؤشرات وإعداداتها المثلى...

### نقاط الدخول
- تأكيد شمعة الابتلاع
- كسر مستوى المقاومة

> 💡 نصيحة: التزم دائماً بنسبة وقف الخسارة.`}
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl bg-[#140b2e] border border-purple-500/30 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-fuchsia-400 transition-colors font-sans"
                  required
                />
              </div>
            </>
          )}

          {/* Footer Submit */}
          <div className="pt-4 border-t border-purple-500/20 flex items-center justify-end gap-3 sticky bottom-0 bg-[#0a0612] py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? "جاري النشر..." : "نشر المقال فوراً"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
