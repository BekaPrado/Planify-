const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

let usuarioRecuperado = null;

// Alternar os painéis
registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));

// Verificação do email + palavra-chave
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const palavraChave = document.getElementById('login-senha').value;

  try {
    const response = await fetch('http://localhost:5050/v1/planify/usuario');
    const data = await response.json();

    if (response.ok) {
      const usuarios = data.usuario;

      const encontrado = usuarios.find(u =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.palavra_chave.trim().toLowerCase() === palavraChave.trim().toLowerCase()
      );

      if (encontrado) {
        // Padronizar os campos para usar no PUT
        usuarioRecuperado = {
          id: encontrado.id_usuario, // Usa id_usuario corretamente
          nome: encontrado.nome,
          email: encontrado.email,
          senha: encontrado.senha,
          data_nascimento: encontrado.data_nascimento.split('T')[0], // "2000-05-22"
          palavra_chave: encontrado.palavra_chave,
          foto_perfil: encontrado.foto_perfil
        };
        container.classList.add('active');
      } else {
        alert('❌ Palavra-chave ou email incorretos.');
      }
    } else {
      alert('❌ Erro ao buscar usuários: ' + data.message);
    }
  } catch (error) {
    alert('❌ Erro na requisição: ' + error.message);
  }
});

// Redefinir a senha
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const novaSenha = document.getElementById('nova-senha').value;
  const confirmarSenha = document.getElementById('confirmar-senha').value;

  if (novaSenha !== confirmarSenha) {
    return alert('❌ As senhas não coincidem.');
  }

  if (novaSenha.length > 20) {
    return alert('❌ A nova senha deve ter no máximo 20 caracteres.');
  }

  if (!usuarioRecuperado || !usuarioRecuperado.id) {
    return alert('❌ Usuário não identificado. Volte e tente novamente.');
  }

  const dadosAtualizados = {
    nome: usuarioRecuperado.nome,
    email: usuarioRecuperado.email,
    senha: novaSenha,
    data_nascimento: usuarioRecuperado.data_nascimento,
    palavra_chave: usuarioRecuperado.palavra_chave,
    foto_perfil: usuarioRecuperado.foto_perfil
  };

  try {
    const response = await fetch(`http://localhost:5050/v1/planify/usuario/${usuarioRecuperado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados)
    });

    if (response.ok) {
      alert('✅ Senha redefinida com sucesso!');
      window.location.href = 'index.html';
    } else {
      const result = await response.json();
      alert('❌ Erro ao redefinir senha: ' + result.message);
    }
  } catch (error) {
    alert('❌ Erro: ' + error.message);
  }
});
