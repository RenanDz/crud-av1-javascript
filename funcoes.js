const fs = require('fs');

function lerArquivo(caminho) {
  if (!fs.existsSync(caminho)) return [];
  const raw = fs.readFileSync(caminho, 'utf8').trim();
  if (raw === '') return [];
  const linhas = raw.split('\n');
  return linhas.map(l => l.split(';'));
}

function salvarArquivo(caminho, dados) {
  const conteudo = dados.map(l => l.join(';')).join('\n');
  fs.writeFileSync(caminho, conteudo, 'utf8');
}

function proximoId(dados) {
  if (!dados || dados.length === 0) return '1';
  const max = Math.max(...dados.map(l => parseInt(l[0], 10) || 0));
  return String(max + 1);
}

module.exports = { lerArquivo, salvarArquivo, proximoId };
