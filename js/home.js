const selectCategoria = document.getElementById('categoria');
const API_URL = 'http://localhost:8080/v1/planify/evento';
const container = document.getElementById('eventos-container');
document.addEventListener('DOMContentLoaded', loadEventos);
let todosEventos = [];







selectCategoria.addEventListener('change', () => {
  const categoriaSelecionada = selectCategoria.value;
  if (!categoriaSelecionada) {
    renderizarEventos(todosEventos);
    return;
  }

  const eventosFiltrados = todosEventos.filter(e =>
    Array.isArray(e.categoria) &&
    e.categoria.some(cat => String(cat.id_categoria) === categoriaSelecionada)
  );

  renderizarEventos(eventosFiltrados);
});




async function loadEventos() {
  try {
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const id_usuario_logado = usuarioLogado?.id_usuario;

    container.innerHTML = '';

    dados.eventos.forEach(e => {
      const usuario = e.usuario[0] || {};
      console.log("Resposta da API:", dados);

      const categoria = Array.isArray(e.categoria)
      ? e.categoria.map(cat => cat.categoria).join(", ")
      : "Sem categoria";
    
      // Formatação de data
      const data = new Date(e.data_evento).toLocaleDateString('pt-BR');
      const hora = new Date(e.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const valor = parseFloat(e.valor_ingresso).toFixed(2);

      const card = document.createElement('div');
      card.classList.add('card-evento');
      card.innerHTML = `
        <img src="${e.imagem}" alt="${e.titulo}" style="width: 100%; border-radius: 10px; max-height: 180px; object-fit: cover;" />
        <h3>${e.titulo}</h3>
        <p>${e.descricao}</p>
        <p><strong>Data:</strong> ${data} às ${hora}</p>
        <p><strong>Local:</strong> ${e.local}</p>
        <p><strong>Ingresso:</strong> R$ ${valor}</p>
        <p><strong>Categoria:</strong> ${categoria}</p>
        <p><strong>Organizador:</strong> ${usuario.nome || 'Desconhecido'} ${usuario.id_usuario === id_usuario_logado ? "(você)" : ""}</p>
        <a href="${e.linkCompra}" class="compra">Comprar</a>
      `;
      container.appendChild(card);
    });

    if (dados.eventos.length === 0) {
      container.innerHTML = '<p>Nenhum evento encontrado.</p>';
    }

  } catch (erro) {
    console.error('Erro ao carregar eventos:', erro);
    container.innerHTML = '<p>Não foi possível carregar os eventos.</p>';
  }
}


// Carrega categorias da API
async function carregarCategorias() {
  try {
    const resposta = await fetch('http://localhost:8080/v1/planify/categoria');
    const dados = await resposta.json(); // dados declarado e inicializado aqui
    console.log("Categorias recebidas:", dados);

    selectCategoria.innerHTML = '<option disabled selected>Selecione uma categoria</option>';

    const categorias = dados.categoria || dados; // aqui usamos dados já inicializado

    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id_categoria;
      option.textContent = cat.categoria;
      selectCategoria.appendChild(option);

      
    });

  } catch (erro) {
    console.error('Erro ao carregar categorias:', erro);
    selectCategoria.innerHTML = '<option disabled selected>Erro ao carregar categorias</option>';
  }
}
carregarCategorias();