// Área de mensagens
const mensagem = document.getElementById("mensagem");

// Lê o id recebido na query string
const obtemId = () => {
  // busca por "top=???" na url atual
  return new URL(document.location.href).searchParams.get("top");
};

// Ajusta a tela com os dados do top
const preencheTop = (top) => {
  // Ajusta valores
  document.getElementById("titulo").value = top.titulo;
  document.getElementById("item-1").value = top.item[0].nome;
  document.getElementById("item-2").value = top.item[1].nome;
  document.getElementById("item-3").value = top.item[2].nome;
  document.getElementById("item-4").value = top.item[3].nome;
  document.getElementById("item-5").value = top.item[4].nome;
  // Ajusta link do botão voltar
  document.getElementById("link-voltar").href = `visualizar.html?top=${top.id}`;
};

// Salva os novos dados do top
const salvar = async (e) => {
  e.preventDefault();
  // Recupera o id
  const id = obtemId();
  // Monta objeto top com os valores digitados
  const titulo = document.getElementById("titulo").value;
  const item = [];
  item.push({ posicao: 1, nome: document.getElementById("item-1").value });
  item.push({ posicao: 2, nome: document.getElementById("item-2").value });
  item.push({ posicao: 3, nome: document.getElementById("item-3").value });
  item.push({ posicao: 4, nome: document.getElementById("item-4").value });
  item.push({ posicao: 5, nome: document.getElementById("item-5").value });
  const topAlterado = {
    id,
    titulo,
    item,
  };
  // Mensagem de carregamento
  mensagem.innerHTML = "salvando...";
  // Efetua o PUT
  const url = `/api/Tops/${id}`;
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(topAlterado),
  };
  const response = await fetch(url, requestOptions);
  if (response.ok) {
    // Sucesso
    // Não é preciso recarregar os dados pois são iguais
    // Mensagem de sucesso
    mensagem.innerHTML = "Top salvo com sucesso.";
  } else {
    const result = await response.json();
    // Exibe mensagem de erro
    mensagem.innerHTML = `Erro ao salvar o top.<br>${result.mensagem}`;
  }
};

const iniciar = async () => {
  // Adiciona evento de submit no form
  document.forms[0].addEventListener("submit", salvar);
  // Recupera o id
  const id = obtemId();
  if (id) {
    // Mensagem de carregamento
    mensagem.innerHTML = "carregando...";
    // Efetua o GET
    const response = await fetch(`/api/Tops/${id}`);
    if (response.ok) {
      // Sucesso
      const result = await response.json();
      preencheTop(result);
      // Limpa mensagem
      mensagem.innerHTML = "";
    } else {
      // Excluir o form
      document.forms[0].innerHTML = "";
      // Exibe mensagem de erro
      mensagem.innerHTML = `Erro ao carregar o top ${id}.`;
    }
  } else {
    // Excluir o form
    document.forms[0].innerHTML = "";
    // Exibe mensagem de erro
    mensagem.innerHTML = "Nenhum top a alterar.";
  }
};

document.addEventListener("DOMContentLoaded", iniciar);
