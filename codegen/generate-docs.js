const fs = require("fs");
const path = require("path");

const codeToJson = require("./code-to-json");

const outputDir = path.resolve(__dirname, "../docs");

codeToJson(path.resolve(__dirname, "../")).then(({ declarations, symbols, types }) => {
  const functions = Object.values(symbols)
    .filter(filterSymbol)
    .map(symbol => [
      symbol.name,
      symbol.otherDeclarationTypes[0].type[1],
      symbol.valueDeclaration[1],
      (symbol.documentation || {}).summary
    ]);

  const toc = functions.map(([name]) => `- <a href="#${name}">${name}</a>`).join("\n");

  const docs = functions
    .map(([name, typeId, sourceId, doc]) =>
      [
        stringifyName(name),
        stringifyType(types[typeId].text, name),
        stringifyDoc(doc),
        stringifySource(declarations[sourceId].text)
      ].join("\n\n")
    )
    .join("\n\n");

  const fileContent = `# Kompis API
<details>
  <summary>Table of contents</summary>
  <p>
    ${toc}
  </p>
</details>

${docs}
`;

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  fs.writeFileSync(path.resolve(__dirname, "../docs/README.md"), fileContent);
});

function filterSymbol(symbol) {
  return symbol.flags.includes("variable") && !symbol.flags.includes("transient");
}

function stringifyName(name) {
  return `## <div id="${name}"></div> ${name}`;
}

function stringifyType(type, name) {
  return codeBlock("ts", `${name}: ${type}`);
}

function stringifySource(code) {
  return `<details>
  <summary>Implementation</summary>
  <p>
    ${codeBlock("ts", `const ${code}`)}
  <p>
</details>`;
}

function codeBlock(language, code) {
  return "\n```" + `${language}\n${code}\n` + "```\n";
}

function stringifyDoc(fragments = []) {
  return fragments
    .map(fragment => {
      if (typeof fragment === "string") return fragment;

      const { code, kind, language } = fragment;

      if (kind === "inlineCode") return " `" + code + "` ";
      if (kind === "fencedCode") return codeBlock(language, code);
      throw new Error(`Missing parser for comment fragment of type '${fragment.kind}'`);
    })
    .join("");
}
