const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Senhas
const USER_PASSWORD = "nexogest123";
const ADMIN_PASSWORD = "admin456";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "nexogest_secret_key",
  resave: false,
  saveUninitialized: true
}));

// Rota de login normal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", (req, res) => {
  const { senha } = req.body;
  if (senha === USER_PASSWORD) {
    req.session.autenticado = true;
    res.redirect("/painel");
  } else if (senha === ADMIN_PASSWORD) {
    req.session.admin = true;
    res.redirect("/admin");
  } else {
    res.send("Senha incorreta.");
  }
});

// Rota protegida do painel
app.get("/painel", (req, res) => {
  if (req.session.autenticado) {
    res.sendFile(path.join(__dirname, "public", "painel.html"));
  } else {
    res.redirect("/");
  }
});

// Rota protegida do admin
app.get("/admin", (req, res) => {
  if (req.session.admin) {
    res.sendFile(path.join(__dirname, "views", "admin.html"));
  } else {
    res.redirect("/");
  }
});

// Página de log
app.get("/log", (req, res) => {
  if (req.session.admin) {
    res.sendFile(path.join(__dirname, "views", "log.html"));
  } else {
    res.redirect("/");
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
