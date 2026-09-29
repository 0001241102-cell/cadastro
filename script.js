// Só roda na página de cadastro (o index.html não tem o formulário)
const form = document.getElementById("formCadastro");

if (form) {
  const inputFoto = document.getElementById("foto");
  const previa = document.getElementById("previa");
  const semFoto = document.getElementById("semFoto");
  const inputCpf = document.getElementById("cpf");
  const mensagem = document.getElementById("mensagem");

  // Prévia da foto de perfil
  inputFoto.addEventListener("change", () => {
    const arquivo = inputFoto.files[0];
    if (!arquivo) return;
    previa.src = URL.createObjectURL(arquivo);
    previa.hidden = false;
    semFoto.hidden = true;
  });

  // Máscara do CPF: 000.000.000-00
  inputCpf.addEventListener("input", () => {
    let v = inputCpf.value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    inputCpf.value = v;
  });
if (endereco.length < 5) return mostrar("Digite seu endereço.", "erro");
  function mostrar(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;
  }

  // Criptografa a senha (SHA-256) para não gravar em texto puro
  async function criptografar(texto) {
    if (window.crypto && crypto.subtle) {
      const dados = new TextEncoder().encode(texto);
      const hash = await crypto.subtle.digest("SHA-256", dados);
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    return btoa(texto); // alternativa simples se o navegador não suportar
  }

  // Gera e baixa o arquivo .txt
  function salvarTxt(conteudo, nomeArquivo) {
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const cpf = form.cpf.value.trim();
    const foto = inputFoto.files[0];

    if (nome.length < 3) return mostrar("Digite seu nome completo.", "erro");
    if (!/^\S+@\S+\.\S+$/.test(email)) return mostrar("Digite um e-mail válido.", "erro");
    if (senha.length < 6) return mostrar("A senha precisa ter pelo menos 6 caracteres.", "erro");
    if (cpf.replace(/\D/g, "").length !== 11) return mostrar("O CPF precisa ter 11 números.", "erro");
    if (!foto) return mostrar("Escolha uma foto de perfil.", "erro");

    const senhaCriptografada = await criptografar(senha);

    const conteudo =
      "=== CADASTRO VIOLETFLIX ===\n" +
      "Nome: " + nome + "\n" +
      "E-mail: " + email + "\n" +
      "Senha (criptografada): " + senhaCriptografada + "\n" +
      "CPF: " + cpf + "\n" +
      "Foto de perfil: " + foto.name + "\n" +
      "Data: " + new Date().toLocaleString("pt-BR") + "\n";

    salvarTxt(conteudo, "cadastro_" + nome.split(" ")[0].toLowerCase() + ".txt");
    mostrar("Cadastro feito! O arquivo .txt foi baixado.", "ok");
    form.reset();
    previa.hidden = true;
    semFoto.hidden = false;
  });
}