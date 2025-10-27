const express = require("express");
const router = express.Router();
const { lerArquivo, salvarArquivo } = require("../../funcoes");

router.get("/excluir/:id", (req, res) => {
  let perguntas = lerArquivo("perguntas.txt").filter(p => p[0] !== req.params.id);
  salvarArquivo("perguntas.txt", perguntas);

  let respostas = lerArquivo("respostas.txt").filter(r => r[1] !== req.params.id);
  salvarArquivo("respostas.txt", respostas);

  res.redirect("/perguntas/listar");
});

module.exports = router;
