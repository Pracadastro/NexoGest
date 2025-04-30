function verificarSenha(event) {
  event.preventDefault();
  const senha = document.getElementById('senha').value;
  const senhaCorreta = "nexogest123"; // provisória

  if (senha === senhaCorreta) {
    window.location.href = "painel.html";
  } else {
    document.getElementById('erro').textContent = "Senha incorreta. Tente novamente.";
  }
}
