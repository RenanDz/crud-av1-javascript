const express = require("express");
const router = express.Router();
const { lerArquivo, salvarArquivo, proximoId } = require("../../funcoes");

router.get("/editar/:id", (req, res) => {
  const perguntas = lerArquivo("perguntas.txt");
  const respostas = lerArquivo("respostas.txt");
  const pergunta = perguntas.find(p => p[0] === req.params.id);
  const resps = respostas.filter(r => r[1] === req.params.id);
  res.render("editar", { pergunta, respostas: resps });
});

router.post("/editar/:id", (req, res) => {
  const perguntas = lerArquivo("perguntas.txt").map(p =>
    p[0] === req.params.id ? [p[0], req.body.tipo, req.body.texto] : p
  );
  salvarArquivo("perguntas.txt", perguntas);

  let respostas = lerArquivo("respostas.txt").filter(r => r[1] !== req.params.id);
  if (req.body.tipo === "multipla" && req.body.respostas) {
    req.body.respostas.forEach(texto => {
      if (texto.trim()) {
        const idResp = proximoId(respostas);
        respostas.push([idResp, req.params.id, texto]);
      }
    });
  }
  salvarArquivo("respostas.txt", respostas);
  res.redirect("/perguntas/listar");
});

module.exports = router;
