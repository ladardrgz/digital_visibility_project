const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const navToggle = document.querySelector("[data-nav-toggle]");
const visibilityLab = document.querySelector("[data-visibility-lab]");
const visibilityBoard = document.querySelector("[data-visibility-board]");
const visibilityButtons = document.querySelectorAll("[data-visibility-state]");
const solutionTrack = document.querySelector(".solution-track");
const whatsappPlanButtons = document.querySelectorAll("[data-whatsapp-message]");
const whatsappForm = document.querySelector("[data-whatsapp-form]");
const formStatus = document.querySelector("[data-form-status]");
const demoOpen = document.querySelector("[data-demo-open]");
const demoModal = document.querySelector("[data-demo-modal]");
const demoConfirm = document.querySelector("[data-demo-confirm]");
const demoCloseButtons = document.querySelectorAll("[data-demo-close]");
const githubOpen = document.querySelector("[data-github-open]");
const githubPop = document.querySelector("[data-github-pop]");
const githubCloseButtons = document.querySelectorAll("[data-github-close]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const themeColorMeta = document.querySelector("meta[name='theme-color']");
const themeStorageKey = "lada-color-scheme";

const getStoredTheme = () => {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
  } catch {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    return null;
  }
};

const updateThemeToggle = (theme) => {
  if (!themeToggle) return;

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  themeToggle.title = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
};

const applyColorScheme = (theme) => {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.colorScheme = selectedTheme;
  themeColorMeta?.setAttribute("content", selectedTheme === "dark" ? "#071314" : "#27454D");
  updateThemeToggle(selectedTheme);
};

applyColorScheme(getStoredTheme() || (colorSchemeQuery.matches ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.colorScheme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  setStoredTheme(nextTheme);
  applyColorScheme(nextTheme);
});

colorSchemeQuery.addEventListener?.("change", (event) => {
  if (!getStoredTheme()) {
    applyColorScheme(event.matches ? "dark" : "light");
  }
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 10);
};

const whatsappNumber = "543705176505";
const textLimits = {
  nombre: 60,
  negocio: 80,
  necesidad: 320,
  modalidad: 40
};

const cleanText = (value, maxLength) => (
  value
    .toString()
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
);

const openWhatsapp = (message) => {
  const cleanMessage = cleanText(message, 900);
  if (!cleanMessage) return;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(cleanMessage)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};

const setFormStatus = (message, type = "error") => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.toggle("is-success", type === "success");
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.classList.toggle("is-active", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.body.classList.toggle("is-locked", Boolean(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.classList.remove("is-active");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
  });
});

const sectionsById = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sectionsById.length) {
  const navObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) return;

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${visibleEntry.target.id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, {
    rootMargin: "-42% 0px -46% 0px",
    threshold: [0.2, 0.45, 0.7]
  });

  sectionsById.forEach((section) => navObserver.observe(section));
}

const visibilityCopy = {
  unclear: {
    query: "gomería cerca de mi ubicación",
    resultTitle: "Perfil sin horarios actualizados",
    resultDetail: "Teléfono viejo · fotos de hace 3 años · sin web",
    resultTitleAlt: "Publicación perdida en Facebook",
    resultDetailAlt: "Comentarios sin responder · dirección incompleta",
    mapTitle: "Ubicación desactualizada",
    mapDetail: "Horario dudoso · sin referencia clara"
  },
  clear: {
    query: "gomería abierta en Formosa",
    resultTitle: "Gomería local · sitio oficial",
    resultDetail: "Horarios claros · WhatsApp · ubicación exacta",
    resultTitleAlt: "Servicios, precios y contacto",
    resultDetailAlt: "Información ordenada en una sola página",
    mapTitle: "Ubicación verificada",
    mapDetail: "Horario actualizado · contacto directo"
  }
};

const setVisibilityState = (state) => {
  const isClear = state === "clear";
  const copy = visibilityCopy[state];

  visibilityBoard?.classList.toggle("is-clear", isClear);
  visibilityButtons.forEach((button) => {
    const isActive = button.dataset.visibilityState === state;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  Object.entries({
    "[data-search-query]": copy.query,
    "[data-result-title]": copy.resultTitle,
    "[data-result-detail]": copy.resultDetail,
    "[data-result-title-alt]": copy.resultTitleAlt,
    "[data-result-detail-alt]": copy.resultDetailAlt,
    "[data-map-title]": copy.mapTitle,
    "[data-map-detail]": copy.mapDetail
  }).forEach(([selector, value]) => {
    const element = visibilityLab?.querySelector(selector);
    if (element) element.textContent = value;
  });
};

let visibilityState = "unclear";
let visibilityTimer;

const startVisibilityLoop = () => {
  window.clearInterval(visibilityTimer);
  visibilityTimer = window.setInterval(() => {
    visibilityState = visibilityState === "unclear" ? "clear" : "unclear";
    setVisibilityState(visibilityState);
  }, 4200);
};

if (visibilityLab && visibilityBoard && visibilityButtons.length) {
  setVisibilityState(visibilityState);
  startVisibilityLoop();

  visibilityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      visibilityState = button.dataset.visibilityState;
      setVisibilityState(visibilityState);
      startVisibilityLoop();
    });
  });
}

if (solutionTrack) {
  const originalCards = [...solutionTrack.querySelectorAll(".solution-card:not([aria-hidden='true'])")];
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    solutionTrack.appendChild(clone);
  });
}

whatsappPlanButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openWhatsapp(button.dataset.whatsappMessage || "");
  });
});

const validateWhatsappForm = () => {
  if (!whatsappForm) return null;

  const fields = {
    nombre: whatsappForm.elements.nombre,
    negocio: whatsappForm.elements.negocio,
    necesidad: whatsappForm.elements.necesidad,
    modalidad: whatsappForm.elements.modalidad
  };

  Object.values(fields).forEach((field) => {
    field?.classList.remove("is-invalid");
    field?.removeAttribute("aria-invalid");
  });

  const values = {
    nombre: cleanText(fields.nombre?.value || "", textLimits.nombre),
    negocio: cleanText(fields.negocio?.value || "", textLimits.negocio),
    necesidad: cleanText(fields.necesidad?.value || "", textLimits.necesidad),
    modalidad: cleanText(fields.modalidad?.value || "", textLimits.modalidad)
  };

  const missingField = Object.entries(values).find(([, value]) => !value);

  if (missingField) {
    const [fieldName] = missingField;
    fields[fieldName]?.classList.add("is-invalid");
    fields[fieldName]?.setAttribute("aria-invalid", "true");
    fields[fieldName]?.focus();
    setFormStatus("Completá los campos requeridos para abrir WhatsApp.");
    return null;
  }

  return values;
};

whatsappForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = validateWhatsappForm();
  if (!values) return;

  const message = [
    "Hola, quiero coordinar una reunión con el equipo para hablar sobre una solución digital.",
    `Mi nombre es ${values.nombre}.`,
    `Mi negocio o rubro es ${values.negocio}.`,
    `Necesito resolver ${values.necesidad}.`,
    `Prefiero coordinar por ${values.modalidad}.`
  ].join("\n");

  setFormStatus("Perfecto, se va a abrir WhatsApp con el mensaje listo.", "success");
  openWhatsapp(message);
});

whatsappForm?.addEventListener("input", (event) => {
  if (event.target instanceof HTMLElement) {
    event.target.classList.remove("is-invalid");
    event.target.removeAttribute("aria-invalid");
  }
  setFormStatus("");
});

whatsappForm?.addEventListener("change", (event) => {
  if (event.target instanceof HTMLElement) {
    event.target.classList.remove("is-invalid");
    event.target.removeAttribute("aria-invalid");
  }
  setFormStatus("");
});

const openDemoModal = () => {
  if (!demoModal) return;
  demoModal.hidden = false;
  document.body.classList.add("is-locked");
  demoConfirm?.focus();
};

const closeDemoModal = () => {
  if (!demoModal) return;
  demoModal.hidden = true;
  document.body.classList.remove("is-locked");
  demoOpen?.focus();
};

const showDemoApp = () => {
  closeDemoModal();
  document.body.classList.add("demo-mode");
  window.setTimeout(() => {
    window.location.href = "demo.html";
  }, 420);
};

demoOpen?.addEventListener("click", openDemoModal);
demoConfirm?.addEventListener("click", showDemoApp);

demoCloseButtons.forEach((button) => {
  button.addEventListener("click", closeDemoModal);
});

demoModal?.addEventListener("click", (event) => {
  if (event.target === demoModal) closeDemoModal();
});

const openGithubPop = () => {
  if (!githubPop) return;
  githubPop.hidden = false;
  document.body.classList.add("is-locked");
};

const closeGithubPop = () => {
  if (!githubPop) return;
  githubPop.hidden = true;
  document.body.classList.remove("is-locked");
  githubOpen?.focus();
};

githubOpen?.addEventListener("click", openGithubPop);

githubCloseButtons.forEach((button) => {
  button.addEventListener("click", closeGithubPop);
});

githubPop?.addEventListener("click", (event) => {
  if (event.target === githubPop) closeGithubPop();
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (demoModal && !demoModal.hidden) closeDemoModal();
  if (githubPop && !githubPop.hidden) closeGithubPop();
});
