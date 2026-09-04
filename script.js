/* ==================================================
   ELEMENTS
================================================== */

const container =
  document.querySelector("#svg-container");

const krLabel =
  document.querySelector("#kr-label");

const enLabel =
  document.querySelector("#en-label");

const krSwitch =
  document.querySelector("#kr-switch");

const enSwitch =
  document.querySelector("#en-switch");

const musicSwitch =
  document.querySelector("#music-switch");

const music =
  document.querySelector("#music");


/* ==================================================
   BACKGROUND VIDEO
================================================== */

const forwardVideo =
  document.querySelector("#bg-video-forward");

const reverseVideo =
  document.querySelector("#bg-video-reverse");


function playForwardVideo() {

  reverseVideo.pause();
  reverseVideo.currentTime = 0;
  reverseVideo.classList.remove("active");

  forwardVideo.currentTime = 0;
  forwardVideo.classList.add("active");

  forwardVideo
    .play()
    .catch((error) => {

      console.error(
        "정방향 배경 영상 재생 실패:",
        error
      );

    });

}


function playReverseVideo() {

  forwardVideo.pause();
  forwardVideo.currentTime = 0;
  forwardVideo.classList.remove("active");

  reverseVideo.currentTime = 0;
  reverseVideo.classList.add("active");

  reverseVideo
    .play()
    .catch((error) => {

      console.error(
        "리버스 배경 영상 재생 실패:",
        error
      );

    });

}


forwardVideo.addEventListener(
  "ended",
  playReverseVideo
);

reverseVideo.addEventListener(
  "ended",
  playForwardVideo
);


/* ==================================================
   STATE
================================================== */

let activeLanguage = "kr";

let koreanMode = "odyssey";

let englishMode = "odysseus";

let koreanData = null;

let englishData = null;

let koreanAnimating = false;

let englishAnimating = false;

let languageChanging = false;

let musicOn = false;


/* ==================================================
   UTILS
================================================== */

function wait(ms) {

  return new Promise(
    (resolve) => setTimeout(resolve, ms)
  );

}


const SVG_NS =
  "http://www.w3.org/2000/svg";


/* ==================================================
   SMIL CLEANUP
================================================== */

function removeEnglishAnimations(element) {

  if (!element) {
    return;
  }

  const animations =
    element.querySelectorAll(
      ':scope > [data-en-animation="true"]'
    );

  animations.forEach(
    (animation) => animation.remove()
  );

}


/* ==================================================
   SVG NATIVE TRANSLATE

   CSS transform도 아니고
   requestAnimationFrame도 아님.

   SVG 자체의 animateTransform 사용.
================================================== */

function svgTranslate(
  element,
  fromX,
  fromY,
  toX,
  toY,
  duration = 1600,
  delay = 0
) {

  if (!element) {
    return;
  }


  removeEnglishAnimations(
    element
  );


  /*
    애니메이션 시작 전 기본 좌표
  */

  element.setAttribute(
    "transform",
    `translate(${fromX} ${fromY})`
  );


  const animation =
    document.createElementNS(
      SVG_NS,
      "animateTransform"
    );


  animation.setAttribute(
    "data-en-animation",
    "true"
  );

  animation.setAttribute(
    "attributeName",
    "transform"
  );

  animation.setAttribute(
    "type",
    "translate"
  );

  animation.setAttribute(
    "from",
    `${fromX} ${fromY}`
  );

  animation.setAttribute(
    "to",
    `${toX} ${toY}`
  );

  animation.setAttribute(
    "dur",
    `${duration}ms`
  );

  /*
    직접 beginElement()로 시작하기 위해
    indefinite 사용
  */

  animation.setAttribute(
    "begin",
    "indefinite"
  );

  animation.setAttribute(
    "fill",
    "freeze"
  );

  /*
    기존 cubic-bezier와 비슷한 easing
  */

  animation.setAttribute(
    "calcMode",
    "spline"
  );

  animation.setAttribute(
    "keyTimes",
    "0;1"
  );

  animation.setAttribute(
    "keySplines",
    "0.22 1 0.36 1"
  );


  element.appendChild(
    animation
  );


  setTimeout(
    () => {

      if (!animation.isConnected) {
        return;
      }

      try {

        animation.beginElement();

      }

      catch (error) {

        console.error(
          "SVG 이동 애니메이션 시작 실패:",
          error
        );

      }

    },
    delay
  );


  /*
    애니메이션이 끝난 뒤
    최종 좌표를 실제 transform으로 고정하고
    animateTransform 제거.
  */

  setTimeout(
    () => {

      if (!element.isConnected) {
        return;
      }


      element.setAttribute(
        "transform",
        `translate(${toX} ${toY})`
      );


      if (animation.isConnected) {

        animation.remove();

      }

    },
    delay + duration + 40
  );

}


/* ==================================================
   SVG NATIVE OPACITY
================================================== */

function svgOpacity(
  element,
  from,
  to,
  duration = 1450,
  delay = 0
) {

  if (!element) {
    return;
  }


  /*
    opacity용 기존 애니메이션만 제거
  */

  const oldAnimations =
    element.querySelectorAll(
      ':scope > animate[data-en-opacity="true"]'
    );


  oldAnimations.forEach(
    (animation) => animation.remove()
  );


  element.setAttribute(
    "opacity",
    from
  );


  const animation =
    document.createElementNS(
      SVG_NS,
      "animate"
    );


  animation.setAttribute(
    "data-en-animation",
    "true"
  );

  animation.setAttribute(
    "data-en-opacity",
    "true"
  );

  animation.setAttribute(
    "attributeName",
    "opacity"
  );

  animation.setAttribute(
    "from",
    from
  );

  animation.setAttribute(
    "to",
    to
  );

  animation.setAttribute(
    "dur",
    `${duration}ms`
  );

  animation.setAttribute(
    "begin",
    "indefinite"
  );

  animation.setAttribute(
    "fill",
    "freeze"
  );

  animation.setAttribute(
    "calcMode",
    "spline"
  );

  animation.setAttribute(
    "keyTimes",
    "0;1"
  );

  animation.setAttribute(
    "keySplines",
    "0.22 1 0.36 1"
  );


  element.appendChild(
    animation
  );


  setTimeout(
    () => {

      if (!animation.isConnected) {
        return;
      }

      try {

        animation.beginElement();

      }

      catch (error) {

        console.error(
          "SVG opacity 애니메이션 시작 실패:",
          error
        );

      }

    },
    delay
  );


  setTimeout(
    () => {

      if (!element.isConnected) {
        return;
      }


      element.setAttribute(
        "opacity",
        to
      );


      if (animation.isConnected) {

        animation.remove();

      }

    },
    delay + duration + 40
  );

}


/* ==================================================
   MUSIC
================================================== */

musicSwitch.addEventListener(
  "click",
  async () => {

    if (!musicOn) {

      try {

        await music.play();

        musicOn = true;

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

      musicOn = false;

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
    activeLanguage === "kr"
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
    languageChanging ||
    activeLanguage === language
  ) {
    return;
  }


  languageChanging = true;


  container.classList.add(
    "language-out"
  );


  await wait(560);


  activeLanguage =
    language;


  updateLanguageUI();


  if (
    language === "en"
  ) {

    englishMode =
      "odysseus";

    enSwitch.classList.remove(
      "is-on"
    );

  }


  if (
    language === "kr"
  ) {

    await loadKorean(true);

  }

  else {

    await loadEnglish(true);

  }


  container.classList.remove(
    "language-out"
  );

  container.classList.add(
    "language-in"
  );


  void container.offsetWidth;


  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          container.classList.remove(
            "language-in"
          );

        }
      );

    }
  );


  await wait(1200);


  languageChanging = false;

}


/* ==================================================
   LANGUAGE BUTTONS
================================================== */

krLabel.addEventListener(
  "click",
  () => changeLanguage("kr")
);


enLabel.addEventListener(
  "click",
  () => changeLanguage("en")
);


/* ==================================================
   KR SWITCH
================================================== */

krSwitch.addEventListener(
  "click",
  async () => {

    if (
      activeLanguage !== "kr"
    ) {

      await changeLanguage("kr");
      return;

    }


    toggleKorean();

  }
);


/* ==================================================
   EN SWITCH
================================================== */

enSwitch.addEventListener(
  "click",
  async () => {

    if (
      activeLanguage !== "en"
    ) {

      await changeLanguage("en");
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

  if (!isLanguageSwitch) {

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
      container.querySelector("svg");


    if (!svg) {

      throw new Error(
        "SVG를 찾을 수 없습니다."
      );

    }


    setupKorean(svg);


    if (!isLanguageSwitch) {

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

    console.error(error);

    container.classList.remove(
      "is-loading"
    );

  }

}


/* ==================================================
   KR SETUP
================================================== */

function setupKorean(svg) {

  const letter01 =
    svg.querySelector("#letter01");

  const letter02 =
    svg.querySelector("#letter02");

  const letter03 =
    svg.querySelector("#letter03");

  const letter04 =
    svg.querySelector("#letter04");

  const letter05 =
    svg.querySelector("#letter05");

  const letter06 =
    svg.querySelector("#letter06");


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
      (letter) => !letter
    )
  ) {

    throw new Error(
      "letter01 ~ letter06을 찾지 못했습니다."
    );

  }


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


  const GAP = 25;


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
      viewBox.width / 2
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
            box.x + box.width
          );

      }
    );


    return {
      x: minX,
      width: maxX - minX,
    };

  }


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
    odysseusBox.width / 2;


  const odysseusShift =
    getSvgCenterX() -
    odysseusCenter;


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
      box01.x + box01.width,
      box02.x + box02.width,
      box03.x + box03.width,
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
    koreanMode === "odyssey"
  ) {

    showOdysseyInstant();

  }

  else {

    showOdysseusInstant();

  }

}


/* ==================================================
   KR TRANSITIONS
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
   KR ODYSSEY INITIAL
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
    `translate(${iFinalX}px, ${iFinalY}px)`;


  wordGroup.style.transform =
    `translateX(${odysseyShift}px)`;


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
   KR ODYSSEUS INITIAL
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
    `translate(${iFinalX}px, ${iFinalY + 150}px)`;


  wordGroup.style.transform =
    `translateX(${odysseusShift}px)`;


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
   기존 방식 유지
================================================== */

function toggleKorean() {

  if (
    koreanAnimating ||
    languageChanging ||
    !koreanData
  ) {
    return;
  }


  koreanAnimating = true;


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
    koreanMode === "odyssey"
  ) {

    koreanMode =
      "odysseus";


    krSwitch.classList.add(
      "is-on"
    );


    wordGroup.style.transform =
      `translateX(${odysseusShift}px)`;


    letter06.style.transform =
      `translate(${iFinalX}px, ${iFinalY + 150}px)`;

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
      `translateX(${odysseyShift}px)`;


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
          `translate(${iFinalX}px, ${iFinalY}px)`;

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

      koreanAnimating = false;

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

  if (!isLanguageSwitch) {

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
          fetch("./img/en_od.svg"),
          fetch("./img/en_ob.svg"),
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
      container.querySelector("svg");


    if (!svg) {

      throw new Error(
        "ODYSSEUS SVG를 찾지 못했습니다."
      );

    }


    /*
      확실하게 overflow visible
    */

    svg.setAttribute(
      "overflow",
      "visible"
    );

    svg.style.overflow =
      "visible";


    const parser =
      new DOMParser();


    const obDocument =
      parser.parseFromString(
        obText,
        "image/svg+xml"
      );


    const obSvg =
      obDocument.querySelector("svg");


    const O =
      svg.querySelector("#letter_O");

    const D =
      svg.querySelector("#letter_D");

    const Y =
      svg.querySelector("#letter_Y");

    const S =
      svg.querySelector("#letter_S");

    const S2 =
      svg.querySelector("#letter_S2");

    const E =
      svg.querySelector("#letter_E");

    const U =
      svg.querySelector("#letter_U");

    const S1 =
      svg.querySelector("#letter_S1");


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
        (letter) => !letter
      )
    ) {

      throw new Error(
        "ODYSSEUS의 letter ID를 확인해주세요."
      );

    }


    /*
      기존 CSS transform 흔적을
      완전히 제거
    */

    odLetters.forEach(
      (letter) => {

        letter.classList.add(
          "en-letter"
        );

        letter.style.transform =
          "";

        letter.style.transition =
          "";

        letter.style.filter =
          "";

        letter.removeAttribute(
          "transform"
        );

        letter.setAttribute(
          "opacity",
          "1"
        );

      }
    );


    const obB =
      obSvg.querySelector("#letter_B");


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


    B.style.transform =
      "";

    B.style.transition =
      "";

    B.style.filter =
      "";


    svg.appendChild(B);


    const englishWordGroup =
      document.createElementNS(
        SVG_NS,
        "g"
      );


    englishWordGroup.id =
      "englishWordGroup";


    englishWordGroup.setAttribute(
      "overflow",
      "visible"
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
        odViewBox.width / 2
      )
      -
      (
        obViewBox.x +
        obViewBox.width / 2
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


    if (!isLanguageSwitch) {

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

    console.error(error);

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
    document.createElement("div");


  holder.style.position =
    "fixed";

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
    holder.querySelector("svg");


  const O =
    svg.querySelector("#letter_O");

  const B =
    svg.querySelector("#letter_B");

  const E =
    svg.querySelector("#letter_E");

  const Y =
    svg.querySelector("#letter_Y");


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


  function copyBox(element) {

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


  const letters = [
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


  letters.forEach(
    (letter) => {

      removeEnglishAnimations(
        letter
      );

      letter.style.transform =
        "";

      letter.style.transition =
        "";

      letter.style.filter =
        "";

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

      letter.setAttribute(
        "transform",
        "translate(0 0)"
      );

      letter.setAttribute(
        "opacity",
        "1"
      );

    }
  );


  B.setAttribute(
    "transform",
    `translate(
      ${targetBX}
      ${targetBY + 120}
    )`
  );


  B.setAttribute(
    "opacity",
    "0"
  );


  englishMode =
    "odysseus";


  enSwitch.classList.remove(
    "is-on"
  );

}


/* ==================================================
   EN TOGGLE

   전부 SVG NATIVE SMIL
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


  /* ==================================================
     ODYSSEUS -> OBEY
  ================================================== */

  if (
    englishMode === "odysseus"
  ) {

    englishMode =
      "obey";


    enSwitch.classList.add(
      "is-on"
    );


    /*
      O / E / Y가 OBEY 자리로 이동
    */

    svgTranslate(
      O,
      0,
      0,
      targetOX,
      targetOY,
      1600,
      0
    );


    svgTranslate(
      E,
      0,
      0,
      targetEX,
      targetEY,
      1600,
      0
    );


    svgTranslate(
      Y,
      0,
      0,
      targetYX,
      targetYY,
      1600,
      0
    );


    /*
      사라지는 글자들
    */

    svgTranslate(
      D,
      0,
      0,
      0,
      -140,
      1600,
      0
    );

    svgOpacity(
      D,
      1,
      0,
      1450,
      0
    );


    svgTranslate(
      S,
      0,
      0,
      0,
      150,
      1600,
      0
    );

    svgOpacity(
      S,
      1,
      0,
      1450,
      0
    );


    svgTranslate(
      S2,
      0,
      0,
      0,
      -150,
      1600,
      70
    );

    svgOpacity(
      S2,
      1,
      0,
      1450,
      70
    );


    svgTranslate(
      U,
      0,
      0,
      0,
      160,
      1600,
      130
    );

    svgOpacity(
      U,
      1,
      0,
      1450,
      130
    );


    svgTranslate(
      S1,
      0,
      0,
      0,
      -160,
      1600,
      190
    );

    svgOpacity(
      S1,
      1,
      0,
      1450,
      190
    );


    /*
      B 등장
    */

    svgTranslate(
      B,
      targetBX,
      targetBY + 120,
      targetBX,
      targetBY,
      1600,
      300
    );

    svgOpacity(
      B,
      0,
      1,
      1450,
      300
    );

  }


  /* ==================================================
     OBEY -> ODYSSEUS
  ================================================== */

  else {

    englishMode =
      "odysseus";


    enSwitch.classList.remove(
      "is-on"
    );


    /*
      B 퇴장
    */

    svgTranslate(
      B,
      targetBX,
      targetBY,
      targetBX,
      targetBY + 120,
      1600,
      0
    );

    svgOpacity(
      B,
      1,
      0,
      1450,
      0
    );


    /*
      O / E / Y 원위치
    */

    svgTranslate(
      O,
      targetOX,
      targetOY,
      0,
      0,
      1600,
      0
    );


    svgTranslate(
      E,
      targetEX,
      targetEY,
      0,
      0,
      1600,
      0
    );


    svgTranslate(
      Y,
      targetYX,
      targetYY,
      0,
      0,
      1600,
      0
    );


    /*
      글자들 복귀
    */

    svgTranslate(
      D,
      0,
      -140,
      0,
      0,
      1600,
      180
    );

    svgOpacity(
      D,
      0,
      1,
      1450,
      180
    );


    svgTranslate(
      S,
      0,
      150,
      0,
      0,
      1600,
      230
    );

    svgOpacity(
      S,
      0,
      1,
      1450,
      230
    );


    svgTranslate(
      S2,
      0,
      -150,
      0,
      0,
      1600,
      280
    );

    svgOpacity(
      S2,
      0,
      1,
      1450,
      280
    );


    svgTranslate(
      U,
      0,
      160,
      0,
      0,
      1600,
      330
    );

    svgOpacity(
      U,
      0,
      1,
      1450,
      330
    );


    svgTranslate(
      S1,
      0,
      -160,
      0,
      0,
      1600,
      380
    );

    svgOpacity(
      S1,
      0,
      1,
      1450,
      380
    );

  }


  /*
    가장 늦게 끝나는 애니메이션:
    380ms + 1600ms = 1980ms

    안전하게 2100ms 동안 재클릭 방지.
  */

  setTimeout(
    () => {

      englishAnimating =
        false;

    },
    2100
  );

}


/* ==================================================
   INITIAL
================================================== */

updateLanguageUI();

loadKorean();
