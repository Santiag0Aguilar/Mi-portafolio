"use strict";
import { DATA, COMMANDS, COMMAND_HINTS } from "./data.js";
const out = document.getElementById("output-area"),
  inputEl = document.getElementById("cli-input"),
  inputRow = document.getElementById("input-row"),
  body = document.getElementById("terminal-body"),
  acBox = document.getElementById("ac-box"),
  cursorEl = document.getElementById("cursor");
let history = [],
  histIndex = -1,
  acResults = [],
  acSelected = -1,
  busy = false,
  terminated = false;
function createLine(text = "", cls = "info") {
  const el = document.createElement("div");
  el.className = `line ${cls}`;
  el.innerHTML = text;
  return el;
}
function printLine(text = "", cls = "info", delay = 0) {
  return new Promise((r) => {
    setTimeout(() => {
      out.appendChild(createLine(text, cls));
      scrollBottom();
      r();
    }, delay);
  });
}
function printBlank(delay = 0) {
  return printLine("", "blank", delay);
}
function scrollBottom() {
  body.scrollTop = body.scrollHeight;
}
function syncCursor() {
  const val = inputEl.value,
    pos = inputEl.selectionStart || 0,
    s = document.createElement("span");
  s.style.cssText =
    "visibility:hidden;position:absolute;white-space:pre;font:inherit;font-size:.9rem;letter-spacing:.01em";
  s.textContent = val.slice(0, pos) || "";
  document.body.appendChild(s);
  const w = s.getBoundingClientRect().width;
  document.body.removeChild(s);
  cursorEl.style.left = w + "px";
}
inputEl.addEventListener("input", syncCursor);
inputEl.addEventListener("keyup", syncCursor);
inputEl.addEventListener("click", syncCursor);
function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
async function boot() {
  busy = true;
  const banner = [
    `<span style="color:#58a6ff">  ██████╗ ███████╗██╗   ██╗</span><span style="color:#bc8cff"> ██████╗  ██████╗ ██████╗ ████████╗███████╗</span>`,
    `<span style="color:#58a6ff">  ██╔══██╗██╔════╝██║   ██║</span><span style="color:#bc8cff">██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝</span>`,
    `<span style="color:#79c0ff">  ██║  ██║█████╗  ██║   ██║</span><span style="color:#bc8cff">██████╔╝██║   ██║██████╔╝   ██║   █████╗  </span>`,
    `<span style="color:#79c0ff">  ██║  ██║██╔══╝  ╚██╗ ██╔╝</span><span style="color:#bc8cff">██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  </span>`,
    `<span style="color:#bc8cff">  ██████╔╝███████╗ ╚████╔╝ </span><span style="color:#58a6ff">██║     ╚██████╔╝██║  ██║   ██║   ██║     </span>`,
    `<span style="color:#bc8cff">  ╚═════╝ ╚══════╝  ╚═══╝  </span><span style="color:#58a6ff">╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝     </span>`,
    `<span style="color:#6e7681">                     Portfolio Terminal v1.0 — santiago.dev</span>`,
  ];
  for (const b of banner) await printLine(b, "white", 40);
  await printBlank(40);
  const boots = [
    {
      t: "  [    0.001]  Kernel: portfolio-linux 6.1.0-santiago",
      c: "dim",
    },
    { t: "  [    0.024]  Initializing runtime environment...", c: "dim" },
    {
      t: "  [    0.082]  Loading modules: <span style='color:#3fb950'>auth</span> · <span style='color:#3fb950'>cms</span> · <span style='color:#3fb950'>cli-parser</span> · <span style='color:#3fb950'>renderer</span>",
      c: "dim",
    },
    { t: "  [    0.150]  Authenticating user session...", c: "dim" },
    {
      t: "  [    0.220]  <span style='color:#3fb950'>✓</span> Access granted — role: <span style='color:#bc8cff'>recruiter_guest</span>",
      c: "success",
    },
  ];
  for (const m of boots) await printLine(m.t, m.c, 120);
  await printBlank(120);
  const barLine = document.createElement("div");
  barLine.className = "line dim";
  barLine.innerHTML = `  Loading data... [<span id="bbar" style="display:inline-block;height:.65rem;width:0;max-width:160px;background:linear-gradient(90deg,#58a6ff,#3fb950);border-radius:2px;vertical-align:middle;transition:width .08s"></span>] <span id="bpct">0%</span>`;
  out.appendChild(barLine);
  scrollBottom();
  const bbar = document.getElementById("bbar"),
    bpct = document.getElementById("bpct");
  await new Promise((res) => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 12) + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        res();
      }
      bbar.style.width = p * 1.6 + "px";
      bpct.textContent = p + "%";
      scrollBottom();
    }, 60);
  });
  await printBlank(200);
  const now = new Date();
  await printLine(
    `  ╔══════════════════════════════════════════════════╗`,
    "system",
    60,
  );
  await printLine(
    `  ║        WELCOME TO SANTIAGO'S PORTFOLIO           ║`,
    "system",
    40,
  );
  await printLine(
    `  ╠══════════════════════════════════════════════════╣`,
    "system",
    40,
  );
  await printLine(
    `  ║  Connected  :  ${now.toLocaleString().slice(0, 33).padEnd(33)}║`,
    "dim",
    40,
  );
  await printLine(
    `  ║  Host       :  santiago.dev                     ║`,
    "dim",
    40,
  );
  await printLine(
    `  ║  Role       :  recruiter_guest                  ║`,
    "dim",
    40,
  );
  await printLine(
    `  ║  Session    :  #${String(Math.floor(Math.random() * 9000 + 1000)).padEnd(36)}║`,
    "dim",
    40,
  );
  await printLine(
    `  ╚══════════════════════════════════════════════════╝`,
    "system",
    40,
  );
  await printBlank(80);
  await printLine(
    `  Type <span style="color:#e3b341;font-weight:700">help</span> to see available commands.`,
    "info",
    60,
  );
  await printLine(
    `  Use the quick-access buttons below for fast navigation.`,
    "dim",
    40,
  );
  await printBlank(80);
  busy = false;
  showInput();
  inputEl.focus();
  syncCursor();
}
function showInput() {
  inputRow.style.display = "flex";
  scrollBottom();
}
function echoCommand(cmd) {
  const el = document.createElement("div");
  el.className = "line cmd-echo";
  el.innerHTML = `<span class="prompt-user">recruiter</span><span style="color:#8b949e">@</span><span class="prompt-host">portfolio</span><span style="color:#8b949e">:</span><span class="prompt-path">~</span><span style="color:#c9d1d9;margin-left:4px;font-weight:700">$</span> <span style="color:#e6edf3">${escHtml(cmd)}</span>`;
  out.appendChild(el);
  scrollBottom();
}
function parseCommand(raw) {
  const t = raw.trim(),
    sqlMap = {
      "select * from projects;": "projects",
      "show skills;": "skills",
      "show projects;": "projects",
      "select * from skills;": "skills",
    },
    lo = t.toLowerCase();
  if (sqlMap[lo]) return { cmd: sqlMap[lo], args: [] };
  const parts = t.split(/\s+/);
  return { cmd: parts[0].toLowerCase(), args: parts.slice(1) };
}
async function handleCommand(raw) {
  if (!raw.trim()) return;
  echoCommand(raw);
  const { cmd, args } = parseCommand(raw);
  switch (cmd) {
    case "help":
      await cmdHelp();
      break;
    case "about":
      await cmdAbout();
      break;
    case "skills":
      await cmdSkills();
      break;
    case "projects":
      await cmdProjects();
      break;
    case "project":
      await cmdProject(args[0]);
      break;
    case "contact":
      await cmdContact();
      break;
    case "cv":
      await cmdCV();
      break;
    case "whoami":
      await cmdWhoami();
      break;
    case "date":
      await cmdDate();
      break;
    case "clear":
      cmdClear();
      break;
    case "exit":
      await cmdExit();
      break;
    default:
      await printLine(
        `  bash: <span style="color:#f85149">${escHtml(cmd)}</span>: command not found. Type <span style="color:#e3b341">help</span> for available commands.`,
        "warn",
      );
  }
  await printBlank();
}
async function cmdHelp() {
  await printBlank();
  await printLine(
    `  ┌─ Available Commands ──────────────────────────────────────┐`,
    "system",
  );
  await printLine(`  │`, "dim");
  /* AQUI SE USA COMMANDHINTS */
  for (const [c, h] of Object.entries(COMMAND_HINTS)) {
    const p = c.padEnd(12);
    await printLine(
      `  │  <span style="color:#79c0ff;font-weight:600">${p}</span>  <span style="color:#8b949e">${h}</span>`,
      "info",
      20,
    );
  }
  await printLine(`  │`, "dim");
  await printLine(
    `  │  <span style="color:#e3b341">SQL aliases:</span> SELECT * FROM projects; · SHOW SKILLS;`,
    "dim",
  );
  await printLine(
    `  └───────────────────────────────────────────────────────────┘`,
    "system",
  );
}
async function cmdAbout() {
  await printBlank();
  await printLine(
    `  ╭─ About Santiago ──────────────────────────────────────────╮`,
    "system",
  );
  await printLine(
    `  │ <span style="color:#e3b341;font-weight:700">${DATA.title}</span>`,
    "info",
  );
  await printLine(
    `  │ <span style="color:#8b949e">${DATA.tagline}</span>`,
    "dim",
  );
  await printLine(
    `  ╰───────────────────────────────────────────────────────────╯`,
    "system",
  );
  await printBlank();
  for (const l of DATA.about) await printLine(l, "info", 30);
}
async function cmdSkills() {
  await printBlank();
  await printLine(
    `  ╭─ Technical Skills ────────────────────────────────────────╮`,
    "system",
  );
  for (const [cat, tags] of Object.entries(DATA.skills)) {
    await printLine(`  │`, "dim");
    await printLine(
      `  │  <span style="color:#e3b341;font-weight:700">${cat.toUpperCase()}</span>`,
      "info",
    );
    const badgeEl = document.createElement("div");
    badgeEl.className = "line badge";
    badgeEl.style.paddingLeft = "24px";
    const sp = document.createElement("span");
    sp.style.cssText = "min-width:16px;display:inline-block";
    badgeEl.appendChild(sp);
    for (const t of tags) {
      const s = document.createElement("span");
      s.className = `badge-tag ${t.cls}`;
      s.textContent = t.name;
      badgeEl.appendChild(s);
    }
    out.appendChild(badgeEl);
    scrollBottom();
  }
  await printLine(`  │`, "dim");
  await printLine(
    `  ╰───────────────────────────────────────────────────────────╯`,
    "system",
  );
}
async function cmdProjects() {
  await printBlank();
  await printLine(
    `  ╭─ Projects ────────────────────────────────────────────────╮`,
    "system",
  );
  await printLine(`  │`, "dim");
  await printLine(
    `  │  <span style="color:#e3b341;font-weight:700"> ID  NAME                   STACK                    STATUS </span>`,
    "info",
  );
  await printLine(
    `  │  <span style="color:#30363d">──────────────────────────────────────────────────────────</span>`,
    "dim",
  );
  for (const p of DATA.projects) {
    await printLine(
      `  │  <span style="color:#79c0ff">${String(p.id).padEnd(4)}</span><span style="color:#e6edf3">${p.name.padEnd(23)}</span><span style="color:#8b949e">${p.stack.padEnd(25)}</span>${p.status}`,
      "table-row",
      40,
    );
  }
  await printLine(`  │`, "dim");
  await printLine(
    `  │  Use <span style="color:#e3b341">project &lt;id&gt;</span> for full details (e.g., <span style="color:#e3b341">project 1</span>)`,
    "dim",
  );
  await printLine(
    `  ╰───────────────────────────────────────────────────────────╯`,
    "system",
  );
}
async function cmdProject(id) {
  if (!id) {
    await printLine(
      `  Usage: <span style="color:#e3b341">project &lt;id&gt;</span>  (e.g., project 1)`,
      "warn",
    );
    return;
  }
  const p = DATA.projects.find((x) => String(x.id) === String(id));
  if (!p) {
    await printLine(
      `  <span style="color:#f85149">Error:</span> Project #${escHtml(id)} not found. Run <span style="color:#e3b341">projects</span> to list all.`,
      "error",
    );
    return;
  }
  await printBlank();
  await printLine(
    `  ╭─ Project #${p.id}: ${p.name} ${"─".repeat(Math.max(0, 43 - p.name.length))}╮`,
    "system",
  );
  await printLine(
    `  │  <span style="color:#8b949e">Stack  :</span> <span style="color:#79c0ff">${p.stack}</span>`,
    "info",
  );
  await printLine(
    `  │  <span style="color:#8b949e">Status :</span> ${p.status}`,
    "info",
  );
  await printLine(
    `  │  <span style="color:#8b949e">Year   :</span> ${p.year}`,
    "info",
  );
  await printLine(`  │`, "dim");
  await printLine(
    `  │  <span style="color:#e3b341;font-weight:700">Description</span>`,
    "info",
  );
  for (const l of p.description) await printLine(`  │${l}`, "info", 30);
  await printLine(`  │`, "dim");
  await printLine(
    `  │  <span style="color:#e3b341;font-weight:700">Links</span>`,
    "info",
  );
  if (p.demo)
    await printLine(
      `  │  <span style="color:#8b949e">Demo :</span> <a href="${p.demo}" target="_blank" rel="noopener">${p.demo}</a>`,
      "link-line",
    );
  if (p.repo)
    await printLine(
      `  │  <span style="color:#8b949e">Repo :</span> <a href="${p.repo}" target="_blank" rel="noopener">${p.repo}</a>`,
      "link-line",
    );
  if (!p.demo && !p.repo)
    await printLine(
      `  │  <span style="color:#6e7681">Links coming soon...</span>`,
      "dim",
    );
  await printLine(
    `  ╰───────────────────────────────────────────────────────────╯`,
    "system",
  );
}
async function cmdContact() {
  await printBlank();
  await printLine(
    `  ╭─ Contact ─────────────────────────────────────────────────╮`,
    "system",
  );
  await printLine(`  │`, "dim");
  await printLine(
    `  │  <span style="color:#e3b341">✉  Email    </span>  <a href="mailto:${DATA.email}">${DATA.email}</a>`,
    "link-line",
  );
  await printLine(
    `  │  <span style="color:#e3b341">⌥  GitHub   </span>  <a href="${DATA.github}" target="_blank" rel="noopener">${DATA.github}</a>`,
    "link-line",
  );

  await printLine(`  │`, "dim");
  await printLine(
    `  │  <span style="color:#8b949e">Response time:</span> <span style="color:#3fb950">< 24 hours</span>`,
    "dim",
  );
  await printLine(
    `  │  <span style="color:#8b949e">Open to:</span> <span style="color:#c9d1d9">Full-time · Remote</span>`,
    "dim",
  );
  await printLine(
    `  ╰───────────────────────────────────────────────────────────╯`,
    "system",
  );
}
async function cmdCV() {
  await printBlank();
  await printLine(
    `  <span style="color:#58a6ff">▶</span>  Preparing CV for download...`,
    "system",
  );
  await printLine(
    `  <span style="color:#3fb950">✓</span>  CV ready — opening in new tab.`,
    "success",
    600,
  );
  await printLine(
    `  <span style="color:#8b949e">URL :</span> <a href="${DATA.cv}" target="_blank" rel="noopener">${DATA.cv}</a>`,
    "link-line",
    200,
  );
  setTimeout(() => window.open(DATA.cv, "_blank"), 700);
}
async function cmdWhoami() {
  await printBlank();
  await printLine(
    `  <span style="color:#79c0ff;font-weight:700">${DATA.name}</span> — ${DATA.title}`,
    "white",
  );
  await printLine(`  ${DATA.tagline}`, "dim");
  await printBlank();
  await printLine(
    `  <span style="color:#8b949e">uid=1000(recruiter_guest) gid=1000(portfolio)</span>`,
    "dim",
  );
  await printLine(
    `  <span style="color:#8b949e">groups=</span><span style="color:#3fb950">fullstack,frontend,backend,automation</span>`,
    "dim",
  );
}
async function cmdDate() {
  const d = new Date(),
    opts = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
  await printLine(
    `  <span style="color:#3fb950">▸</span>  ${d.toLocaleDateString("en-US", opts)}`,
    "success",
  );
  await printLine(
    `  <span style="color:#8b949e">Unix timestamp: ${Math.floor(d.getTime() / 1000)}</span>`,
    "dim",
  );
}
function cmdClear() {
  out.innerHTML = "";
  printLine(
    `  Terminal cleared. Type <span style="color:#e3b341">help</span> for available commands.`,
    "dim",
  );
}
async function cmdExit() {
  terminated = true;
  inputRow.style.display = "none";
  await printBlank();
  await printLine(
    `  <span style="color:#f85149;font-weight:700">Session terminated.</span>`,
    "error",
  );
  await printLine(
    `  Goodbye, recruiter_guest. Thanks for visiting!`,
    "dim",
    200,
  );
  await printLine(
    `  <span style="color:#8b949e">Refresh the page to reconnect.</span>`,
    "dim",
    400,
  );
  await printBlank(200);
  await printLine(
    `  <span style="color:#30363d">Connection closed by remote host.</span>`,
    "dim",
    600,
  );
}
function buildAcResults(p) {
  if (!p) return [];
  const lo = p.toLowerCase();
  return COMMANDS.filter((c) => c.toLowerCase().startsWith(lo));
}
function renderAc(partial) {
  acResults = buildAcResults(partial);
  acSelected = -1;
  acBox.innerHTML = "";
  if (!acResults.length || !partial) {
    acBox.classList.remove("visible");
    return;
  }
  acResults.forEach((r, i) => {
    const item = document.createElement("div");
    item.className = "ac-item";
    item.innerHTML = `<span class="ac-match">${escHtml(r.slice(0, partial.length))}</span>${escHtml(r.slice(partial.length))}`;
    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
      inputEl.value = r;
      acBox.classList.remove("visible");
      acResults = [];
      inputEl.focus();
      syncCursor();
    });
    acBox.appendChild(item);
  });
  acBox.classList.add("visible");
}
function acSelectNext(dir) {
  const items = acBox.querySelectorAll(".ac-item");
  if (!items.length) return;
  if (acSelected >= 0) items[acSelected].classList.remove("selected");
  acSelected = (acSelected + dir + items.length) % items.length;
  items[acSelected].classList.add("selected");
}
function acConfirm() {
  if (acSelected >= 0 && acResults[acSelected])
    inputEl.value = acResults[acSelected];
  syncCursor();
  acBox.classList.remove("visible");
  acResults = [];
  acSelected = -1;
}
inputEl.addEventListener("keydown", async (e) => {
  if (busy || terminated) return;
  if (e.key === "Tab") {
    e.preventDefault();
    if (acBox.classList.contains("visible") && acResults.length) {
      acConfirm();
    } else {
      renderAc(inputEl.value.trim());
      if (acResults.length === 1) {
        inputEl.value = acResults[0];
        syncCursor();
        acBox.classList.remove("visible");
        acResults = [];
      }
    }
    return;
  }
  if (e.key === "ArrowUp" && acBox.classList.contains("visible")) {
    e.preventDefault();
    acSelectNext(-1);
    return;
  }
  if (e.key === "ArrowDown" && acBox.classList.contains("visible")) {
    e.preventDefault();
    acSelectNext(1);
    return;
  }
  if (e.key === "Escape") {
    acBox.classList.remove("visible");
    acResults = [];
    return;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!history.length) return;
    histIndex = Math.min(histIndex + 1, history.length - 1);
    inputEl.value = history[histIndex];
    syncCursor();
    return;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (histIndex <= 0) {
      histIndex = -1;
      inputEl.value = "";
      syncCursor();
      return;
    }
    histIndex--;
    inputEl.value = history[histIndex];
    syncCursor();
    return;
  }
  if (e.key === "Enter") {
    e.preventDefault();
    acBox.classList.remove("visible");
    const cmd = inputEl.value;
    if (!cmd.trim()) return;
    history.unshift(cmd);
    histIndex = -1;
    inputEl.value = "";
    syncCursor();
    busy = true;
    await handleCommand(cmd);
    busy = false;
    if (!terminated) {
      inputEl.focus();
      syncCursor();
    }
    return;
  }
  setTimeout(() => {
    if (inputEl.value.trim()) renderAc(inputEl.value.trim());
    else acBox.classList.remove("visible");
  }, 0);
});
document.getElementById("terminal-body").addEventListener("click", (e) => {
  if (!terminated && e.target.tagName !== "A") {
    inputEl.focus();
    syncCursor();
  }
});
document.querySelectorAll(".quick-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (busy || terminated) return;
    const cmd = btn.dataset.cmd;
    inputEl.value = "";
    history.unshift(cmd);
    histIndex = -1;
    busy = true;
    await handleCommand(cmd);
    busy = false;
    if (!terminated) {
      inputEl.focus();
      syncCursor();
    }
  });
});
boot();
