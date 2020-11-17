// Área de mensagens
const mensagem = document.getElementById("mensagem");

// Lê o id recebido na query string
const obtemId = () => {
  // busca por "top=???" na url atual
  return new URL(document.location.href).searchParams.get("top");
};

// Trata o clique no ícone de curtir um item
const curtir = async (e) => {
  e.preventDefault();
  // Obtém o id e posicao contidos em data-id/data-posicao do link clicado
  const id = e.currentTarget.dataset.id;
  const posicao = e.currentTarget.dataset.posicao;
  // O link já foi clicado?
  if (!localStorage.getItem(`top5.curtidas.id.${id}.posicao.${posicao}`)) {
    // Mensagem de carregamento
    mensagem.innerHTML = "carregando...";
    // Efetua o PATCH
    const url = `/api/Tops/${id}/Itens/${posicao}/curtir`;
    const requestOptions = {
      method: "PATCH",
    };
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      // Sucesso
      const result = await response.json();
      // Atualiza as curtidas
      const curtidas = document.querySelector(
        `a[data-id="${id}"][data-posicao="${posicao}"] > .curtidas`
      );
      curtidas.innerHTML = result.curtidas;
      // Marca como já curtido
      localStorage.setItem(`top5.curtidas.id.${id}.posicao.${posicao}`, true);
      // Limpa mensagem
      mensagem.innerHTML = "";
    } else {
      // Exibe mensagem de erro
      mensagem.innerHTML = "Erro ao curtir.";
    }
  }
};

// Exclui um top
const excluir = async (e) => {
  e.preventDefault();
  // Recupera o id
  const id = obtemId();
  // Mensagem de carregamento
  mensagem.innerHTML = "excluindo...";
  // Efetua o DELETE
  const url = `/api/Tops/${id}`;
  const requestOptions = {
    method: "DELETE",
  };
  const response = await fetch(url, requestOptions);
  if (response.ok) {
    // Sucesso
    const localTop = document.getElementById("visualizar-top");
    // Limpa top
    localTop.innerHTML = "";
    // Mensagem de sucesso
    mensagem.innerHTML = "Excluído com sucesso.";
  } else {
    // Exibe mensagem de erro
    mensagem.innerHTML = "Erro ao excluir.";
  }
};

// Exibe os dados de um top
const exibeTop = (top) => {
  // Div onde ficará o top
  const localTop = document.getElementById("visualizar-top");
  // Insere os campos do top
  localTop.insertAdjacentHTML(
    "beforeend",
    `
        <div>
            <span id="titulo">${top.titulo}</span>
            <span id="curtidas">👍 ${top.curtidas}</span>
        </div>
        <!-- Lista para inserir os itens do top -->
        <ul id="lista-itens-top"></ul>
        <!-- Links para alterar (id na query string) e deletar -->
        <div>
            <a href="alterar.html?top=${top.id}">Alterar</a>
            | <a id="deletar" href="#">Excluir</a>
        </div>        
    `
  );
  const listaItensTop = document.getElementById("lista-itens-top");
  // Insere os itens do top
  top.item.forEach((item) => {
    listaItensTop.insertAdjacentHTML(
      "beforeend",
      `<li>
        <span>#${item.posicao} ${item.nome}</span>
        <!-- Link para curtir um item -->
        <a href="#" data-id="${top.id}" data-posicao="${item.posicao}" class="link-curtir">👍
          <span class="curtidas">${item.curtidas}</span>
        </a>
      </li>`
    );
  });
  // Adiciona o evento de click em todos os links de curtir
  const botoesCurtir = document.querySelectorAll(".link-curtir");
  botoesCurtir.forEach((link) => link.addEventListener("click", curtir));
  // Evento para o link de exclusão
  document.getElementById("deletar").addEventListener("click", excluir);
};

const iniciar = async () => {
  // Mensagem de carregamento
  mensagem.innerHTML = "carregando...";
  // Recupera o id desejado
  const id = obtemId();
  if (id) {
    // Efetua o GET
    const response = await fetch(`/api/Tops/${id}`);
    if (response.ok) {
      // Sucesso
      const result = await response.json();
      exibeTop(result);
      // Limpa mensagem
      mensagem.innerHTML = "";
    } else {
      // Exibe mensagem de erro
      mensagem.innerHTML = `Erro ao carregar o top ${id}.`;
    }
  } else {
    // Exibe mensagem de erro
    mensagem.innerHTML = "Nenhum top a exibir.";
  }
};

document.addEventListener("DOMContentLoaded", iniciar);
