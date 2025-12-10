import { Project } from "ts-morph";
import path from "node:path";

const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
});

project.getSourceFiles("**/*.{ts,tsx,js,jsx}").forEach((sf) => {
  sf.getImportDeclarations().forEach((imp) => {
    if (imp.getModuleSpecifierValue() === "src/lib/utils") {
      imp.setModuleSpecifier("../../lib");
    }
  });
});

project.save().then(() => {
  console.log("Updated cn imports.");
});
