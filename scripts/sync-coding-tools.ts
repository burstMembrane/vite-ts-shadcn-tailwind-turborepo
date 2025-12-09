#!/usr/bin/env node

/**
 * Interactive script to sync vibe coding instructions to various AI coding platforms
 * Usage: node scripts/sync-vibe-coding-instructions.js [source-file]
 *
 *
 * If source-file is not provided, defaults to prompts/vibe-coding-instructions.md
 *
 * HOW IT WORKS:
 * - Creates hard links from the canonical source file to each tool's expected location
 * - Hard links share the same inode, so updates to source propagate automatically
 * - When tools rewrite their config files, hard links break (new inode created)
 * - Re-running this script restores the hard links
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

/**
 * Platform configuration array
 *
 * Each platform defines:
 * - id: Unique identifier
 * - name: Display name in the menu
 * - dirPath: Directory where the rules file should be created
 * - targetPath: Specific filename (used when useSourceFilename is false)
 * - useSourceFilename: If true, uses the source filename; if false, uses targetPath
 * - selected: Default selection state in the interactive menu
 */
const platforms = [
  {
    id: "windsurf",
    name: "Windsurf",
    dirPath: ".windsurf/rules",
    useSourceFilename: true,
    selected: true,
  },
  {
    id: "agent",
    name: "Anti Gravity",
    dirPath: ".agent/rules",
    useSourceFilename: true,
    selected: true,
  },
  {
    id: "claude",
    name: "Claude Code",
    targetPath: "CLAUDE.MD",
    dirPath: "",
    useSourceFilename: false,
    selected: true,
  },
  {
    id: "cline",
    name: "Cline",
    dirPath: ".clinerules",
    useSourceFilename: true,
    selected: false,
  },
  {
    id: "cursor",
    name: "Cursor",
    targetPath: ".cursorrules",
    dirPath: "",
    useSourceFilename: false,
    selected: false,
  },
  {
    id: "codex",
    name: "ChatGPT Codex",
    targetPath: "AGENTS.md",
    dirPath: "",
    useSourceFilename: false,
    selected: false,
  },
  {
    id: "agentforce",
    name: "Agentforce Vibes",
    dirPath: ".a4drules",
    useSourceFilename: true,
    selected: false,
  },
  {
    id: "continue",
    name: "Continue",
    dirPath: ".continue",
    useSourceFilename: true,
    selected: false,
  },
  {
    id: "aider",
    name: "Aider",
    dirPath: ".aider",
    useSourceFilename: true,
    selected: false,
  },
];

const rootPath = path.resolve(__dirname, "..");
let sourcePath = "";
let sourceFilename = "";

/**
 * ANSI color codes for terminal styling
 * Used to create the interactive TUI with colored output
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

/**
 * Clears the terminal screen
 * Uses ANSI escape codes: \x1b[2J (clear screen) + \x1b[0f (move cursor to top-left)
 */
function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[0f");
}

/**
 * Renders the interactive menu with platform selection checkboxes
 *
 * @param {number} cursor - Current cursor position (index of highlighted platform)
 *
 * Features:
 * - Shows source file path
 * - Lists all platforms with checkboxes [x] or [ ]
 * - Highlights current cursor position with '>'
 * - Shows target path for each platform
 * - Uses color coding: green for selected, dim for unselected
 */
function printMenu(cursor) {
  clearScreen();
  console.log(
    `${colors.bright}${colors.cyan}+----------------------------------------------------------+${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.cyan}|${colors.reset}  ${colors.bright}Sync Coding Instructions to AI Platforms${colors.reset}     ${colors.cyan}|${colors.reset}`
  );
  console.log(
    `${colors.bright}${colors.cyan}+----------------------------------------------------------+${colors.reset}\n`
  );

  console.log(`${colors.dim}Source: ${sourcePath}${colors.reset}\n`);
  console.log(
    `${colors.dim}Use UP/DOWN to navigate, SPACE/X to toggle, ENTER to confirm${colors.reset}\n`
  );

  platforms.forEach((platform, index) => {
    const checkbox = platform.selected ? "[x]" : "[ ]";
    const pointer = cursor === index ? ">" : " ";
    const color = platform.selected ? colors.green : colors.dim;
    const nameColor = cursor === index ? colors.bright : "";

    // Compute target path for display
    const targetPath = platform.useSourceFilename
      ? path.join(platform.dirPath, sourceFilename)
      : platform.targetPath;

    console.log(
      `  ${pointer} ${color}${checkbox}${colors.reset} ${nameColor}${platform.name}${colors.reset} ${colors.dim}(${targetPath})${colors.reset}`
    );
  });

  console.log(`\n${colors.dim}Press 'a' to toggle all, 'q' to cancel${colors.reset}`);
}

/**
 * Displays sync operation results
 *
 * @param {string[]} results - Array of result messages ([OK] or [FAIL] for each platform)
 */
function showResults(results) {
  console.log(`\n${colors.bright}${colors.cyan}=== Results ===${colors.reset}\n`);
  results.forEach((result) => console.log(`  ${result}`));
  console.log("");
}

/**
 * Performs the actual file synchronization by creating hard links
 *
 * Process:
 * 1. Validates source file exists
 * 2. Filters to selected platforms only
 * 3. For each platform:
 *    - Deletes existing target file if present (breaks old hard link)
 *    - Creates target directory if needed
 *    - Creates new hard link: fs.linkSync(source, target)
 * 4. Reports success/failure for each platform
 *
 * IMPORTANT: fs.linkSync creates a hard link, not a copy
 * - Both paths point to the same inode
 * - Changes to either file affect both
 * - If target is rewritten (new inode), link breaks and needs restoration
 */
async function syncFiles() {
  const sourceFullPath = path.join(rootPath, sourcePath);

  if (!fs.existsSync(sourceFullPath)) {
    console.error(`${colors.red}[ERROR] Source file not found: ${sourcePath}${colors.reset}`);
    process.exit(1);
  }

  const selectedPlatforms = platforms.filter((p) => p.selected);

  if (selectedPlatforms.length === 0) {
    console.log(`${colors.yellow}[!] No platforms selected. Exiting.${colors.reset}`);
    return;
  }

  const results = [];
  let successCount = 0;

  for (const platform of selectedPlatforms) {
    try {
      // Determine target path based on platform configuration
      // Some platforms use a fixed filename (e.g., CLAUDE.MD)
      // Others use the source filename in a directory (e.g., .windsurf/rules/<source>)
      const targetPath = platform.useSourceFilename
        ? path.join(platform.dirPath, sourceFilename)
        : platform.targetPath;
      const targetFullPath = path.join(rootPath, targetPath);

      // Delete existing target file if present
      // This breaks the old hard link (if any) before creating a new one
      if (fs.existsSync(targetFullPath)) {
        fs.unlinkSync(targetFullPath);
      }

      // Create target directory if needed (e.g., .windsurf/rules/)
      if (platform.dirPath) {
        const dirFullPath = path.join(rootPath, platform.dirPath);
        if (!fs.existsSync(dirFullPath)) {
          fs.mkdirSync(dirFullPath, { recursive: true });
        }
      }

      // Create hard link: both source and target now point to the same inode
      // This is NOT a copy - they share the same file content on disk
      fs.linkSync(sourceFullPath, targetFullPath);
      successCount++;
      results.push(`${colors.green}[OK]${colors.reset} ${platform.name}: ${targetPath}`);
    } catch (error) {
      results.push(`${colors.red}[FAIL]${colors.reset} ${platform.name}: ${error.message}`);
    }
  }

  showResults(results);
  console.log(
    `${colors.bright}${successCount === selectedPlatforms.length ? colors.green : colors.yellow}Synced to ${successCount}/${selectedPlatforms.length} platform(s)${colors.reset}\n`
  );
}

/**
 * Interactive platform selection using terminal UI
 *
 * Keyboard Controls:
 * - UP/DOWN: Navigate through platforms
 * - SPACE/X: Toggle selection for current platform
 * - A/T: Toggle all platforms (select all if any unselected, deselect all if all selected)
 * - ENTER: Confirm selection and execute sync
 * - Q: Cancel without syncing
 * - Ctrl+C: Exit immediately
 *
 * Technical Details:
 * - Uses readline's keypress events for interactive control
 * - Puts stdin in raw mode to capture individual keypresses
 * - Returns a Promise that resolves when user confirms or cancels
 */
async function selectPlatforms() {
  let cursor = 0;

  // Enable keypress event detection on stdin
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true); // Raw mode: capture keypresses without waiting for Enter
  }

  printMenu(cursor);

  return new Promise((resolve) => {
    const handler = async (str, key) => {
      // Ctrl+C: Exit immediately
      if (key && key.ctrl && key.name === "c") {
        process.exit(0);
      }

      // SPACE/X: Toggle current platform selection
      if (str === " " || str === "x" || str === "X" || (key && key.name === "space")) {
        platforms[cursor].selected = !platforms[cursor].selected;
        printMenu(cursor);
        return;
      }

      // A/T: Toggle all platforms (smart toggle: if any unselected, select all; if all selected, deselect all)
      if (
        str === "a" ||
        str === "A" ||
        str === "t" ||
        str === "T" ||
        (key && (key.name === "a" || key.name === "t"))
      ) {
        const allSelected = platforms.every((p) => p.selected);
        platforms.forEach((p) => {
          p.selected = !allSelected;
        });
        printMenu(cursor);
        return;
      }

      if (!key) return;

      switch (key.name) {
        case "up":
          // Move cursor up, wrap to bottom if at top
          cursor = cursor > 0 ? cursor - 1 : platforms.length - 1;
          printMenu(cursor);
          break;

        case "down":
          // Move cursor down, wrap to top if at bottom
          cursor = (cursor + 1) % platforms.length;
          printMenu(cursor);
          break;

        case "return":
          // ENTER: Confirm selection and execute sync
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
          process.stdin.pause();
          clearScreen();
          await syncFiles();
          resolve();
          break;

        case "q":
          // Q: Cancel without syncing
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
          process.stdin.pause();
          clearScreen();
          console.log(`${colors.yellow}[!] Cancelled${colors.reset}\n`);
          resolve();
          break;
      }
    };

    process.stdin.on("keypress", handler);
  });
}

/**
 * Main entry point
 *
 * Process:
 * 1. Parse command-line argument for source file (or use default)
 * 2. Validate source file exists
 * 3. Launch interactive platform selection
 * 4. Selected platforms are synced via hard links
 */
async function main() {
  // Use command-line argument or default to vibe-coding-instructions.md
  sourcePath = process.argv[2] || "CLAUDE.md";

  sourceFilename = path.basename(sourcePath);

  // Validate source file exists before launching interactive menu
  const sourceFullPath = path.join(rootPath, sourcePath);
  if (!fs.existsSync(sourceFullPath)) {
    console.error(`${colors.red}[ERROR] Source file not found: ${sourcePath}${colors.reset}\n`);
    process.exit(1);
  }

  // Launch interactive platform selection and sync
  await selectPlatforms();
}

// Execute main function and catch any unhandled errors
main().catch(console.error);
