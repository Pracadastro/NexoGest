const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Senhas padrão
let sistemaSenha = "acesso123";
let adminSenha = "admin123";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

// Middleware para servir HTML puro
app.engine("html", (_, options, callback) => {
  fs.readFile(options.path, "utf-8", callback);
});

// Tela inicial de login
app.get("/", (req, res) => {
  res.render("login.html", { path: path.join(__dirname, "views", "login.html") });
});

// Validação de senha
app.post("/login", (req, res) => {
  const { senha } = req.body;

  if (senha === sistemaSenha) {
    return res.redirect("/painel");
  }

  if (senha === adminSenha) {
    return res.redirect("/admin");
  }

  return res.send("Senha incorreta. <a href='/'>Voltar</a>");
});

// Painel principal
app.get("/painel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "painel.html"));
});

// Área de administração
app.get("/admin", (req, res) => {
  res.send(`
    <h1>Área do Administrador</h1>
    <p>Aqui você poderá ver o log e alterar senhas.</p>
    <p><strong>Senha do sistema:</strong> ${sistemaSenha}</p>
    <p><strong>Senha do administrador:</strong> ${adminSenha}</p>
    <form method="POST" action="/alterar-senhas">
      <input type="text" name="novaSenhaSistema" placeholder="Nova senha do sistema">
      <input type="text" name="novaSenhaAdmin" placeholder="Nova senha do admin">
      <button type="submit">Alterar Senhas</button>
    </form>
    <hr>
    <h3>Log do ChatGPT</h3>
    <div style="background:#eee;padding:10px;margin-top:10px;">
      <p>[${new Date().toLocaleString()}] Sistema iniciado com sucesso.</p>
    </div>
  `);
});

// Alterar senhas
app.post("/alterar-senhas", (req, res) => {
  const { novaSenhaSistema, novaSenhaAdmin } = req.body;
  if (novaSenhaSistema) sistemaSenha = novaSenhaSistema;
  if (novaSenhaAdmin) adminSenha = novaSenhaAdmin;
  res.redirect("/admin");
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
