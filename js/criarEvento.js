const input = document.getElementById('foto');
const preview = document.getElementById('image-preview');
const btnCadastrar = document.querySelector('.btn');
const selectCategoria = document.getElementById('categoria');

// Carrega imagem
input.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => preview.src = e.target.result;
    reader.readAsDataURL(file);
  }
});

// Carrega categorias da API
async function carregarCategorias() {
  try {
    const resposta = await fetch('http://localhost:5050/v1/planify/categoria');
    const dados = await resposta.json();

    selectCategoria.innerHTML = '<option disabled selected>Selecione uma categoria</option>';

    dados.categoria.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id_categoria;
      option.textContent = cat.categoria; // nome da categoria no seu JSON
      selectCategoria.appendChild(option);
    });
    
  } catch (erro) {
    console.error('Erro ao carregar categorias:', erro);
    selectCategoria.innerHTML = '<option disabled selected>Erro ao carregar categorias</option>';
  }
}
carregarCategorias();

// Cadastra evento
btnCadastrar.addEventListener('click', async () => {
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const data_evento = document.getElementById('data').value;
  const horario = document.getElementById('hora').value;
  const local = document.getElementById('local').value;
  const imagem = preview.src || '';
  const limite = parseInt(document.getElementById('limite').value);
  const valor_ingresso = parseFloat(document.getElementById('valor').value);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const id_usuario = usuarioLogado?.id_usuario;

if (!id_usuario) {
  alert("Erro: você precisa estar logado para criar um evento.");
  window.location.href = "login.html";
  return;
}

  const id_categoria = parseInt(selectCategoria.value);

  if (!id_categoria) {
    alert('Selecione uma categoria válida.');
    return;
  }

  const dados = {
    titulo,
    descricao,
    data_evento,
    horario,
    local,
    imagem,
    limite_participante: limite,
    valor_ingresso,
    id_usuario,
    categoria: [{ id_categoria }]
  };

  try {
    const resposta = await fetch('http://localhost:5050/v1/planify/evento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) throw new Error('Erro ao cadastrar evento.');
    alert('Evento criado com sucesso!');
    window.location.href = 'home.html';
  } catch (erro) {
    console.error(erro);
    alert('Erro ao criar evento. Verifique os dados e tente novamente.');
  }
});
