import type { PlopTypes } from "@turbo/gen";
import * as fs from "node:fs";
import * as path from "node:path";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Custom action: Add dependency to package.json
  plop.setActionType("addDependencyToJson", (answers, config) => {
    const filePath = config.path as string;
    const pkgName = `@repo/${(answers as Record<string, string>).packageName}`;

    const content = fs.readFileSync(filePath, "utf8");
    const pkg = JSON.parse(content);

    pkg.dependencies = pkg.dependencies || {};

    if (pkg.dependencies[pkgName]) {
      return `Dependency ${pkgName} already exists in ${filePath}`;
    }

    pkg.dependencies[pkgName] = "workspace:*";

    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + "\n");
    return `Added ${pkgName} to ${filePath}`;
  });

  // Custom action: Add TypeScript path to root tsconfig.base.json
  plop.setActionType("addTsPath", (answers, config) => {
    const filePath = config.path as string;
    const pkgName = (answers as Record<string, string>).packageName;

    const content = fs.readFileSync(filePath, "utf8");
    const tsconfig = JSON.parse(content);

    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
    tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};

    const pathKey = `@repo/${pkgName}/*`;
    const pathValue = [`packages/${pkgName}/src/*`];

    if (tsconfig.compilerOptions.paths[pathKey]) {
      return `Path ${pathKey} already exists in ${filePath}`;
    }

    tsconfig.compilerOptions.paths[pathKey] = pathValue;

    fs.writeFileSync(filePath, JSON.stringify(tsconfig, null, 2) + "\n");
    return `Added ${pathKey} to ${filePath}`;
  });

  // Custom action: Add Vite alias (idempotent)
  plop.setActionType("addViteAlias", (answers) => {
    const pkgName = (answers as Record<string, string>).packageName;
    const filePath = "apps/web/vite.config.ts";
    const aliasKey = `"@repo/${pkgName}"`;
    const aliasValue = `path.resolve(__dirname, "../../packages/${pkgName}/dist")`;

    let content = fs.readFileSync(filePath, "utf8");

    // Check if alias already exists
    if (content.includes(aliasKey)) {
      return `Alias ${aliasKey} already exists in ${filePath}`;
    }

    // Find the alias object and add the new alias
    // Match the alias block and insert before the closing brace
    const aliasPattern = /(alias:\s*{[^}]*)(}\s*,)/;

    if (!aliasPattern.test(content)) {
      throw new Error(`Could not find alias object in ${filePath}`);
    }

    content = content.replace(aliasPattern, (match, aliasContent, closing) => {
      // Add comma after last entry if needed
      const trimmed = aliasContent.trim();
      const needsComma = !trimmed.endsWith(",");
      return `${aliasContent}${needsComma ? "," : ""}\n      ${aliasKey}: ${aliasValue},\n    ${closing}`;
    });

    fs.writeFileSync(filePath, content);
    return `Added ${aliasKey} alias to ${filePath}`;
  });

  // Custom action: Display message
  plop.setActionType("message", (answers, config) => {
    const message = config.data as string;
    // Replace handlebars variables in the message
    const pkgName = (answers as Record<string, string>).packageName;
    const finalMessage = message.replace(/\{\{\s*packageName\s*\}\}/g, pkgName);
    console.log(finalMessage);
    return finalMessage;
  });

  plop.setGenerator("package", {
    description: "Create a new package in the monorepo",
    prompts: [
      {
        type: "input",
        name: "packageName",
        message: "Package name (without @repo/ prefix):",
        validate: (input: string) => {
          if (!input) return "Package name is required";
          if (!/^[a-z0-9-]+$/.test(input)) {
            return "Package name must be lowercase alphanumeric with hyphens only";
          }
          // Check if package already exists
          const packagePath = path.join(process.cwd(), "packages", input);
          if (fs.existsSync(packagePath)) {
            return `Package "${input}" already exists at ${packagePath}`;
          }
          return true;
        },
      },
      {
        type: "list",
        name: "packageType",
        message: "Package type:",
        choices: [
          { name: "React (components, hooks)", value: "react" },
          { name: "Non-React (utilities, schemas)", value: "non-react" },
        ],
      },
    ],
    actions: (answers) => {
      const actions: PlopTypes.ActionType[] = [];

      if (!answers) return actions;

      const { packageType } = answers;

      // 1. Create package files from templates
      actions.push({
        type: "addMany",
        destination: "packages/{{ packageName }}",
        base: `templates/package-${packageType}`,
        templateFiles: `templates/package-${packageType}/**/*`,
        stripExtensions: ["hbs"],
      });

      // 2. Add dependency to apps/web/package.json
      actions.push({
        type: "addDependencyToJson",
        path: "apps/web/package.json",
      });

      // 3. Add TypeScript path to root tsconfig.base.json
      actions.push({
        type: "addTsPath",
        path: "tsconfig.base.json",
      });

      // 4. Add Vite alias to apps/web/vite.config.ts
      actions.push({
        type: "addViteAlias",
      });

      // 5. Final message
      actions.push({
        type: "message",
        data: `
 Package @repo/{{ packageName }} created successfully!

Next steps:
  1. Run 'pnpm install' to link the new package
  2. Run 'pnpm typecheck' to verify TypeScript configuration
  3. Run 'pnpm lint' to verify ESLint configuration
  4. Import from your new package: import { ... } from "@repo/{{ packageName }}/..."
`,
      });

      return actions;
    },
  });

  plop.setGenerator("app", {
    description: "Create a new Vite + React app in the monorepo",
    prompts: [
      {
        type: "input",
        name: "appName",
        message: "App name:",
        validate: (input: string) => {
          if (!input) return "App name is required";
          if (!/^[a-z0-9-]+$/.test(input)) {
            return "App name must be lowercase alphanumeric with hyphens only";
          }
          // Check if app already exists
          const appPath = path.join(process.cwd(), "apps", input);
          if (fs.existsSync(appPath)) {
            return `App "${input}" already exists at ${appPath}`;
          }
          return true;
        },
      },
    ],
    actions: (answers) => {
      const actions: PlopTypes.ActionType[] = [];

      if (!answers) return actions;

      // 1. Create app files from templates
      actions.push({
        type: "addMany",
        destination: "apps/{{ appName }}",
        base: "templates/app-web",
        templateFiles: "templates/app-web/**/*",
        stripExtensions: ["hbs"],
      });

      // 2. Final message
      actions.push({
        type: "message",
        data: `
 App {{ appName }} created successfully!

Next steps:
  1. Run 'pnpm install' to install dependencies
  2. Run 'pnpm --filter {{ appName }} dev' to start the dev server
  3. Run 'pnpm typecheck' to verify TypeScript configuration
  4. Run 'pnpm lint' to verify ESLint configuration
  5. Open apps/{{ appName }}/src/App.tsx to start building your app
`,
      });

      return actions;
    },
  });
}
