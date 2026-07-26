#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const syncSkills = process.argv.includes("--sync-skills");
const failures = [];
const passes = [];

const requiredFiles = [
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  ".ai/README.md",
  ".ai/versions.md",
  ".ai/skills/verify-before-done/SKILL.md",
  ".agents/skills/verify-before-done/SKILL.md",
  ".claude/settings.json",
  ".claude/skills/verify-before-done/SKILL.md",
  ".gemini/settings.json",
  ".codex/config.toml.example",
  ".mcp.json.example",
  "knowledge/index.md",
  "knowledge/architecture/overview.md",
  "knowledge/policies/security.md",
  "knowledge/decisions/adr-0001.md",
  "knowledge/log.md",
  ".gitignore"
];

const skillSource = ".ai/skills/verify-before-done/SKILL.md";
const skillCopies = [
  ".agents/skills/verify-before-done/SKILL.md",
  ".claude/skills/verify-before-done/SKILL.md"
];

function pathOf(relativePath) {
  return join(root, ...relativePath.split("/"));
}

function read(relativePath) {
  return readFileSync(pathOf(relativePath), "utf8");
}

function normalizedText(value) {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function check(condition, message) {
  if (condition) {
    passes.push(message);
  } else {
    failures.push(message);
  }
}

function parseJson(relativePath) {
  try {
    return JSON.parse(read(relativePath));
  } catch (error) {
    failures.push(`${relativePath}: JSON parse failed (${error.message})`);
    return null;
  }
}

for (const file of requiredFiles) {
  check(existsSync(pathOf(file)), `required file exists: ${file}`);
}

if (failures.some((message) => message.startsWith("required file exists:"))) {
  finish();
}

if (syncSkills) {
  const source = read(skillSource);
  for (const destination of skillCopies) {
    writeFileSync(pathOf(destination), source, "utf8");
  }
  console.log(`Synced ${skillCopies.length} Skill copies from ${skillSource}.`);
}

const canonicalSkill = normalizedText(read(skillSource));
for (const copy of skillCopies) {
  check(normalizedText(read(copy)) === canonicalSkill, `Skill copy matches canonical source: ${copy}`);
}

const claudeMd = normalizedText(read("CLAUDE.md"));
const geminiMd = normalizedText(read("GEMINI.md"));
check(/^@AGENTS\.md\s*$/m.test(claudeMd), "CLAUDE.md imports AGENTS.md");
check(/^@\.\/AGENTS\.md\s*$/m.test(geminiMd), "GEMINI.md imports AGENTS.md");

const claude = parseJson(".claude/settings.json");
if (claude) {
  const ask = claude.permissions?.ask ?? [];
  const deny = claude.permissions?.deny ?? [];
  check(claude.permissions?.defaultMode === "default", "Claude uses default permission mode");
  check(ask.some((rule) => rule.includes("git push")), "Claude asks before git push");
  check(ask.some((rule) => /deploy|terraform apply|kubectl apply/.test(rule)), "Claude asks before deploy-like commands");
  check(deny.some((rule) => rule.includes(".env")), "Claude denies secret-file access");
  check(!deny.includes("Read(./.env.*)") && !deny.includes("Edit(./.env.*)"), "Claude keeps .env.example readable");
  check(claude.disableSkillShellExecution === true, "Claude disables project Skill shell injection");
}

const gemini = parseJson(".gemini/settings.json");
if (gemini) {
  check(gemini.general?.defaultApprovalMode === "default", "Gemini uses default approval mode");
  check(gemini.context?.fileName === "GEMINI.md", "Gemini loads one adapter context file");
  check(gemini.security?.folderTrust === undefined, "Gemini project settings do not control user Folder Trust");
  check(gemini.security?.environmentVariableRedaction?.enabled === true, "Gemini redacts sensitive environment variables");
  check(gemini.skills?.enabled === true, "Gemini Skills are enabled");
  check((gemini.mcp?.excluded ?? []).includes("openaiDeveloperDocs"), "Gemini example MCP is disabled");
  check(gemini.mcpServers?.openaiDeveloperDocs?.trust === false, "Gemini MCP does not bypass confirmations");
}

parseJson(".mcp.json.example");

const codex = normalizedText(read(".codex/config.toml.example"));
check(/approval_policy\s*=\s*"on-request"/.test(codex), "Codex asks for approval on request");
check(/sandbox_mode\s*=\s*"workspace-write"/.test(codex), "Codex limits writes to workspace");
check(/\[sandbox_workspace_write\][\s\S]*?network_access\s*=\s*false/.test(codex), "Codex command network access is disabled");
check(/\[mcp_servers\.openaiDeveloperDocs\][\s\S]*?enabled\s*=\s*false/.test(codex), "Codex example MCP is disabled");
check(/default_tools_approval_mode\s*=\s*"prompt"/.test(codex), "Codex MCP tools prompt by default");

const readme = normalizedText(read("README.md"));
check(readme.includes("specify init --here --integration claude"), "README has official Spec Kit init form");
check(readme.includes("specify integration install codex"), "README explains Spec Kit multi-install");
check(readme.includes("`.specify/`와 `specs/`"), "README distinguishes .specify/ from specs/");

const versions = normalizedText(read(".ai/versions.md"));
check(versions.includes("Spec Kit | `v0.14.2`"), "versions record pins the documented Spec Kit release");
check(versions.includes("프로젝트에서 결정"), "versions record marks project-specific choices");

const knowledgeRoot = pathOf("knowledge");
const markdownFiles = walk(knowledgeRoot).filter((file) => extname(file).toLowerCase() === ".md");
for (const absoluteFile of markdownFiles) {
  const rel = relative(root, absoluteFile).split("\\").join("/");
  const base = absoluteFile.split(/[\\/]/).at(-1);
  const content = normalizedText(readFileSync(absoluteFile, "utf8"));
  if (base === "index.md" || base === "log.md") {
    continue;
  }
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);
  check(Boolean(frontmatter), `${rel} has YAML frontmatter`);
  if (frontmatter) {
    check(/^type:\s*.+$/m.test(frontmatter[1]), `${rel} has required OKF type`);
  }
}

const knowledgeIndex = normalizedText(read("knowledge/index.md"));
check(/^---\nokf_version:\s*["']?0\.2["']?\n---\n/.test(knowledgeIndex), "knowledge root declares OKF v0.2");

for (const absoluteFile of walk(root)) {
  if (statSync(absoluteFile).isDirectory()) {
    continue;
  }
  const rel = relative(root, absoluteFile).split("\\").join("/");
  if (rel === "scripts/verify-ai-config.mjs") {
    continue;
  }
  const extension = extname(absoluteFile).toLowerCase();
  if (![".md", ".json", ".toml", ".example", ""].includes(extension)) {
    continue;
  }
  const content = readFileSync(absoluteFile, "utf8");
  const suspicious = [
    /\b(?:api[_-]?key|token|password|secret)\s*[:=]\s*["'][A-Za-z0-9+/=_-]{20,}["']/i,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/
  ];
  check(!suspicious.some((pattern) => pattern.test(content)), `no embedded secret pattern: ${rel}`);
}

for (const absoluteFile of walk(root).filter((file) => extname(file).toLowerCase() === ".md")) {
  checkMarkdownLinks(absoluteFile);
}

finish();

function walk(directory) {
  const results = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(absolute));
    } else {
      results.push(absolute);
    }
  }
  return results;
}

function checkMarkdownLinks(absoluteFile) {
  const content = readFileSync(absoluteFile, "utf8");
  const rel = relative(root, absoluteFile).split("\\").join("/");
  const links = content.matchAll(/!?\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g);
  for (const match of links) {
    const target = match[1];
    if (
      target.startsWith("#") ||
      /^[a-z][a-z0-9+.-]*:/i.test(target) ||
      target.startsWith("/")
    ) {
      continue;
    }
    const withoutAnchor = decodeURIComponent(target.split("#", 1)[0]);
    if (!withoutAnchor) {
      continue;
    }
    const resolved = normalize(resolve(dirname(absoluteFile), withoutAnchor));
    const insideRoot = resolved === root || resolved.startsWith(`${root}${process.platform === "win32" ? "\\" : "/"}`);
    check(insideRoot && existsSync(resolved), `${rel} link resolves: ${target}`);
  }
}

function finish() {
  if (failures.length > 0) {
    console.error(`AI configuration verification failed (${failures.length} issue(s)):\n`);
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(`AI configuration verification passed (${passes.length} checks).`);
  process.exit(0);
}
