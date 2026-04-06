import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
}

const BASE_TITLE = "Tenth Avenue Bible Chapel";
const BASE_URL = "https://www.tenthavechapel.com";
const DEFAULT_IMAGE = `${BASE_URL}/logo512.png`;

const useSEO = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  jsonLd,
}: SEOProps) => {
  useEffect(() => {
    const fullTitle = title === BASE_TITLE ? title : `${title} | ${BASE_TITLE}`;
    document.title = fullTitle;

    const setMeta = (selector: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        const attr = selector.includes("[property")
          ? "property"
          : selector.includes("[name")
            ? "name"
            : "name";
        const match = selector.match(/["']([^"']+)["']/);
        if (match) el.setAttribute(attr, match[1]);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta('meta[name="title"]', fullTitle);
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', ogTitle || fullTitle);
    setMeta('meta[property="og:description"]', ogDescription || description);
    setMeta('meta[property="og:type"]', ogType);
    setMeta('meta[property="og:image"]', ogImage || DEFAULT_IMAGE);
    setMeta('meta[name="twitter:title"]', ogTitle || fullTitle);
    setMeta('meta[name="twitter:description"]', ogDescription || description);
    setMeta('meta[name="twitter:image"]', ogImage || DEFAULT_IMAGE);

    if (canonical) {
      setMeta('meta[property="og:url"]', canonical);
      setMeta('meta[name="twitter:url"]', canonical);
      let link = document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
      );
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Inject or replace page-level JSON-LD
    const scriptId = "page-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(
        Array.isArray(jsonLd) ? jsonLd : jsonLd,
      );
    } else if (script) {
      script.remove();
    }

    return () => {
      // Restore base title on unmount
      document.title = `${BASE_TITLE} - A Small Bible Believing Christian Fellowship in Burnaby, BC`;
    };
  }, [
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    jsonLd,
  ]);
};

export default useSEO;
