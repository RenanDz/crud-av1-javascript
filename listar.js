const express = require("express");
const router = express.Router();
const { lerArquivo } = require("../../funcoes");

router.get("/listar", (req, res) => {
  const perguntas = lerArquivo("perguntas.txt");
  const respostas = lerArquivo("respostas.txt");
  res.render("listar", { perguntas, respostas });
});

module.exports = router;
