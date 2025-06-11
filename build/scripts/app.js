document.addEventListener("DOMContentLoaded", function () {
  Lenguages();
  initBarra();
  circle();
});

function Lenguages() {
  const LenguaguesBtn = document.querySelector(".Lenguages");
  const LenguagueES = document.querySelector(".languageES");
  const LenguagueEN = document.querySelector(".languageEN");

  if (!LenguaguesBtn || !LenguagueES || !LenguagueEN) return;

  let currentLang = "es";
  applyTranslation(currentLang);

  LenguaguesBtn.addEventListener("click", () => {
    if (LenguagueES.classList.contains("lenguageSelected")) {
      LenguagueES.classList.remove("lenguageSelected");
      LenguagueEN.classList.add("lenguageSelected");
      LenguaguesBtn.classList.add("lenguageActiveEN");
      currentLang = "en";
    } else {
      LenguagueEN.classList.remove("lenguageSelected");
      LenguagueES.classList.add("lenguageSelected");
      LenguaguesBtn.classList.remove("lenguageActiveEN");
      currentLang = "es";
    }
    applyTranslation(currentLang);
  });
}

function applyTranslation(lang) {
  const t = translations[lang];

  if (document.getElementById("title"))
    document.getElementById("title").textContent = t.title;

  if (document.getElementById("projects"))
    document.getElementById("projects").textContent = t.projects;

  if (document.getElementById("hi"))
    document.getElementById("hi").innerHTML = t.hi;

  if (document.getElementById("developer"))
    document.getElementById("developer").textContent = t.developer;

  if (document.getElementById("hireMe"))
    document.getElementById("hireMe").textContent = t.hireMe;

  if (document.getElementById("skills"))
    document.getElementById("skills").textContent = t.skills;

  if (document.getElementById("paragraph1"))
    document.getElementById("paragraph1").textContent = t.paragraph1;

  if (document.getElementById("paragraph2"))
    document.getElementById("paragraph2").textContent = t.paragraph2;

  if (document.getElementById("downloadCV"))
    document.getElementById("downloadCV").textContent = t.downloadCV;

  if (document.getElementById("state"))
    document.getElementById("state").textContent = t.state;

  if (document.getElementById("letsChat"))
    document.getElementById("letsChat").textContent = t.letsChat;

  if (document.querySelector(".centrar-texto"))
    document.querySelector(".centrar-texto").textContent = t.projectsTitle;
  if (document.getElementById("projectsTitle"))
    document.getElementById("projectsTitle").textContent = t.projectsTitle;

  if (document.getElementById("project1Title"))
    document.getElementById("project1Title").textContent = t.project1Title;
  if (document.getElementById("project1Desc"))
    document.getElementById("project1Desc").textContent = t.project1Desc;

  if (document.getElementById("project2Title"))
    document.getElementById("project2Title").textContent = t.project2Title;
  if (document.getElementById("project2Desc"))
    document.getElementById("project2Desc").textContent = t.project2Desc;

  if (document.getElementById("project3Title"))
    document.getElementById("project3Title").textContent = t.project3Title;
  if (document.getElementById("project3Desc"))
    document.getElementById("project3Desc").textContent = t.project3Desc;
}

function initBarra() {
  const Barra = document.querySelector(".barra");
  const MenuDesplegable = document.querySelector(".menu-desplegable");

  Barra.addEventListener("click", () => {
    MenuDesplegable.classList.toggle("active");
  });
}

function circle() {
  const bigCircle = document.querySelector(".big-circle");
  const smallCircle = document.querySelector(".small-circle");

  if (!bigCircle || !smallCircle) return;

  const radius = 100;

  document.addEventListener("mousemove", (e) => {
    const rect = bigCircle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    smallCircle.style.transform = `translate(${x}px, ${y}px)`;

    const wobbleStrength = 5;
    const wobbleX = Math.cos(angle) * wobbleStrength;
    const wobbleY = Math.sin(angle) * wobbleStrength;

    bigCircle.style.transform = `translate(${wobbleX}px, ${wobbleY}px)`;
  });
}
