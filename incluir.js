const express = require("express");
const router = express.Router();
const { lerArquivo, salvarArquivo, proximoId } = require("../../funcoes");

router.get("/criar", (req, res) => res.render("criar"));

router.post("/criar", (req, res) => {
  const perguntas = lerArquivo("perguntas.txt");
  const idPergunta = proximoId(perguntas);
  perguntas.push([idPergunta, req.body.tipo, req.body.texto]);
  salvarArquivo("perguntas.txt", perguntas);

  if (req.body.tipo === "multipla" && req.body.respostas) {
    const respostas = lerArquivo("respostas.txt");
    req.body.respostas.forEach(texto => {
      if (texto.trim()) {
        const idResp = proximoId(respostas);
        respostas.push([idResp, idPergunta, texto]);
      }
    });
    salvarArquivo("respostas.txt", respostas);
  }

  res.redirect("/perguntas/listar");
});

module.exports = router;
