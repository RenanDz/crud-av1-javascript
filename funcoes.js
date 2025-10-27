const express = require("express");
const bodyParser = require("body-parser");
const { lerArquivo, salvarArquivo, proximoId } = require("./funcoes");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const arquivoPerguntas = "perguntas.txt";
const arquivoRespostas = "respostas.txt";

// Criar pergunta
app.post("/pergunta", (req, res) => {
  const { acao, tipo, texto, respostas, id } = req.body;

  let perguntas = lerArquivo(arquivoPerguntas);
  let respostasArquivo = lerArquivo(arquivoRespostas);

  if (acao === "criar") {
    const idPergunta = proximoId(perguntas);
    perguntas.push([idPergunta, tipo, texto]);
    salvarArquivo(arquivoPerguntas, perguntas);

    if (tipo === "multipla" && respostas) {
      const lista = Array.isArray(respostas) ? respostas : [respostas];
      for (const textoR of lista) {
        if (!textoR.trim()) continue;
        const idResp = proximoId(respostasArquivo);
        respostasArquivo.push([idResp, idPergunta, textoR]);
      }
      salvarArquivo(arquivoRespostas, respostasArquivo);
    }

    return res.send("Pergunta criada com sucesso! <a href='/listar'>Voltar</a>");
  }

  if (acao === "alterar") {
    for (const p of perguntas) {
      if (p[0] === id) {
        p[1] = tipo;
        p[2] = texto;
      }
    }
    salvarArquivo(arquivoPerguntas, perguntas);

    if (tipo === "multipla") {
      respostasArquivo = respostasArquivo.filter(r => r[1] !== id);
      const lista = Array.isArray(respostas) ? respostas : [respostas];
      for (const textoR of lista) {
        if (!textoR.trim()) continue;
        const novoId = proximoId(respostasArquivo);
        respostasArquivo.push([novoId, id, textoR]);
      }
      salvarArquivo(arquivoRespostas, respostasArquivo);
    }

    return res.send("Pergunta alterada com sucesso! <a href='/listar'>Voltar</a>");
  }
});

// Editar
app.get("/editar/:id", (req, res) => {
  const id = req.params.id;
  const perguntas = lerArquivo(arquivoPerguntas);
  const respostas = lerArquivo(arquivoRespostas);
  const p = perguntas.find(p => p[0] === id);

  if (!p) return res.send("Pergunta não encontrada");

  let html = `
    <h3>Editar Pergunta</h3>
    <form method='post' action='/pergunta'>
      Texto: <input type='text' name='texto' value='${p[2]}'><br>
      Tipo: 
      <select name='tipo'>
        <option value='texto' ${p[1] === "texto" ? "selected" : ""}>Texto</option>
        <option value='multipla' ${p[1] === "multipla" ? "selected" : ""}>Múltipla escolha</option>
      </select><br>
  `;

  if (p[1] === "multipla") {
    html += "Respostas:<br>";
    for (const r of respostas.filter(r => r[1] === id)) {
      html += `<input type='text' name='respostas' value='${r[2]}'><br>`;
    }
    html += `<input type='text' name='respostas'><br>`;
  }

  html += `
      <input type='hidden' name='acao' value='alterar'>
      <input type='hidden' name='id' value='${p[0]}'>
      <button type='submit'>Salvar Alterações</button>
    </form>
  `;

  res.send(html);
});

// Excluir
app.get("/excluir/:id", (req, res) => {
  const id = req.params.id;
  let perguntas = lerArquivo(arquivoPerguntas);
  let respostas = lerArquivo(arquivoRespostas);

  perguntas = perguntas.filter(p => p[0] !== id);
  respostas = respostas.filter(r => r[1] !== id);

  salvarArquivo(arquivoPerguntas, perguntas);
  salvarArquivo(arquivoRespostas, respostas);

  res.send("Pergunta excluída com sucesso! <a href='/listar'>Voltar</a>");
});

// Listar
app.get("/listar", (req, res) => {
  const perguntas = lerArquivo(arquivoPerguntas);
  const respostas = lerArquivo(arquivoRespostas);

  let html = "<h3>Lista de Perguntas</h3>";
  for (const p of perguntas) {
    html += `<b>${p[0]} - ${p[2]}</b> (tipo: ${p[1]}) 
      <a href='/editar/${p[0]}'>[Editar]</a> 
      <a href='/excluir/${p[0]}'>[Excluir]</a><br>`;
    for (const r of respostas.filter(r => r[1] === p[0])) {
      html += ` - ${r[2]}<br>`;
    }
    html += "<hr>";
  }

  html += "<a href='/'>Voltar</a>";
  res.send(html);
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
