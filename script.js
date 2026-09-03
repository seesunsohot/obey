async function changeLanguage(language) {
  if (languageChanging) return;
  if (activeLanguage === language) return;

  languageChanging = true;

  /* 제자리에서 빠르게 blur-out */
  container.classList.add("language-out");

  await wait(160);

  activeLanguage = language;

  updateLanguageUI();

  if (language === "en") {
    englishMode = "odysseus";

    enSwitch.classList.remove("is-on");
  }

  /*
    기존 SVG 교체
  */

  if (language === "kr") {
    await loadKorean(true);
  } else {
    await loadEnglish(true);
  }

  /*
    새 SVG를 blur 상태로 준비
  */

  container.classList.remove("language-out");

  container.classList.add("language-in");

  void container.offsetWidth;

  /*
    같은 자리에서 바로 선명해짐
  */

  requestAnimationFrame(() => {
    container.classList.remove("language-in");
  });

  await wait(220);

  languageChanging = false;
}
