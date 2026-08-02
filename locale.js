(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get("lang");
  const pageLanguage = document.documentElement.lang.toLowerCase().startsWith("ko") ? "ko" : "en";
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentPage = pathParts.at(-1) || "index.html";
  const currentDirectory = pathParts.at(-2);
  const isLanguageRouter = currentDirectory !== "ko" && currentDirectory !== "en";

  function moveTo(language) {
    if (!isLanguageRouter && language === pageLanguage) return;
    const page = ["index.html", "privacy.html", "support.html"].includes(currentPage)
      ? currentPage
      : "index.html";
    const siteRoot = new URL(isLanguageRouter ? "./" : "../", location.href);
    const url = new URL(`${language}/${page}`, siteRoot);
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
