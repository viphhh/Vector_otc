import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Tag as TagIcon, 
  Folder, 
  PenSquare, 
  BookOpen, 
  Heart, 
  Eye, 
  Clock, 
  User, 
  ArrowLeft,
  Sparkles,
  TrendingUp,
  X,
  Plus,
  Globe
} from 'lucide-react';
import { Article, BlogCategory, BlogTag } from '../types';
import { INITIAL_ARTICLES, INITIAL_BLOG_CATEGORIES, INITIAL_BLOG_TAGS } from '../data/blogData';
import { ArticleReaderModal } from './ArticleReaderModal';
import { PublishArticleModal } from './PublishArticleModal';
import { SeoManagementModal } from './SeoManagementModal';
import { loadStoredSeo, applySeoToDom } from '../utils/seoHelper';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, increment, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface BlogSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BlogSection({ isOpen, onClose }: BlogSectionProps) {
  const { user, profile } = useAuth();
  
  // Articles state with localStorage + Firestore sync
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('vector_blog_articles');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ARTICLES;
  });

  // Categories & Tags state
  const [categories, setCategories] = useState<BlogCategory[]>(() => {
    const saved = localStorage.getItem('vector_blog_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_BLOG_CATEGORIES;
  });

  const [allTags, setAllTags] = useState<BlogTag[]>(() => {
    const saved = localStorage.getItem('vector_blog_tags');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_BLOG_TAGS;
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('vector_blog_likes') || '{}');
    } catch {
      return {};
    }
  });

  // Sync with Firestore collection
  useEffect(() => {
    try {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const firestoreArticles: Article[] = [];
          snapshot.forEach((d) => {
            const data = d.data();
            firestoreArticles.push({
              id: d.id,
              title: data.title || '',
              excerpt: data.excerpt || '',
              content: data.content || '',
              category: data.category || 'عام',
              tags: data.tags || [],
              coverImage: data.coverImage || '',
              author: data.author || 'المحرر',
              authorEmail: data.authorEmail || '',
              readTime: data.readTime || 3,
              views: data.views || 0,
              likes: data.likes || 0,
              published: true,
              seoTitle: data.seoTitle || data.title,
              seoDescription: data.seoDescription || data.excerpt,
              slug: data.slug || '',
              keywords: data.keywords || [],
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            });
          });

          // Merge with initial articles if not present
          const existingIds = new Set(firestoreArticles.map(a => a.id));
          const merged = [...firestoreArticles];
          INITIAL_ARTICLES.forEach(initArt => {
            if (!existingIds.has(initArt.id)) {
              merged.push(initArt);
            }
          });

          setArticles(merged);
          localStorage.setItem('vector_blog_articles', JSON.stringify(merged));
        }
      }, (err) => {
        console.warn('Firestore blog sync notice:', err.message);
      });

      return () => unsub();
    } catch (e) {
      console.warn('Firestore articles listener init note:', e);
    }
  }, []);

  // Save articles to local storage
  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    localStorage.setItem('vector_blog_articles', JSON.stringify(newArticles));
  };

  // Like Article
  const handleLike = async (articleId: string) => {
    const isAlreadyLiked = likedArticles[articleId];
    const delta = isAlreadyLiked ? -1 : 1;

    // Update locally
    const updated = articles.map(art => {
      if (art.id === articleId) {
        return { ...art, likes: Math.max(0, art.likes + delta) };
      }
      return art;
    });
    saveArticles(updated);

    const newLiked = { ...likedArticles, [articleId]: !isAlreadyLiked };
    setLikedArticles(newLiked);
    localStorage.setItem('vector_blog_likes', JSON.stringify(newLiked));

    // Update active view if open
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(prev => prev ? { ...prev, likes: Math.max(0, prev.likes + delta) } : null);
    }

    // Try Firestore update
    try {
      const artRef = doc(db, 'articles', articleId);
      await updateDoc(artRef, {
        likes: increment(delta)
      });
    } catch {
      // Ignored gracefully if offline or mock doc
    }
  };

  // Open & Track Views
  const handleOpenArticle = async (article: Article) => {
    // Increment view
    const updated = articles.map(art => {
      if (art.id === article.id) {
        return { ...art, views: art.views + 1 };
      }
      return art;
    });
    saveArticles(updated);

    setSelectedArticle({ ...article, views: article.views + 1 });
    try {
      applySeoToDom(loadStoredSeo(), {
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt,
        image: article.coverImage,
      });
    } catch (e) {
      console.error('Failed to apply article SEO:', e);
    }

    // Firestore increment view
    try {
      const artRef = doc(db, 'articles', article.id);
      await updateDoc(artRef, {
        views: increment(1)
      });
    } catch {}
  };

  // Publish New Article
  const handlePublish = async (newArticleData: Omit<Article, 'id' | 'views' | 'likes' | 'createdAt' | 'updatedAt'>) => {
    const articleId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newArticle: Article = {
      ...newArticleData,
      id: articleId,
      views: 1,
      likes: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Save locally
    const updated = [newArticle, ...articles];
    saveArticles(updated);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'articles', articleId), {
        title: newArticle.title,
        excerpt: newArticle.excerpt,
        content: newArticle.content,
        category: newArticle.category,
        tags: newArticle.tags,
        coverImage: newArticle.coverImage,
        author: newArticle.author,
        authorEmail: newArticle.authorEmail || user?.email || 'viphhhxxx@gmail.com',
        readTime: newArticle.readTime,
        views: 1,
        likes: 0,
        published: true,
        seoTitle: newArticle.seoTitle || newArticle.title,
        seoDescription: newArticle.seoDescription || newArticle.excerpt,
        slug: newArticle.slug || newArticle.title.toLowerCase().replace(/\s+/g, '-'),
        keywords: newArticle.keywords || newArticle.tags,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Article saved locally, firestore sync note:', e);
    }
  };

  // Add custom category
  const handleAddNewCategory = (cat: BlogCategory) => {
    if (!categories.find(c => c.nameAr === cat.nameAr)) {
      const nextCats = [...categories, cat];
      setCategories(nextCats);
      localStorage.setItem('vector_blog_categories', JSON.stringify(nextCats));
    }
  };

  // Add custom tag
  const handleAddNewTag = (tag: BlogTag) => {
    if (!allTags.find(t => t.name === tag.name)) {
      const nextTags = [...allTags, tag];
      setAllTags(nextTags);
      localStorage.setItem('vector_blog_tags', JSON.stringify(nextTags));
    }
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      // Category filter
      if (selectedCategory !== 'all' && art.category !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (selectedTag && (!art.tags || !art.tags.includes(selectedTag))) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase().trim();
        const matchTitle = art.title.toLowerCase().includes(queryLower);
        const matchExcerpt = art.excerpt.toLowerCase().includes(queryLower);
        const matchContent = art.content.toLowerCase().includes(queryLower);
        const matchCategory = art.category.toLowerCase().includes(queryLower);
        const matchTags = art.tags && art.tags.some(t => t.toLowerCase().includes(queryLower));
        if (!matchTitle && !matchExcerpt && !matchContent && !matchCategory && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [articles, selectedCategory, selectedTag, searchQuery]);

  // Related articles for the opened article
  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    return articles
      .filter(a => a.id !== selectedArticle.id && (a.category === selectedArticle.category || a.tags.some(t => selectedArticle.tags.includes(t))))
      .slice(0, 2);
  }, [articles, selectedArticle]);

  // Format date helper
  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'الآن';
    try {
      if (dateVal.toDate) {
        return dateVal.toDate().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return new Date(dateVal).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'مؤخراً';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl bg-[#0a0612] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        id="blog-main-container"
      >
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-4 border-b border-purple-500/20 bg-[#140b2e]/95 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-600 p-0.5 shadow-lg shadow-fuchsia-500/20 flex-shrink-0">
              <div className="w-full h-full bg-[#0a0612] rounded-[14px] flex items-center justify-center text-fuchsia-400">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-black text-white">مدونة Vector_OTC للمتداولين</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  {articles.length} مقال
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مقالات احترافية، استراتيجيات سكالبنج، أسرار خوارزميات الـ OTC والتحليل الفني
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* SEO Studio Button */}
            <button
              onClick={() => setIsSeoModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 hover:text-white font-bold text-xs md:text-sm transition-all cursor-pointer shadow-sm"
              id="btn-open-seo-studio-from-blog"
              title="مركز السيو والذكاء الاصطناعي لكتابة وتوليد سيو المدونة والأقسام والوسوم"
            >
              <Globe className="w-4 h-4 text-fuchsia-400" />
              <span>إدارة وسيو المدونة 🌐✨</span>
            </button>

            {/* Publish Article Button */}
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs md:text-sm shadow-md shadow-fuchsia-600/30 transition-all cursor-pointer active:scale-95"
              id="btn-publish-new-article"
            >
              <PenSquare className="w-4 h-4" />
              <span>نشر مقال جديد</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="إغلاق المدونة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subheader: Search, Categories & Tags */}
        <div className="px-6 py-4 border-b border-purple-500/15 bg-[#0e071c] space-y-3">
          {/* Search bar & Tag active indicator */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مقال، استراتيجية، مؤشر (مثال: الذهب، ستوكاستيك، سكالبنج)..."
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-[#140b2e] border border-purple-500/25 text-white placeholder:text-slate-500 text-xs md:text-sm focus:outline-none focus:border-fuchsia-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Active Tag indicator */}
            {selectedTag && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-bold">
                <span>تصفية بالوسم: #{selectedTag}</span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="p-0.5 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Categories Tab Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30'
                  : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/40 border border-purple-500/20'
              }`}
            >
              <Folder className="w-3 h-3" />
              <span>جميع التصنيفات ({articles.length})</span>
            </button>

            {categories.map((cat) => {
              const count = articles.filter(a => a.category === cat.nameAr).length;
              const isActive = selectedCategory === cat.nameAr;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.nameAr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30'
                      : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/40 border border-purple-500/20'
                  }`}
                >
                  <span>{cat.nameAr}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-fuchsia-300 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tags Cloud Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs border-t border-purple-500/10">
            <div className="flex items-center gap-1 text-slate-500 font-bold whitespace-nowrap pl-1">
              <TagIcon className="w-3 h-3 text-purple-400" />
              <span>الوسوم الشائعة:</span>
            </div>
            {allTags.map((t) => {
              const isSelected = selectedTag === t.name;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTag(isSelected ? null : t.name)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-fuchsia-500 text-white font-bold'
                      : 'bg-purple-950/30 text-purple-400 hover:text-fuchsia-200 hover:bg-purple-900/50 border border-purple-500/15'
                  }`}
                >
                  #{t.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles List Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {filteredArticles.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">لا توجد مقالات مطابقة</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                لم يتم العثور على أي مقالات تطابق خيارات البحث أو التصفية الحالية.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedTag(null);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-bold transition-colors"
              >
                إعادة ضبط خيارات البحث
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((art) => (
                <article
                  key={art.id}
                  className="bg-[#140b2e] border border-purple-500/20 hover:border-fuchsia-500/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
                >
                  {/* Cover */}
                  <div 
                    onClick={() => handleOpenArticle(art)}
                    className="relative h-44 w-full overflow-hidden cursor-pointer"
                  >
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140b2e] via-transparent to-transparent opacity-90" />
                    
                    {/* Category pill */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0a0612]/80 backdrop-blur text-fuchsia-300 border border-fuchsia-500/30">
                        {art.category}
                      </span>
                    </div>

                    {/* Read time */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/60 text-slate-300 backdrop-blur flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {art.readTime} د
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <h3 
                        onClick={() => handleOpenArticle(art)}
                        className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>

                    {/* Tags */}
                    {art.tags && art.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {art.tags.slice(0, 3).map((t, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(t);
                            }}
                            className="text-[10px] font-mono text-purple-400 hover:text-fuchsia-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20 transition-colors"
                          >
                            #{t}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <User className="w-3 h-3 text-purple-400" />
                        <span className="truncate max-w-[90px]">{art.author}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>{art.views}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(art.id);
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] transition-colors ${
                            likedArticles[art.id] 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                              : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                          }`}
                          title="إعجاب"
                        >
                          <Heart className={`w-3 h-3 ${likedArticles[art.id] ? 'fill-rose-400 text-rose-400' : ''}`} />
                          <span>{art.likes}</span>
                        </button>

                        <button
                          onClick={() => handleOpenArticle(art)}
                          className="flex items-center gap-1 text-fuchsia-400 hover:text-fuchsia-300 font-bold text-xs group-hover:translate-x-[-2px] transition-transform"
                        >
                          <span>قراءة</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary / Quick Info */}
        <div className="px-6 py-3 border-t border-purple-500/20 bg-[#140b2e]/90 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>يتم تحديث مقالات المدونة وتحليلات السكالبنج دورياً بواسطة كبار خبراء التداول.</span>
          </div>
          <span className="font-mono text-slate-500">Vector OTC Academy & Blog</span>
        </div>
      </div>

      {/* Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => {
          setSelectedArticle(null);
          try {
            applySeoToDom(loadStoredSeo());
          } catch {}
        }}
        onLike={handleLike}
        onSelectTag={(tag) => setSelectedTag(tag)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        relatedArticles={relatedArticles}
        onSelectArticle={handleOpenArticle}
      />

      {/* Publisher Modal */}
      <PublishArticleModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        categories={categories}
        allTags={allTags}
        onPublish={handlePublish}
        currentUserEmail={user?.email || null}
        currentUserName={profile?.name || user?.displayName || null}
        onAddNewCategory={handleAddNewCategory}
        onAddNewTag={handleAddNewTag}
      />

      {/* SEO Management Modal from within Blog */}
      <SeoManagementModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        categories={categories}
        tags={allTags}
      />
    </div>
  );
}
