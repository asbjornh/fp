const fs = require("fs");
const path = require("path");

const readFile = (...pathSegments) =>
  fs.readFileSync(path.resolve(__dirname, ...pathSegments), "utf8");

const readmeBase = readFile("..", "readme-base.md");
const source = readFile("..", "source", "index.ts");

const readmeContent = `${readmeBase}
\`\`\`js
${source}
\`\`\`
`;

fs.writeFileSync(path.resolve(__dirname, "..", "README.md"), readmeContent);
