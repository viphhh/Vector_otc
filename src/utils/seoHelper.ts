import { SiteSeo } from "../types";

export const DEFAULT_SITE_SEO: SiteSeo = {
  siteTitle: "Vector_OTC | منصة إشارات التداول والخيارات الثنائية والسكالبنج",
  metaDescription: "منصة Vector_OTC الأولى لتحليل أسواق OTC والخيارات الثنائية بدقة عالية، تعتمد الاستراتيجية الأوروبية الثلاثية ومحرك الذكاء الاصطناعي مع مدونة تعليمية شاملة.",
  keywords: [
    "Vector_OTC",
    "خيارات ثنائية",
    "بوكت اوبشن",
    "Pocket Option",
    "إشارات تداول",
    "الاستراتيجية الأوروبية",
    "سكالبنج 5 ثواني",
    "تداول OTC",
    "تحليل فني",
    "تداول الذهب والنفط",
    "مؤشر ستوكاستيك",
    "بولنجر باند",
    "مدونة التداول"
  ],
  canonicalUrl: "https://vectorotc.app/",
  ogImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80",
  ogSiteName: "Vector_OTC Options",
  twitterCard: "summary_large_image",
  structuredDataType: "WebApplication",
};

const LOCAL_SEO_KEY = "vector_otc_site_seo_settings";

export function loadStoredSeo(): SiteSeo {
  try {
    const raw = localStorage.getItem(LOCAL_SEO_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SITE_SEO, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load local SEO settings:", e);
  }
  return DEFAULT_SITE_SEO;
}

export function saveStoredSeo(seo: SiteSeo): void {
  try {
    localStorage.setItem(LOCAL_SEO_KEY, JSON.stringify(seo));
  } catch (e) {
    console.error("Failed to save local SEO settings:", e);
  }
}

/**
 * Updates DOM head elements (meta tags, title, OpenGraph, Twitter, and Schema.org JSON-LD)
 */
export function applySeoToDom(seo: SiteSeo, customArticle?: { title?: string; description?: string; image?: string; url?: string }) {
  const activeTitle = customArticle?.title 
    ? `${customArticle.title} | Vector_OTC` 
    : (seo.siteTitle || DEFAULT_SITE_SEO.siteTitle);

  const activeDescription = customArticle?.description 
    || seo.metaDescription 
    || DEFAULT_SITE_SEO.metaDescription;

  const activeImage = customArticle?.image 
    || seo.ogImage 
    || DEFAULT_SITE_SEO.ogImage;

  const activeUrl = customArticle?.url 
    || (typeof window !== "undefined" ? window.location.href : seo.canonicalUrl);

  // 1. Page Title
  document.title = activeTitle;

  // Helper to set or create meta tag
  const setMeta = (attribute: "name" | "property", value: string, content: string) => {
    let el = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attribute, value);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  // 2. Standard Meta
  setMeta("name", "description", activeDescription);
  if (seo.keywords && seo.keywords.length > 0) {
    setMeta("name", "keywords", seo.keywords.join(", "));
  }

  // 3. OpenGraph Social Cards
  setMeta("property", "og:type", customArticle ? "article" : "website");
  setMeta("property", "og:title", activeTitle);
  setMeta("property", "og:description", activeDescription);
  setMeta("property", "og:image", activeImage);
  setMeta("property", "og:url", activeUrl);
  setMeta("property", "og:site_name", seo.ogSiteName || "Vector_OTC Options");

  // 4. Twitter / X Cards
  setMeta("name", "twitter:card", seo.twitterCard || "summary_large_image");
  setMeta("name", "twitter:title", activeTitle);
  setMeta("name", "twitter:description", activeDescription);
  setMeta("name", "twitter:image", activeImage);

  // 5. Canonical Link
  let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute("href", activeUrl);

  // 6. Schema.org JSON-LD Structured Data
  let scriptLdJson = document.querySelector("script#seo-structured-data") as HTMLScriptElement | null;
  if (!scriptLdJson) {
    scriptLdJson = document.createElement("script");
    scriptLdJson.id = "seo-structured-data";
    scriptLdJson.type = "application/ld+json";
    document.head.appendChild(scriptLdJson);
  }

  const structuredData = customArticle ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": customArticle.title,
    "description": customArticle.description,
    "image": [activeImage],
    "mainEntityOfPage": activeUrl,
    "author": {
      "@type": "Organization",
      "name": seo.ogSiteName || "Vector_OTC"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vector_OTC",
      "logo": {
        "@type": "ImageObject",
        "url": activeImage
      }
    }
  } : {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": seo.ogSiteName || "Vector_OTC Options",
    "alternateName": "Vector_OTC",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "description": activeDescription,
    "url": activeUrl,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  scriptLdJson.textContent = JSON.stringify(structuredData, null, 2);
}

/**
 * Call AI Backend to generate optimized SEO
 */
export async function requestAiSeo(payload: {
  type: "site" | "article" | "category" | "tag";
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tagName?: string;
}) {
  const res = await fetch("/api/seo/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`خطأ أثناء توليد السيو: ${res.statusText}`);
  }

  return await res.json();
}
