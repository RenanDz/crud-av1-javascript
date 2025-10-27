const fs = require("fs");

function lerArquivo(caminho) {
  if (!fs.existsSync(caminho)) return [];
  return fs.readFileSync(caminho, "utf8")
    .trim()
    .split("\n")
    .filter(l => l)
    .map(l => l.split(";"));
}

function salvarArquivo(caminho, dados) {
  const texto = dados.map(l => l.join(";")).join("\n");
  fs.writeFileSync(caminho, texto, "utf8");
}

function proximoId(dados) {
  if (dados.length === 0) return 1;
  const ids = dados.map(l => parseInt(l[0]));
  return Math.max(...ids) + 1;
}

module.exports = { lerArquivo, salvarArquivo, proximoId };
