(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get("lang");
  const pathParts = location.pathname.split("/").filter(Boolean);
  const lastPathPart = pathParts.at(-1);
  const isDirectoryIndex = lastPathPart === "ko" || lastPathPart === "en";
  const currentPage = isDirectoryIndex ? "index.html" : (lastPathPart || "index.html");
  const currentDirectory = isDirectoryIndex ? lastPathPart : pathParts.at(-2);
  const isLanguageRouter = currentDirectory !== "ko" && currentDirectory !== "en";

  addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-language]").forEach((link) => {
      link.addEventListener("click", () => {
        sessionStorage.setItem("ksrrangaudio-language", link.dataset.language);
      });
    });
  });

  // Language pages must remain directly crawlable. Automatic country-based
  // routing is performed only by the root language router.
  if (!isLanguageRouter) return;

  function moveTo(language) {
    const page = ["index.html", "privacy.html", "support.html"].includes(currentPage)
      ? currentPage
      : "index.html";
    const siteRoot = new URL(isLanguageRouter ? "./" : "../", location.href);
    const target = page === "index.html" ? `${language}/` : `${language}/${page}`;
    const url = new URL(target, siteRoot);
    url.hash = location.hash;
    location.replace(url);
  }

  if (requested === "ko" || requested === "en") {
    sessionStorage.setItem("ksrrangaudio-language", requested);
    moveTo(requested);
    return;
  }

  const saved = sessionStorage.getItem("ksrrangaudio-language");
  if (saved === "ko" || saved === "en") {
    moveTo(saved);
    return;
  }

  const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Seoul"
    ? "ko"
    : "en";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1800);

  fetch("https://ipwho.is/?fields=success,country_code", { signal: controller.signal })
    .then((response) => {
      if (!response.ok) throw new Error("Location lookup failed");
      return response.json();
    })
    .then((locationData) => {
      const language = locationData.success !== false && locationData.country_code === "KR"
        ? "ko"
        : "en";
      sessionStorage.setItem("ksrrangaudio-language", language);
      moveTo(language);
    })
    .catch(() => moveTo(fallback))
    .finally(() => clearTimeout(timer));
})();
