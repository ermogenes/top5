// Área de mensagens
const mensagem = document.getElementById("mensagem");

// Trata o clique no ícone de curtir um top
const curtir = async (e) => {
  e.preventDefault();
  // Obtém o id contido em data-id do link clicado
  const id = e.currentTarget.dataset.id;
  // O link já foi clicado?
  if (!localStorage.getItem(`top5.curtidas.id.${id}`)) {
    // Mensagem de carregamento
    mensagem.innerHTML = "carregando...";
    // Efetua o PATCH
    const url = `/api/Tops/${id}/curtir`;
    const requestOptions = {
      method: "PATCH",
    };
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      // Sucesso
      const result = await response.json();
      // Atualiza as curtidas
      const curtidas = document.querySelector(`a[data-id="${id}"] > .curtidas`);
      curtidas.innerHTML = result.curtidas;
      // Marca como já curtido
      localStorage.setItem(`top5.curtidas.id.${id}`, true);
      // Limpa mensagem
      mensagem.innerHTML = "";
    } else {
      // Exibe mensagem de erro
      mensagem.innerHTML = "Erro ao curtir.";
    }
  }
};

// Exibe a lista de tops
const exibeTops = (tops) => {
  const listaLinks = document.getElementById("lista-links");
  // Adiciona tops na lista
  tops.forEach((top) => {
    // Cada top recebe um link com seu id para visualizar, e um para curtir
    // Visualizar: o link leva para a página com a query string top=id
    // Curtir: fica na mesma página, e o id fica no dataset
    listaLinks.insertAdjacentHTML(
      "beforeend",
      `<li>
          <!-- Link para visualizar um top -->
          <a href="visualizar.html?top=${top.id}">${top.titulo}</a>
          <!-- Link para curtir um top -->
          <a href="#" data-id="${top.id}" class="link-curtir">👍
            <span class="curtidas">${top.curtidas}</span>
          </a>
      </li>`
    );
  });
  // Adiciona o evento de click em todos os links de curtir
  const botoesCurtir = document.querySelectorAll(".link-curtir");
  botoesCurtir.forEach((link) => link.addEventListener("click", curtir));
};

// Busca tops filtrados
const buscar = async (e) => {
  e.preventDefault();
  // Obtém o título a buscar
  const tituloDesejado = document.getElementById("titulo").value;
  // Zera a lista
  document.getElementById("lista-links").innerHTML = "";
  // Mensagem de carregamento
  mensagem.innerHTML = "carregando...";
  // Efetua o GET
  const response = await fetch(`/api/Tops?titulo=${tituloDesejado}`);
  if (response.ok) {
    // Sucesso
    const result = await response.json();
    exibeTops(result);
    // Limpa mensagem
    mensagem.innerHTML = "";
  } else {
    // Exibe mensagem de erro
    mensagem.innerHTML = "Erro ao carregar os tops.";
  }
};

// Busca a lista de tops
const iniciar = async () => {
  // Adiciona evento do botão de busca
  document.getElementById("buscar").addEventListener("click", buscar);
  // Mensagem de carregamento
  mensagem.innerHTML = "carregando...";
  // Efetua o GET
  const response = await fetch("/api/Tops");
  if (response.ok) {
    // Sucesso
    const result = await response.json();
    exibeTops(result);
    // Limpa mensagem
    mensagem.innerHTML = "";
  } else {
    // Exibe mensagem de erro
    mensagem.innerHTML = "Erro ao carregar os tops.";
  }
};

document.addEventListener("DOMContentLoaded", iniciar);
