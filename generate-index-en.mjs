import { readFile, writeFile } from "node:fs/promises";

const translations = new Map([
  ["<html lang=\"ko\">", "<html lang=\"en\">"],
  ["KSRRangAudio는 오디오 및 동영상 파일의 오디오를 재생·편집하고, 속도·피치·10밴드 EQ 조절, 보컬 제거, 오버더빙, SMB·FTP·SFTP 원격 파일 처리와 결과물 공유를 지원하는 안드로이드 오디오 앱입니다.", "KSRRangAudio is an Android audio app for playing and editing audio and audio tracks from video files, with speed, pitch, a 10-band EQ, vocal removal, overdubbing, SMB/FTP/SFTP remote-file processing, and result sharing."],
  ["KSRRangAudio | 오디오 재생·편집·보컬 제거", "KSRRangAudio | Audio Playback, Editing, and Vocal Removal"],
  ["속도·피치·10밴드 EQ 조절, 보컬 제거, 편집본 저장, 오버더빙 녹음을 하나의 앱에서 제공합니다.", "Adjust speed, pitch, and a 10-band EQ, remove vocals, save edits, and record overdubs in one app."],
  ["aria-label=\"KSRRangAudio 홈\"", "aria-label=\"KSRRangAudio home\""],
  ["aria-label=\"주요 메뉴\"", "aria-label=\"Main navigation\""],
  [">주요 기능<", ">Features<"],
  [">사용 흐름<", ">Workflow<"],
  [">소개<", ">About<"],
  [">문의<", ">Contact<"],
  ["../en/index.html?lang=en", "../ko/index.html?lang=ko"],
  [">English<", ">한국어<"],
  ["재생부터 편집, 보컬 제거와 오버더빙까지", "From playback and editing to vocal removal and overdubbing"],
  ["KSRRangAudio는 오디오 파일과 동영상 파일에 포함된 오디오를 처리할 수 있는\n            안드로이드 오디오 앱입니다. 속도와 피치를 변경하고, 10밴드 EQ로 음색을\n            조절하며, 보컬 제거와 오버더빙 녹음 기능까지 하나의 앱에서 제공합니다.\n            또한 SMB, FTP, SFTP 서버의 오디오 및 동영상 파일을 직접 불러와 재생하고,\n            편집하거나 보컬 제거 작업을 수행할 수 있습니다. 생성된 편집본, 보컬 제거본,\n            오버더빙 결과물은 앱 내부 저장소에 저장되며 공유 기능을 통해 카카오톡 등\n            다른 앱이나 기기로 전달할 수 있습니다.", "KSRRangAudio is an Android audio app that can process audio files and audio tracks contained in video files. Change speed and pitch, shape the sound with a 10-band EQ, remove vocals, and record overdubs—all in one app. You can also open audio and video files directly from SMB, FTP, and SFTP servers to play, edit, or remove vocals. Created edits, vocal-removal results, and overdubs are stored in app-internal storage and can be sent to KakaoTalk, another app, or another device through sharing."],
  [">기능 살펴보기<", ">Explore features<"],
  ["지원 문의", "Contact support"],
  ["aria-label=\"KSRRangAudio 기능 미리보기\"", "aria-label=\"KSRRangAudio feature preview\""],
  ["KSRRangAudio의 주요 기능", "Key KSRRangAudio features"],
  ["로컬 저장소와 SMB, FTP, SFTP 서버의 미디어를 재생하고, 원하는 소리로\n            편집한 뒤 새로운 오디오 파일로 저장하고 다른 앱이나 기기로 공유할 수 있습니다.", "Play media from local storage or SMB, FTP, and SFTP servers, edit it into the sound you want, save it as a new audio file, and share it with another app or device."],
  ["오디오 및 동영상 오디오 재생", "Audio and video-track playback"],
  ["오디오 파일뿐 아니라 동영상 파일에 포함된 오디오도 불러와 재생하고\n              처리할 수 있습니다.", "Open, play, and process both audio files and audio tracks contained in video files."],
  ["속도 및 피치 조절", "Speed and pitch adjustment"],
  ["재생 속도와 음높이를 각각 조절하여 음악 연습, 청취, 콘텐츠 제작 등\n              다양한 목적에 맞게 사용할 수 있습니다.", "Adjust playback speed and pitch independently for music practice, listening, content creation, and other purposes."],
  ["10밴드 이퀄라이저", "10-band equalizer"],
  ["저음부터 고음까지 10개 주파수 대역을 세밀하게 조절해 원하는 음색을\n              만들 수 있습니다.", "Fine-tune ten frequency bands from bass to treble to create the sound you want."],
  ["보컬 제거 및 저장", "Vocal removal and saving"],
  ["음악에서 보컬 성분을 줄이거나 제거하여 반주 중심의 오디오로 만들고\n              별도 파일로 저장할 수 있습니다.", "Reduce or remove vocal components to create accompaniment-focused audio and save it as a separate file."],
  ["편집 결과 저장", "Save edited results"],
  ["속도, 피치, EQ 설정이 적용된 오디오를 새로운 파일로 저장하여 다른\n              앱이나 기기에서도 활용할 수 있습니다.", "Save audio with speed, pitch, and EQ settings as a new file for use in other apps or on other devices."],
  ["오버더빙 녹음", "Overdub recording"],
  ["반주를 들으면서 마이크로 보컬이나 연주를 녹음하고, 반주와 녹음음을\n              하나의 오디오로 합칠 수 있습니다.", "Record vocals or instruments through the microphone while listening to a backing track, then combine both into one audio file."],
  ["오디오 플레이어", "Audio player"],
  ["재생, 일시정지, 탐색, 반복 등 오디오 플레이어의 기본 기능을 편리하게", "Conveniently use essential player controls including play, pause, seek, and repeat"],
  ["사용할 수 있습니다.", "."],
  ["SMB·FTP·SFTP 원격 파일 지원", "SMB, FTP, and SFTP remote-file support"],
  ["SMB, FTP, SFTP를 통해 원격 서버의 오디오 및 동영상 파일을 불러와\n              재생하고, 속도·피치·EQ 편집과 보컬 제거 작업을 수행할 수 있습니다.", "Open audio and video files from remote SMB, FTP, and SFTP servers for playback, speed/pitch/EQ editing, and vocal removal."],
  ["앱 내부 저장소에 결과 저장", "Store results in app-internal storage"],
  ["편집된 오디오, 보컬 제거 결과물, 오버더빙 생성물은 앱 내부 저장소에\n              저장되어 다른 파일과 분리하여 관리할 수 있습니다.", "Edited audio, vocal-removal results, and overdubs are stored in app-internal storage and can be managed separately from other files."],
  ["파일 공유", "File sharing"],
  ["앱 내부 저장소에 저장된 편집본, 보컬 제거본, 오버더빙 결과물을\n              공유 기능을 통해 카카오톡, 이메일 등 다른 앱이나 기기로 전달할 수 있습니다.", "Share edits, vocal-removal results, and overdubs stored in app-internal storage with KakaoTalk, email, another app, or another device."],
  ["간단한 사용 흐름", "A simple workflow"],
  ["로컬 또는 원격 서버의 파일을 선택하고, 원하는 소리로 조절한 뒤 앱 내부 저장소에 저장합니다.", "Select a local or remote-server file, adjust it to the sound you want, and save it in app-internal storage."],
  ["파일 선택", "Choose a file"],
  ["로컬 저장소 또는 SMB, FTP, SFTP 서버에서 오디오·동영상 파일을 불러옵니다.", "Open an audio or video file from local storage or an SMB, FTP, or SFTP server."],
  ["소리 조절", "Adjust the sound"],
  ["속도, 피치, 10밴드 EQ를 원하는 값으로 설정합니다.", "Set speed, pitch, and the 10-band EQ to the values you want."],
  ["AI 및 녹음 기능", "AI and recording"],
  ["필요에 따라 보컬 제거 또는 오버더빙 녹음을 실행합니다.", "Run vocal removal or overdub recording as needed."],
  ["재생 또는 저장", "Play or save"],
  ["처리된 결과를 앱 내부 저장소에 저장한 뒤 카카오톡 등 다른 앱이나 기기로 공유합니다.", "Save the processed result in app-internal storage, then share it with KakaoTalk, another app, or another device."],
  ["오디오를 더 자유롭게 다루는 방법", "A freer way to work with audio"],
  ["KSRRangAudio는 음악 감상, 노래와 악기 연습, 반주 제작, 오디오 편집 및\n              녹음을 하나의 앱에서 처리할 수 있도록 개발되고 있습니다.", "KSRRangAudio is being developed so that music listening, vocal and instrument practice, backing-track creation, audio editing, and recording can all be handled in one app."],
  ["다양한 미디어 형식을 지원하며, SMB, FTP, SFTP를 통한 원격 파일 재생과\n              편집도 제공합니다. 편집본, 보컬 제거 결과물, 오버더빙 생성물은 앱 내부\n              저장소에 저장되며, 공유 기능을 이용해 카카오톡 등 다른 앱이나 기기로\n              전달할 수 있습니다.", "It supports a variety of media formats and provides remote-file playback and editing through SMB, FTP, and SFTP. Edits, vocal-removal results, and overdubs are stored in app-internal storage and can be sent to KakaoTalk, another app, or another device through sharing."],
  ["일부 기능과 지원 형식은 기기, Android 버전 및 앱 버전에 따라 달라질\n              수 있습니다.", "Some features and supported formats may vary by device, Android version, and app version."],
  ["privacy.html", "../en/privacy.html"],
  ["support.html", "../en/support.html"],
  [">개인정보처리방침<", ">Privacy Policy<"],
  [">고객지원<", ">Support<"]
]);

let html = await readFile("ko/index.html", "utf8");
for (const [source, translated] of translations) {
  if (!html.includes(source)) continue;
  html = html.replaceAll(source, translated);
}
html = html
  .replace(
    "재생, 일시정지, 탐색, 반복 등 Audio player의 기본 기능을 편리하게\n              .",
    "Conveniently use essential player controls including play, pause, seek, and repeat."
  )
  .replace(
    "필요에 따라 보컬 제거 또는 Overdub recording을 실행합니다.",
    "Run vocal removal or overdub recording as needed."
  );

if (/[\uac00-\ud7af]/u.test(html.replaceAll("한국어", ""))) {
  const remaining = [...html.matchAll(/[^\n<>]*[\uac00-\ud7af][^\n<>]*/gu)]
    .map((match) => match[0].trim())
    .filter((text) => text !== "한국어");
  throw new Error(`Untranslated Korean text remains: ${remaining.join(" | ")}`);
}

await writeFile("en/index.html", html);
