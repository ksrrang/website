import { readFile, writeFile } from "node:fs/promises";

function articles(html) {
  return [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map((match) => match[0]);
}

function replaceArticles(template, translated) {
  const sourceArticles = articles(template);
  const translatedArticles = articles(translated);
  if (sourceArticles.length !== translatedArticles.length) {
    throw new Error(`Article count mismatch: ${sourceArticles.length}/${translatedArticles.length}`);
  }
  let index = 0;
  return template.replace(/<article\b[^>]*>[\s\S]*?<\/article>/g, (sourceArticle) => {
    const translatedArticle = translatedArticles[index++];
    const openingTag = sourceArticle.match(/^<article\b[^>]*>/)[0];
    const inner = translatedArticle
      .replace(/^<article\b[^>]*>/, "")
      .replace(/<\/article>$/, "")
      .replaceAll('class="note"', 'class="notice"');
    return `${openingTag}${inner}</article>`;
  });
}

function replaceAll(html, replacements) {
  for (const [source, target] of replacements) {
    html = html.replaceAll(source, target);
  }
  return html;
}

const privacyKo = await readFile("ko/privacy.html", "utf8");
const privacyCurrentEn = await readFile("en/privacy.html", "utf8");
let privacyEn = replaceArticles(privacyKo, privacyCurrentEn);
privacyEn = replaceAll(privacyEn, [
  ['<html lang="ko">', '<html lang="en">'],
  ["KSRRangAudio 개인정보처리방침입니다. 미디어 파일, 마이크, SMB·FTP·SFTP 접속정보, 저장 및 공유 기능의 데이터 처리 방식을 안내합니다.", "KSRRangAudio Privacy Policy covering media files, microphone use, SMB/FTP/SFTP credentials, storage, and sharing."],
  ["개인정보처리방침 | KSRRangAudio", "Privacy Policy | KSRRangAudio"],
  ["../en/privacy.html?lang=en", "../ko/privacy.html?lang=ko"],
  [">홈으로<", ">Home<"],
  [">English<", ">한국어<"],
  ["<h1>개인정보처리방침</h1>", "<h1>Privacy Policy</h1>"],
  ["KSRRang(이하 “회사”)은 KSRRangAudio 이용자의 개인정보와 미디어 데이터를\n          중요하게 보호합니다. 이 방침은 KSRRangAudio가 어떤 정보에 접근하고, 해당\n          정보를 어떤 목적으로 처리하며, 어디에 저장하거나 전송하는지를 설명합니다.", "KSRRang (the “Company”) places great importance on protecting the personal information and media data of KSRRangAudio users. This policy explains what information KSRRangAudio accesses, why it processes that information, and where the information is stored or transmitted."],
  ["<h2>핵심 요약</h2>", "<h2>Summary</h2>"],
  ["미디어 처리", "Media processing"],
  ["오디오·동영상 파일은 재생, 편집, 보컬 제거 및 저장을 위해 처리됩니다.", "Audio and video files are processed for playback, editing, vocal removal, and saving."],
  ["마이크 사용", "Microphone"],
  ["오버더빙 녹음 시에만 사용하며, 이용자가 녹음을 시작한 경우에 작동합니다.", "It is used only for overdub recording and operates only after the user starts recording."],
  ["원격 서버 연결", "Remote servers"],
  ["SMB·FTP·SFTP 접속정보와 파일은 이용자가 지정한 서버와 직접 통신합니다.", "SMB, FTP, and SFTP credentials and files communicate directly with the server specified by the user."],
  ["결과물 저장·공유", "Saving and sharing"],
  ["편집본은 앱 내부 저장소에 저장되며 이용자가 선택한 앱으로 공유할 수 있습니다.", "Edited results are stored in app-internal storage and can be shared with an app selected by the user."],
  ["중요 안내", "Important"],
  ["KSRRangAudio는 이용자가 선택한 미디어 파일과 원격 서버의 콘텐츠를 회사 서버에\n          자동 업로드하지 않습니다. SMB·FTP·SFTP 사용 시 데이터는 이용자의 기기와\n          이용자가 직접 지정한 서버 사이에서 전송됩니다.", "KSRRangAudio does not automatically upload user-selected media or remote-server content to servers operated by the Company. With SMB, FTP, or SFTP, data is transferred between the user's device and the server the user specifies."],
  ["index.html", "../en/index.html"],
  ["support.html", "../en/support.html"],
  [">홈<", ">Home<"],
  [">고객지원<", ">Support<"],
  ["이메일 문의", "Email"]
]);
privacyEn = privacyEn.replace(
  /(<article>\s*<h2>15\. Privacy contact<\/h2>)(?!<div class="contact-box">)([\s\S]*?)(<\/article>)/,
  '$1<div class="contact-box">$2</div>$3'
);

const supportKo = await readFile("ko/support.html", "utf8");
const supportCurrentEn = await readFile("en/support.html", "utf8");
let supportEn = replaceArticles(supportKo, supportCurrentEn);
supportEn = replaceAll(supportEn, [
  ['<html lang="ko">', '<html lang="en">'],
  ["KSRRangAudio 고객지원 페이지입니다. 재생, 편집, 보컬 제거, 오버더빙, SMB·FTP·SFTP 연결, 파일 저장과 공유 관련 도움말을 제공합니다.", "KSRRangAudio support for playback, editing, vocal removal, overdubbing, SMB/FTP/SFTP connections, file storage, and sharing."],
  ["KSRRangAudio 고객지원 페이지입니다. 재생, 편집, 보컬 제거, 오버더빙, SMB·FTP·SFTP 연결, 파일 저장과 공유 문제 해결 방법을 안내합니다.", "KSRRangAudio support for playback, editing, vocal removal, overdubbing, SMB/FTP/SFTP connections, file storage, and sharing."],
  ["고객지원 | KSRRangAudio", "Support | KSRRangAudio"],
  ['aria-label="지원 페이지 메뉴"', 'aria-label="Support navigation"'],
  ["../en/support.html?lang=en", "../ko/support.html?lang=ko"],
  [">자주 묻는 질문<", ">FAQ<"],
  [">개인정보처리방침<", ">Privacy Policy<"],
  [">홈으로<", ">Home<"],
  [">English<", ">한국어<"],
  ["<h1>KSRRangAudio 고객지원</h1>", "<h1>KSRRangAudio Support</h1>"],
  ["재생, 오디오 편집, 보컬 제거, 오버더빙, SMB·FTP·SFTP 연결,\n          결과 파일 저장과 공유 과정에서 문제가 발생한 경우 아래 안내를 확인하세요.", "Use the guidance below if you experience a problem with playback, audio editing, vocal removal, overdubbing, SMB/FTP/SFTP connections, saving result files, or sharing."],
  ["이메일 문의", "Email support"],
  ["자주 묻는 질문", "Frequently asked questions"],
  ["재생 문제", "Playback issues"],
  ["파일이 열리지 않거나 재생이 끊길 때 확인할 사항을 안내합니다.", "What to check when a file will not open or playback is interrupted."],
  ["관련 내용 보기 →", "View details →"],
  ["원격 서버 연결", "Remote-server connections"],
  ["SMB, FTP, SFTP 접속 실패와 네트워크 문제를 확인합니다.", "How to investigate SMB, FTP, and SFTP connection and network failures."],
  ["저장 및 공유", "Saving and sharing"],
  ["편집 결과의 저장 위치와 카카오톡 등으로 공유하는 방법을 안내합니다.", "Where edited results are saved and how to share them through KakaoTalk or another app."],
  ["index.html", "../en/index.html"],
  ["privacy.html", "../en/privacy.html"],
  [">홈<", ">Home<"]
]);
supportEn = supportEn
  .replace(
    /<details>(<summary>[\s\S]*?<\/summary>)([\s\S]*?)<\/details>/g,
    (details, summary, answer) => answer.includes('class="answer"')
      ? details
      : `<details>${summary}<div class="answer">${answer}</div></details>`
  )
  .replace(
    /(<article id="(?:playback-support|remote-support|storage-support)">[\s\S]*?)(<\/article>)/g,
    (article, body, closing) => body.includes('class="back-link"')
      ? article
      : `${body}<p class="back-link"><a href="#top">Back to top ↑</a></p>${closing}`
  )
  .replace(
    /class="notice"(?=>\s*<strong>Do not send sensitive information:)/,
    'class="success"'
  )
  .replace(
    "<p>Files with the same extension can use different codecs. For a file-specific issue, include the extension, codecs, and approximate size in your report.</p>",
    '<p class="notice"><strong>About supported formats:</strong> Files with the same extension can use different codecs. For a file-specific issue, include the extension, codecs, and approximate size in your report.</p>'
  )
  .replace(
    '<a class="button" href="mailto:support@ksrrang.com?subject=KSRRangAudio%20Support">',
    '<a class="button button-primary" href="mailto:support@ksrrang.com?subject=KSRRangAudio%20Support">'
  )
  .replace(
    /(<article>\s*<h2>Customer-support contact<\/h2>)(?!<div class="contact-box">)([\s\S]*?<a class="button"[\s\S]*?<\/a>)([\s\S]*?<\/article>)/,
    '$1<div class="contact-box">$2</div>$3'
  );

for (const [name, html] of [["en/privacy.html", privacyEn], ["en/support.html", supportEn]]) {
  const remaining = [...html.matchAll(/[^\n<>]*[\uac00-\ud7af][^\n<>]*/gu)]
    .map((match) => match[0].trim())
    .filter((text) => text !== "한국어");
  if (remaining.length) {
    throw new Error(`${name} has untranslated text: ${remaining.join(" | ")}`);
  }
  await writeFile(name, html);
}
