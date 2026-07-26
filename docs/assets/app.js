(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const storedTheme = localStorage.getItem("guide-theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (systemDark ? "dark" : "light");

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (themeButton) {
      themeButton.textContent = theme === "dark" ? "☀" : "◐";
      themeButton.setAttribute(
        "aria-label",
        theme === "dark" ? "밝은 테마로 전환" : "어두운 테마로 전환",
      );
    }
  };

  applyTheme(initialTheme);

  themeButton?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("guide-theme", next);
    applyTheme(next);
  });

  document.querySelector("[data-print]")?.addEventListener("click", () => {
    window.print();
  });

  const copyText = async (value) => {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Copy command was rejected");
  };

  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const block = button.closest(".code-block");
      const code = block?.querySelector("pre code")?.textContent || "";
      try {
        await copyText(code);
        const previous = button.textContent;
        button.textContent = "복사됨";
        button.classList.add("copied");
        window.setTimeout(() => {
          button.textContent = previous;
          button.classList.remove("copied");
        }, 1400);
      } catch {
        button.textContent = "복사 실패";
      }
    });
  });

  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll("[role='tab']")];
    const panels = [...tabs.querySelectorAll("[role='tabpanel']")];

    const activate = (button) => {
      const target = button.getAttribute("aria-controls");
      buttons.forEach((item) => {
        const selected = item === button;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.id !== target;
      });
    };

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => activate(button));
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const next = buttons[(index + delta + buttons.length) % buttons.length];
        activate(next);
        next.focus();
      });
    });
  });

  const tocLinks = [...document.querySelectorAll(".toc a")];
  const sections = tocLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const mobileToc = document.querySelector("[data-mobile-toc]");

  const updateActive = (id) => {
    tocLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    if (mobileToc && mobileToc.value !== `#${id}`) {
      mobileToc.value = `#${id}`;
    }
  };

  if ("IntersectionObserver" in window && sections.length) {
    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry);
          else visible.delete(entry.target.id);
        });
        const current = [...visible.values()].sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];
        if (current) updateActive(current.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.1] },
    );
    sections.forEach((section) => observer.observe(section));
  }

  mobileToc?.addEventListener("change", (event) => {
    const target = document.querySelector(event.target.value);
    target?.scrollIntoView({ behavior: "smooth" });
  });

  const progress = document.querySelector(".reading-progress");
  const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const checklistKey = "ai-governance-onboarding-checklist-v1";
  const savedChecklist = JSON.parse(localStorage.getItem(checklistKey) || "{}");
  document.querySelectorAll("[data-check-id]").forEach((label) => {
    const id = label.dataset.checkId;
    const input = label.querySelector("input[type='checkbox']");
    if (!input || !id) return;
    input.checked = Boolean(savedChecklist[id]);
    label.classList.toggle("done", input.checked);
    input.addEventListener("change", () => {
      savedChecklist[id] = input.checked;
      label.classList.toggle("done", input.checked);
      localStorage.setItem(checklistKey, JSON.stringify(savedChecklist));
    });
  });

  document.querySelector("[data-reset-checklist]")?.addEventListener("click", () => {
    localStorage.removeItem(checklistKey);
    document.querySelectorAll("[data-check-id]").forEach((label) => {
      const input = label.querySelector("input[type='checkbox']");
      if (input) input.checked = false;
      label.classList.remove("done");
    });
  });

  const instructionButtons = [...document.querySelectorAll("[data-instruction-source]")];
  const readerTitle = document.querySelector("[data-reader-title]");
  const readerContent = document.querySelector("[data-reader-content]");
  const readerStatus = document.querySelector(".reader-status");
  const readerError = document.querySelector("[data-reader-error]");
  const readerOpen = document.querySelector("[data-reader-open]");
  const readerDownload = document.querySelector("[data-reader-download]");
  const readerCopy = document.querySelector("[data-reader-copy]");
  let currentInstruction = "";
  let activeRequest = 0;

  const loadInstruction = async (button) => {
    const source = button.dataset.instructionSource;
    const label = button.dataset.instructionLabel || source;
    if (!source || !readerContent) return;

    instructionButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    if (readerTitle) readerTitle.textContent = label;
    if (readerStatus) readerStatus.textContent = "LOADING";
    if (readerError) readerError.hidden = true;
    readerContent.textContent = "지침 파일을 불러오는 중입니다…";
    if (readerOpen) readerOpen.href = source;
    if (readerDownload) {
      readerDownload.href = source;
      readerDownload.setAttribute("download", label.split("/").pop() || "instructions.md");
    }

    const requestId = ++activeRequest;
    try {
      const response = await fetch(source, { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      if (requestId !== activeRequest) return;
      currentInstruction = text;
      readerContent.textContent = text;
      if (readerStatus) {
        const lineCount = text.split(/\r?\n/).length;
        readerStatus.textContent = `LOADED · ${lineCount} LINES`;
      }
    } catch {
      if (requestId !== activeRequest) return;
      currentInstruction = "";
      readerContent.textContent = "";
      if (readerStatus) readerStatus.textContent = "LOAD FAILED";
      if (readerError) readerError.hidden = false;
    }
  };

  instructionButtons.forEach((button) => {
    button.addEventListener("click", () => loadInstruction(button));
  });

  readerCopy?.addEventListener("click", async () => {
    if (!currentInstruction) return;
    const previous = readerCopy.textContent;
    try {
      await copyText(currentInstruction);
      readerCopy.textContent = "복사됨";
    } catch {
      readerCopy.textContent = "복사 실패";
    }
    window.setTimeout(() => {
      readerCopy.textContent = previous;
    }, 1400);
  });

  const initialInstruction = instructionButtons.find((button) =>
    button.classList.contains("active"),
  );
  if (initialInstruction) loadInstruction(initialInstruction);
})();
