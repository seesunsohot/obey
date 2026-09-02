const container =
  document.querySelector(
    "#svg-container"
  );

const krLabel =
  document.querySelector(
    "#kr-label"
  );

const enLabel =
  document.querySelector(
    "#en-label"
  );

const krSwitch =
  document.querySelector(
    "#kr-switch"
  );

const enSwitch =
  document.querySelector(
    "#en-switch"
  );

const musicSwitch =
  document.querySelector(
    "#music-switch"
  );

const music =
  document.querySelector(
    "#music"
  );


/* ==================================================
   STATE
================================================== */

let activeLanguage =
  "kr";

let koreanMode =
  "odyssey";

let englishMode =
  "odysseus";

let koreanData =
  null;

let englishData =
  null;

let koreanAnimating =
  false;

let englishAnimating =
  false;

let languageChanging =
  false;

let musicOn =
  false;


/* ==================================================
   WAIT
================================================== */

function wait(ms) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        ms
      );
    }
  );
}


/* ==================================================
   MUSIC
================================================== */

musicSwitch.addEventListener(
  "pointerup",

  async (event) => {

    event.preventDefault();


    if (!musicOn) {

      try {

        await music.play();

        musicOn =
          true;

        musicSwitch.classList.add(
          "is-on"
        );

      }

      catch (error) {

        console.error(
          "음악 재생 실패:",
          error
        );

      }

    }

    else {

      music.pause();

      musicOn =
        false;

      musicSwitch.classList.remove(
        "is-on"
      );

    }

  }
);


/* ==================================================
   LANGUAGE UI
================================================== */

function updateLanguageUI() {

  if (
    activeLanguage ===
    "kr"
  ) {

    krLabel.classList.add(
      "active-mode"
    );

    enLabel.classList.remove(
      "active-mode"
    );

  }

  else {

    enLabel.classList.add(
      "active-mode"
    );

    krLabel.classList.remove(
      "active-mode"
    );

  }

}


/* ==================================================
   LANGUAGE CHANGE
================================================== */

async function changeLanguage(
  language
) {

  if (
    languageChanging
  ) {
    return;
  }


  if (
    activeLanguage ===
    language
  ) {
    return;
  }


  languageChanging =
    true;


  /* 현재 언어 사라짐 */

  container.classList.add(
    "language-out"
  );


  await wait(
    550
  );


  /* 언어 변경 */

  activeLanguage =
    language;


  updateLanguageUI();


  if (
    language ===
    "en"
  ) {

    englishMode =
      "odysseus";

    enSwitch.classList.remove(
      "is-on"
    );

  }


  container.classList.remove(
    "language-out"
  );


  container.classList.add(
    "language-in"
  );


  /* 새 SVG */

  if (
    language === "kr"
  ) {

    await loadKorean(
      true
    );

  }

  else {

    await loadEnglish(
      true
    );

  }


  /*
    language-in 상태를
    실제 렌더링에 확정
  */

  void container.offsetWidth;


  /* 새 언어 등장 */

  container.classList.remove(
    "language-in"
  );


  await wait(
    750
  );


  languageChanging =
    false;

}


/* ==================================================
   KR LABEL
================================================== */

krLabel.addEventListener(
  "pointerup",

  (event) => {

    event.preventDefault();

    changeLanguage(
      "kr"
    );

  }
);


/* ==================================================
   EN LABEL
================================================== */

enLabel.addEventListener(
  "pointerup",

  (event) => {

    event.preventDefault();

    changeLanguage(
      "en"
    );

  }
);


/* ==================================================
   KR SWITCH
================================================== */

krSwitch.addEventListener(
  "pointerup",

  async (event) => {

    event.preventDefault();


    if (
      activeLanguage !==
      "kr"
    ) {

      await changeLanguage(
        "kr"
      );

      return;

    }


    toggleKorean();

  }
);


/* ==================================================
   EN SWITCH
================================================== */

enSwitch.addEventListener(
  "pointerup",

  async (event) => {

    event.preventDefault();


    if (
      activeLanguage !==
      "en"
    ) {

      await changeLanguage(
        "en"
      );

      return;

    }


    toggleEnglish();

  }
);


/* ==================================================
   KR LOAD
================================================== */

async function loadKorean(
  isLanguageSwitch = false
) {

  if (
    !isLanguageSwitch
  ) {

    container.classList.add(
      "is-loading"
    );

  }


  try {

    const response =
      await fetch(
        "./img/lettering.svg"
      );


    if (!response.ok) {

      throw new Error(
        "lettering.svg를 불러오지 못했습니다."
      );

    }


    const svgText =
      await response.text();


    container.innerHTML =
      svgText;


    const svg =
      container.querySelector(
        "svg"
      );


    if (!svg) {

      throw new Error(
        "SVG를 찾을 수 없습니다."
      );

    }


    setupKorean(
      svg
    );


    if (
      !isLanguageSwitch
    ) {

      requestAnimationFrame(
        () => {

          requestAnimationFrame(
            () => {

              container.classList.remove(
                "is-loading"
              );

            }
          );

        }
      );

    }

  }

  catch (error) {

    console.error(
      error
    );


    container.classList.remove(
      "is-loading"
    );

  }

}


/* ==================================================
   KR SETUP
================================================== */

function setupKorean(
  svg
) {

  const letter01 =
    svg.querySelector(
      "#letter01"
    );

  const letter02 =
    svg.querySelector(
      "#letter02"
    );

  const letter03 =
    svg.querySelector(
      "#letter03"
    );

  const letter04 =
    svg.querySelector(
      "#letter04"
    );

  const letter05 =
    svg.querySelector(
      "#letter05"
    );

  const letter06 =
    svg.querySelector(
      "#letter06"
    );


  const letters = [
    letter01,
    letter02,
    letter03,
    letter04,
    letter05,
    letter06,
  ];


  if (
    letters.some(
      (letter) =>
        !letter
    )
  ) {

    throw new Error(
      "letter01 ~ letter06을 찾지 못했습니다."
    );

  }


  const SVG_NS =
    "http://www.w3.org/2000/svg";


  const wordGroup =
    document.createElementNS(
      SVG_NS,
      "g"
    );


  wordGroup.id =
    "wordGroup";


  letters.forEach(
    (letter) => {

      wordGroup.appendChild(
        letter
      );

    }
  );


  svg.appendChild(
    wordGroup
  );


  /* '이' 위치 */

  const GAP =
    25;


  const seBox =
    letter03.getBBox();


  const iBox =
    letter06.getBBox();


  const iFinalX =
    seBox.x +
    seBox.width +
    GAP -
    iBox.x;


  const iFinalY =
    seBox.y +
    seBox.height / 2 -
    (
      iBox.y +
      iBox.height / 2
    );


  function getSvgCenterX() {

    const viewBox =
      svg.viewBox.baseVal;


    return (
      viewBox.x +
      viewBox.width /
      2
    );

  }


  function getCombinedBox(
    elements
  ) {

    let minX =
      Infinity;

    let maxX =
      -Infinity;


    elements.forEach(
      (element) => {

        const box =
          element.getBBox();


        minX =
          Math.min(
            minX,
            box.x
          );


        maxX =
          Math.max(
            maxX,
            box.x +
            box.width
          );

      }
    );


    return {
      x: minX,
      width:
        maxX - minX,
    };

  }


  /* 오디세우스 중앙 */

  const odysseusBox =
    getCombinedBox(
      [
        letter01,
        letter02,
        letter03,
        letter04,
        letter05,
      ]
    );


  const odysseusCenter =
    odysseusBox.x +
    odysseusBox.width /
    2;


  const odysseusShift =
    getSvgCenterX() -
    odysseusCenter;


  /* 오디세이 중앙 */

  const box01 =
    letter01.getBBox();

  const box02 =
    letter02.getBBox();

  const box03 =
    letter03.getBBox();


  const iFinalLeft =
    iBox.x +
    iFinalX;


  const iFinalRight =
    iFinalLeft +
    iBox.width;


  const odysseyStart =
    Math.min(
      box01.x,
      box02.x,
      box03.x,
      iFinalLeft
    );


  const odysseyEnd =
    Math.max(
      box01.x +
        box01.width,

      box02.x +
        box02.width,

      box03.x +
        box03.width,

      iFinalRight
    );


  const odysseyCenter =
    (
      odysseyStart +
      odysseyEnd
    ) / 2;


  const odysseyShift =
    getSvgCenterX() -
    odysseyCenter;


  koreanData = {

    letter04,
    letter05,
    letter06,

    wordGroup,

    iFinalX,
    iFinalY,

    odysseyShift,
    odysseusShift,

  };


  if (
    koreanMode ===
    "odyssey"
  ) {

    showOdysseyInstant();

  }

  else {

    showOdysseusInstant();

  }

}


/* ==================================================
   KR TRANSITION RESTORE
================================================== */

function restoreKoreanTransitions() {

  if (!koreanData) {
    return;
  }


  const {
    letter04,
    letter05,
    letter06,
    wordGroup,
  } =
    koreanData;


  const transition =
    `
      transform 1.6s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 1.45s ease,
      filter 1.45s ease
    `;


  letter04.style.transition =
    transition;

  letter05.style.transition =
    transition;

  letter06.style.transition =
    transition;


  wordGroup.style.transition =
    "transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)";

}


/* ==================================================
   KR ODYSSEY INSTANT
================================================== */

function showOdysseyInstant() {

  if (!koreanData) {
    return;
  }


  const {

    letter04,
    letter05,
    letter06,

    wordGroup,

    iFinalX,
    iFinalY,

    odysseyShift,

  } =
    koreanData;


  letter04.style.transition =
    "none";

  letter05.style.transition =
    "none";

  letter06.style.transition =
    "none";

  wordGroup.style.transition =
    "none";


  letter04.style.opacity =
    "0";

  letter04.style.filter =
    "blur(10px)";

  letter04.style.transform =
    "translateY(-150px) scale(0.97)";


  letter05.style.opacity =
    "0";

  letter05.style.filter =
    "blur(10px)";

  letter05.style.transform =
    "translateY(-170px) scale(0.97)";


  letter06.style.visibility =
    "visible";

  letter06.style.opacity =
    "1";

  letter06.style.filter =
    "blur(0px)";

  letter06.style.transform =
    `translate(
      ${iFinalX}px,
      ${iFinalY}px
    )`;


  wordGroup.style.transform =
    `translateX(
      ${odysseyShift}px
    )`;


  krSwitch.classList.remove(
    "is-on"
  );


  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          restoreKoreanTransitions();

        }
      );

    }
  );

}


/* ==================================================
   KR ODYSSEUS INSTANT
================================================== */

function showOdysseusInstant() {

  if (!koreanData) {
    return;
  }


  const {

    letter04,
    letter05,
    letter06,

    wordGroup,

    iFinalX,
    iFinalY,

    odysseusShift,

  } =
    koreanData;


  letter04.style.transition =
    "none";

  letter05.style.transition =
    "none";

  letter06.style.transition =
    "none";

  wordGroup.style.transition =
    "none";


  letter04.style.opacity =
    "1";

  letter04.style.filter =
    "blur(0px)";

  letter04.style.transform =
    "translateY(0px) scale(1)";


  letter05.style.opacity =
    "1";

  letter05.style.filter =
    "blur(0px)";

  letter05.style.transform =
    "translateY(0px) scale(1)";


  letter06.style.opacity =
    "0";

  letter06.style.filter =
    "blur(8px)";

  letter06.style.transform =
    `translate(
      ${iFinalX}px,
      ${iFinalY + 150}px
    )`;


  wordGroup.style.transform =
    `translateX(
      ${odysseusShift}px
    )`;


  krSwitch.classList.add(
    "is-on"
  );


  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          restoreKoreanTransitions();

        }
      );

    }
  );

}


/* ==================================================
   KR TOGGLE
================================================== */

function toggleKorean() {

  if (
    koreanAnimating ||
    languageChanging ||
    !koreanData
  ) {
    return;
  }


  koreanAnimating =
    true;


  const {

    letter04,
    letter05,
    letter06,

    wordGroup,

    iFinalX,
    iFinalY,

    odysseyShift,
    odysseusShift,

  } =
    koreanData;


  if (
    koreanMode ===
    "odyssey"
  ) {

    koreanMode =
      "odysseus";


    krSwitch.classList.add(
      "is-on"
    );


    wordGroup.style.transform =
      `translateX(
        ${odysseusShift}px
      )`;


    letter06.style.transform =
      `translate(
        ${iFinalX}px,
        ${iFinalY + 150}px
      )`;

    letter06.style.opacity =
      "0";

    letter06.style.filter =
      "blur(8px)";


    setTimeout(
      () => {

        letter04.style.transform =
          "translateY(0px) scale(1)";

        letter04.style.opacity =
          "1";

        letter04.style.filter =
          "blur(0px)";

      },
      220
    );


    setTimeout(
      () => {

        letter05.style.transform =
          "translateY(0px) scale(1)";

        letter05.style.opacity =
          "1";

        letter05.style.filter =
          "blur(0px)";

      },
      320
    );

  }

  else {

    koreanMode =
      "odyssey";


    krSwitch.classList.remove(
      "is-on"
    );


    wordGroup.style.transform =
      `translateX(
        ${odysseyShift}px
      )`;


    letter04.style.transform =
      "translateY(-150px) scale(0.97)";

    letter04.style.opacity =
      "0";

    letter04.style.filter =
      "blur(10px)";


    setTimeout(
      () => {

        letter05.style.transform =
          "translateY(-170px) scale(0.97)";

        letter05.style.opacity =
          "0";

        letter05.style.filter =
          "blur(10px)";

      },
      90
    );


    setTimeout(
      () => {

        letter06.style.transform =
          `translate(
            ${iFinalX}px,
            ${iFinalY}px
          )`;

        letter06.style.opacity =
          "1";

        letter06.style.filter =
          "blur(0px)";

      },
      310
    );

  }


  setTimeout(
    () => {

      koreanAnimating =
        false;

    },
    1750
  );

}


/* ==================================================
   EN LOAD
================================================== */

async function loadEnglish(
  isLanguageSwitch = false
) {

  if (
    !isLanguageSwitch
  ) {

    container.classList.add(
      "is-loading"
    );

  }


  try {

    const [
      odResponse,
      obResponse,
    ] =
      await Promise.all(
        [
          fetch(
            "./img/en_od.svg"
          ),

          fetch(
            "./img/en_ob.svg"
          ),
        ]
      );


    if (
      !odResponse.ok ||
      !obResponse.ok
    ) {

      throw new Error(
        "영문 SVG를 불러오지 못했습니다."
      );

    }


    const [
      odText,
      obText,
    ] =
      await Promise.all(
        [
          odResponse.text(),
          obResponse.text(),
        ]
      );


    container.innerHTML =
      odText;


    const svg =
      container.querySelector(
        "svg"
      );


    if (!svg) {

      throw new Error(
        "ODYSSEUS SVG를 찾지 못했습니다."
      );

    }


    const parser =
      new DOMParser();


    const obDocument =
      parser.parseFromString(
        obText,
        "image/svg+xml"
      );


    const obSvg =
      obDocument.querySelector(
        "svg"
      );


    const O =
      svg.querySelector(
        "#letter_O"
      );

    const D =
      svg.querySelector(
        "#letter_D"
      );

    const Y =
      svg.querySelector(
        "#letter_Y"
      );

    const S =
      svg.querySelector(
        "#letter_S"
      );

    const S2 =
      svg.querySelector(
        "#letter_S2"
      );

    const E =
      svg.querySelector(
        "#letter_E"
      );

    const U =
      svg.querySelector(
        "#letter_U"
      );

    const S1 =
      svg.querySelector(
        "#letter_S1"
      );


    const odLetters = [
      O,
      D,
      Y,
      S,
      S2,
      E,
      U,
      S1,
    ];


    if (
      odLetters.some(
        (letter) =>
          !letter
      )
    ) {

      throw new Error(
        "ODYSSEUS의 letter ID를 확인해주세요."
      );

    }


    odLetters.forEach(
      (letter) => {

        letter.classList.add(
          "en-letter"
        );

      }
    );


    const obB =
      obSvg.querySelector(
        "#letter_B"
      );


    if (!obB) {

      throw new Error(
        "OBEY의 letter_B를 찾지 못했습니다."
      );

    }


    const B =
      document.importNode(
        obB,
        true
      );


    B.id =
      "letter_B_live";


    B.classList.add(
      "en-letter"
    );


    svg.appendChild(
      B
    );


    const SVG_NS =
      "http://www.w3.org/2000/svg";


    const englishWordGroup =
      document.createElementNS(
        SVG_NS,
        "g"
      );


    englishWordGroup.id =
      "englishWordGroup";


    [
      O,
      D,
      Y,
      S,
      S2,
      E,
      U,
      S1,
      B,
    ].forEach(
      (letter) => {

        englishWordGroup.appendChild(
          letter
        );

      }
    );


    svg.appendChild(
      englishWordGroup
    );


    const targetBoxes =
      getObeyBoxes(
        obText
      );


    const odViewBox =
      svg.viewBox.baseVal;


    const obViewBox =
      obSvg.viewBox.baseVal;


    const obeyOffsetX =
      (
        odViewBox.x +
        odViewBox.width /
        2
      ) -
      (
        obViewBox.x +
        obViewBox.width /
        2
      );


    const OBox =
      O.getBBox();

    const EBox =
      E.getBBox();

    const YBox =
      Y.getBBox();

    const BBox =
      B.getBBox();


    const targetOX =
      obeyOffsetX +
      targetBoxes.O.x -
      OBox.x;


    const targetOY =
      targetBoxes.O.y -
      OBox.y;


    const targetEX =
      obeyOffsetX +
      targetBoxes.E.x -
      EBox.x;


    const targetEY =
      targetBoxes.E.y -
      EBox.y;


    const targetYX =
      obeyOffsetX +
      targetBoxes.Y.x -
      YBox.x;


    const targetYY =
      targetBoxes.Y.y -
      YBox.y;


    const targetBX =
      obeyOffsetX +
      targetBoxes.B.x -
      BBox.x;


    const targetBY =
      targetBoxes.B.y -
      BBox.y;


    englishData = {

      O,
      D,
      Y,
      S,
      S2,
      E,
      U,
      S1,
      B,

      englishWordGroup,

      targetOX,
      targetOY,

      targetEX,
      targetEY,

      targetYX,
      targetYY,

      targetBX,
      targetBY,

    };


    showEnglishOdysseusInstant();


    if (
      !isLanguageSwitch
    ) {

      requestAnimationFrame(
        () => {

          requestAnimationFrame(
            () => {

              container.classList.remove(
                "is-loading"
              );

            }
          );

        }
      );

    }

  }

  catch (error) {

    console.error(
      error
    );


    container.classList.remove(
      "is-loading"
    );

  }

}


/* ==================================================
   OBEY BOXES
================================================== */

function getObeyBoxes(
  svgText
) {

  const holder =
    document.createElement(
      "div"
    );


  holder.style.position =
    "absolute";

  holder.style.left =
    "-10000px";

  holder.style.top =
    "-10000px";

  holder.style.visibility =
    "hidden";

  holder.style.pointerEvents =
    "none";

  holder.innerHTML =
    svgText;


  document.body.appendChild(
    holder
  );


  const svg =
    holder.querySelector(
      "svg"
    );


  const O =
    svg.querySelector(
      "#letter_O"
    );

  const B =
    svg.querySelector(
      "#letter_B"
    );

  const E =
    svg.querySelector(
      "#letter_E"
    );

  const Y =
    svg.querySelector(
      "#letter_Y"
    );


  if (
    !O ||
    !B ||
    !E ||
    !Y
  ) {

    holder.remove();


    throw new Error(
      "OBEY의 O/B/E/Y를 찾지 못했습니다."
    );

  }


  function copyBox(
    element
  ) {

    const box =
      element.getBBox();


    return {

      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,

    };

  }


  const result = {

    O: copyBox(O),
    B: copyBox(B),
    E: copyBox(E),
    Y: copyBox(Y),

  };


  holder.remove();


  return result;

}


/* ==================================================
   EN TRANSITION RESTORE
================================================== */

function restoreEnglishTransitions() {

  if (!englishData) {
    return;
  }


  const transition =
    `
      transform 1.6s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 1.45s ease,
      filter 1.45s ease
    `;


  const {

    O,
    D,
    Y,
    S,
    S2,
    E,
    U,
    S1,
    B,

  } =
    englishData;


  [
    O,
    D,
    Y,
    S,
    S2,
    E,
    U,
    S1,
    B,
  ].forEach(
    (letter) => {

      letter.style.transition =
        transition;

    }
  );

}


/* ==================================================
   EN INITIAL
================================================== */

function showEnglishOdysseusInstant() {

  if (!englishData) {
    return;
  }


  const {

    O,
    D,
    Y,
    S,
    S2,
    E,
    U,
    S1,
    B,

    targetBX,
    targetBY,

  } =
    englishData;


  const all = [
    O,
    D,
    Y,
    S,
    S2,
    E,
    U,
    S1,
    B,
  ];


  all.forEach(
    (letter) => {

      letter.style.transition =
        "none";

    }
  );


  [
    O,
    D,
    Y,
    S,
    S2,
    E,
    U,
    S1,
  ].forEach(
    (letter) => {

      letter.style.opacity =
        "1";

      letter.style.filter =
        "blur(0px)";

      letter.style.transform =
        "translate(0px, 0px)";

    }
  );


  B.style.opacity =
    "0";

  B.style.filter =
    "blur(10px)";

  B.style.transform =
    `translate(
      ${targetBX}px,
      ${targetBY + 120}px
    )`;


  englishMode =
    "odysseus";


  enSwitch.classList.remove(
    "is-on"
  );


  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          restoreEnglishTransitions();

        }
      );

    }
  );

}


/* ==================================================
   EN TOGGLE
================================================== */

function toggleEnglish() {

  if (
    englishAnimating ||
    languageChanging ||
    !englishData
  ) {
    return;
  }


  englishAnimating =
    true;


  const {

    O,
    D,
    Y,
    S,
    S2,
    E,
    U,
    S1,
    B,

    targetOX,
    targetOY,

    targetEX,
    targetEY,

    targetYX,
    targetYY,

    targetBX,
    targetBY,

  } =
    englishData;


  if (
    englishMode ===
    "odysseus"
  ) {

    englishMode =
      "obey";


    enSwitch.classList.add(
      "is-on"
    );


    O.style.transform =
      `translate(
        ${targetOX}px,
        ${targetOY}px
      )`;


    E.style.transform =
      `translate(
        ${targetEX}px,
        ${targetEY}px
      )`;


    Y.style.transform =
      `translate(
        ${targetYX}px,
        ${targetYY}px
      )`;


    D.style.transform =
      "translateY(-140px)";

    D.style.opacity =
      "0";

    D.style.filter =
      "blur(10px)";


    S.style.transform =
      "translateY(150px)";

    S.style.opacity =
      "0";

    S.style.filter =
      "blur(10px)";


    setTimeout(
      () => {

        S2.style.transform =
          "translateY(-150px)";

        S2.style.opacity =
          "0";

        S2.style.filter =
          "blur(10px)";

      },
      70
    );


    setTimeout(
      () => {

        U.style.transform =
          "translateY(160px)";

        U.style.opacity =
          "0";

        U.style.filter =
          "blur(10px)";

      },
      130
    );


    setTimeout(
      () => {

        S1.style.transform =
          "translateY(-160px)";

        S1.style.opacity =
          "0";

        S1.style.filter =
          "blur(10px)";

      },
      190
    );


    setTimeout(
      () => {

        B.style.transform =
          `translate(
            ${targetBX}px,
            ${targetBY}px
          )`;

        B.style.opacity =
          "1";

        B.style.filter =
          "blur(0px)";

      },
      300
    );

  }

  else {

    englishMode =
      "odysseus";


    enSwitch.classList.remove(
      "is-on"
    );


    B.style.transform =
      `translate(
        ${targetBX}px,
        ${targetBY + 120}px
      )`;

    B.style.opacity =
      "0";

    B.style.filter =
      "blur(10px)";


    O.style.transform =
      "translate(0px, 0px)";

    E.style.transform =
      "translate(0px, 0px)";

    Y.style.transform =
      "translate(0px, 0px)";


    setTimeout(
      () => {

        D.style.transform =
          "translateY(0px)";

        D.style.opacity =
          "1";

        D.style.filter =
          "blur(0px)";

      },
      180
    );


    setTimeout(
      () => {

        S.style.transform =
          "translateY(0px)";

        S.style.opacity =
          "1";

        S.style.filter =
          "blur(0px)";

      },
      230
    );


    setTimeout(
      () => {

        S2.style.transform =
          "translateY(0px)";

        S2.style.opacity =
          "1";

        S2.style.filter =
          "blur(0px)";

      },
      280
    );


    setTimeout(
      () => {

        U.style.transform =
          "translateY(0px)";

        U.style.opacity =
          "1";

        U.style.filter =
          "blur(0px)";

      },
      330
    );


    setTimeout(
      () => {

        S1.style.transform =
          "translateY(0px)";

        S1.style.opacity =
          "1";

        S1.style.filter =
          "blur(0px)";

      },
      380
    );

  }


  setTimeout(
    () => {

      englishAnimating =
        false;

    },
    1750
  );

}


/* ==================================================
   INITIAL
================================================== */

updateLanguageUI();

loadKorean();