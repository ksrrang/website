(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get("lang");
  const pageLanguage = document.documentElement.lang.toLowerCase().startsWith("ko") ? "ko" : "en";
  const pairs = {
    "index.html": "index.en.html",
    "privacy.html": "privacy.en.html",
    "support.html": "support.en.html",
    "index.en.html": "index.html",
    "privacy.en.html": "privacy.html",
    "support.en.html": "support.html"
  };

  const currentPage = location.pathname.split("/").pop() || "index.html";

  function moveTo(language) {
    if (language === pageLanguage) return;
    const target = pairs[currentPage];
    if (!target) return;
    const url = new URL(target, location.href);
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
