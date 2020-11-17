// Área de mensagens
const mensagem = document.getElementById("mensagem");

// Inclui o novo top
const incluir = async (e) => {
  e.preventDefault();
  // Monta objeto top com os valores digitados
  const titulo = document.getElementById("titulo").value;
  const item = [];
  item.push({ posicao: 1, nome: document.getElementById("item-1").value });
  item.push({ posicao: 2, nome: document.getElementById("item-2").value });
  item.push({ posicao: 3, nome: document.getElementById("item-3").value });
  item.push({ posicao: 4, nome: document.getElementById("item-4").value });
  item.push({ posicao: 5, nome: document.getElementById("item-5").value });
  const novoTop = {
    titulo,
    item,
  };
  // Validação: título obrigatório
  if (novoTop.titulo) {
    // Válido, pois possui título
    // Mensagem de carregamento
    mensagem.innerHTML = "salvando...";
    // Efetua o POST
    const url = "/api/Tops";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoTop),
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    if (response.ok) {
      // Sucesso
      // Mensagem de sucesso, com link de visualização
      mensagem.innerHTML = `<a href="visualizar.html?top=${result.id}">Top salvo</a> com sucesso.`;
    } else {
      // Exibe mensagem de erro
      mensagem.innerHTML = `Erro ao salvar o top.<br>${result.mensagem}`;
    }
  } else {
    // Inválido, pois não possui título
    mensagem.innerHTML = "Título não informado.";
  }
};

const iniciar = () => {
  // Adiciona evento de submit no form
  document.forms[0].addEventListener("submit", incluir);
};

document.addEventListener("DOMContentLoaded", iniciar);
