import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  User, 
  Tag as TagIcon, 
  ArrowRight,
  BookOpen,
  Sparkles,
  Check
} from 'lucide-react';
import { Article } from '../types';

interface ArticleReaderModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (articleId: string) => void;
  onSelectTag: (tag: string) => void;
  onSelectCategory: (category: string) => void;
  relatedArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

export function ArticleReaderModal({
  article,
  isOpen,
  onClose,
  onLike,
  onSelectTag,
  onSelectCategory,
  relatedArticles,
  onSelectArticle,
}: ArticleReaderModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !article) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'الآن';
    try {
      if (dateVal.toDate) {
        return dateVal.toDate().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
      }
      return new Date(dateVal).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'مؤخراً';
    }
  };

  // Basic markdown-like rendering for headings and paragraphs
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg md:text-xl font-bold text-fuchsia-300 mt-5 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl md:text-2xl font-black text-white mt-6 mb-3 pb-2 border-b border-purple-500/20">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('> 💡') || trimmed.startsWith('> ')) {
        return (
          <div key={idx} className="my-4 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-sm md:text-base flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>{trimmed.replace(/^>\s*(💡)?\s*/, '')}</div>
          </div>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="mr-4 my-1 text-slate-300 text-sm md:text-base leading-relaxed list-disc list-inside">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (trimmed === '---') {
        return <hr key={idx} className="my-6 border-purple-500/20" />;
      }
      return (
        <p key={idx} className="text-slate-300 text-sm md:text-base leading-relaxed my-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0a0612] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        id="article-reader-dialog"
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#140b2e]/90 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSelectCategory(article.category);
                onClose();
              }}
              className="px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:bg-fuchsia-500/30 transition-colors"
            >
              {article.category}
            </button>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              {article.readTime} دقيقة قراءة
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="نسخ رابط المقال"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? "تم النسخ!" : "مشاركة"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-6">
          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative w-full h-56 md:h-80 rounded-2xl overflow-hidden border border-purple-500/20 shadow-lg">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0612] via-transparent to-transparent opacity-80" />
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-snug">
            {article.title}
          </h1>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-purple-500/20 text-xs md:text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                <User className="w-4 h-4 text-purple-400" />
                <span className="font-semibold">{article.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-slate-400 font-mono">
                <Eye className="w-4 h-4 text-slate-400" />
                <span>{article.views} مشاهدة</span>
              </div>
              <button
                onClick={() => onLike(article.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-rose-500/30 text-rose-400" />
                <span className="font-bold font-mono">{article.likes} إعجاب</span>
              </button>
            </div>
          </div>

          {/* Excerpt / Lead */}
          {article.excerpt && (
            <div className="p-4 rounded-2xl bg-purple-900/15 border-r-4 border-fuchsia-500 text-slate-200 font-medium text-base leading-relaxed">
              {article.excerpt}
            </div>
          )}

          {/* Rendered Content */}
          <div className="article-body font-sans space-y-3">
            {renderContent(article.content)}
          </div>

          {/* SEO Metadata & Indexing Information Box */}
          {(article.keywords?.length || article.slug) && (
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-purple-300">
                <Sparkles className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />
                <span>
                  <strong className="text-white">مهيأ لمحركات البحث (SEO):</strong> {article.slug ? `/${article.slug}` : 'معتمد بالذكاء الاصطناعي'}
                </span>
              </div>
              {article.keywords && article.keywords.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 text-[11px]">الكلمات المفتاحية:</span>
                  {article.keywords.slice(0, 4).map((kw, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/20 font-mono text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-purple-500/20">
              <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 font-bold">
                <TagIcon className="w-4 h-4 text-purple-400" />
                <span>الوسوم المرتبطة بالمقال:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectTag(tag);
                      onClose();
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-purple-950/60 text-purple-300 border border-purple-500/30 hover:border-fuchsia-400 hover:text-fuchsia-200 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-fuchsia-400" />
                <span>مقالات ذات صلة قد تهمك</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel)}
                    className="p-4 rounded-2xl bg-[#140b2e] border border-purple-500/20 hover:border-fuchsia-500/40 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] text-fuchsia-400 font-semibold">{rel.category}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mt-1">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-white/5 font-mono">
                      <span>{rel.readTime} دقيقة</span>
                      <span className="flex items-center gap-1 text-purple-400 group-hover:translate-x-[-2px] transition-transform">
                        قراءة <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
