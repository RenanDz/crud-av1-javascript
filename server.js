const express = require("express");
const bodyParser = require("body-parser");
const perguntasRoutes = require("./routes/perguntas");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/perguntas", perguntasRoutes);

app.get("/", (req, res) => res.render("index"));

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
