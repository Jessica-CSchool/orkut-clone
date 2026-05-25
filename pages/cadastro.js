import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createGlobalStyle } from 'styled-components';

const CadastroOrkutStyles = createGlobalStyle`
  body {
    background-color: #D4E2F4;
    font-family: sans-serif;
  }
  .logoArea img {
    display: none !important;
  }
  .logoArea::before {
    content: 'orkut';
    font-family: 'Century Gothic', sans-serif;
    font-weight: bold;
    font-size: 50px;
    color: #ED2590;
    letter-spacing: -3px;
    display: block;
    margin-bottom: 20px;
  }
  .successMessage {
    background-color: #D4EDDA;
    color: #155724;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    font-size: 14px;
    text-align: center;
  }
`;

export default function CadastroScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = React.useState('');
  const [status, setStatus] = React.useState('idle'); // idle, loading, success, error

  function handleCadastro(infosDoEvento) {
    infosDoEvento.preventDefault();
    
    if (githubUser.trim().length === 0) {
      return;
    }

    setStatus('loading');

    // Aqui você pode integrar com o DatoCMS criando um Model de "Usuários" se quiser salvar a lista de membros do seu Orkut.
    // Para manter o fluxo SPA funcional de imediato:
    setTimeout(() => {
      setStatus('success');
      
      // Espera 2 segundos exibindo a mensagem de sucesso e joga a pessoa de volta para o Login com o campo preenchido
      setTimeout(() => {
        router.push(`/login`);
      }, 2000);
    }, 1000);
  }

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Head>
        <title>Criar Perfil - Orkut</title>
      </Head>
      <CadastroOrkutStyles />
      
      <div className="loginScreen">
        <section className="logoArea">
          <div style={{ visibility: 'hidden', height: 0 }}><img src="https://alurakut.vercel.app/logo.svg" /></div>
          <p><strong>Crie o seu perfil</strong> num segundo bastando informar o seu utilizador do GitHub.</p>
          <p><strong>Traga as suas fotos</strong>, repositórios e conexões diretamente para a rede social.</p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={handleCadastro}>
            <p style={{ marginBottom: '15px', fontSize: '14px' }}>
              Digite o seu usuário do <strong>GitHub</strong> para criar a sua conta no Orkut:
            </p>
            
            {status === 'success' && (
              <div className="successMessage">
                ¡Perfil criado com sucesso! Redirecionando...
              </div>
            )}

            <input
              placeholder="Ex: Jessica-Lira"
              value={githubUser}
              onChange={(evento) => setGithubUser(evento.target.value)}
              disabled={status === 'loading' || status === 'success'}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #C5C6CA',
                marginBottom: '10px'
              }}
            />

            {githubUser.trim().length === 0 && (
              <span style={{ color: '#ED2590', fontSize: '12px', display: 'block', marginBottom: '10px' }}>
                * Preenchimento obrigatório
              </span>
            )}

            <button 
              type="submit" 
              disabled={githubUser.trim().length === 0 || status === 'loading' || status === 'success'}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2E7BB9',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {status === 'loading' ? 'A criar conta...' : 'Criar Conta no Orkut'}
            </button>
          </form>

          <footer className="box">
            <p>
              Já possui uma conta? <br />
              <a href="/login" style={{ color: '#2E7BB9', textDecoration: 'none', fontWeight: 'bold' }}>
                FAZER LOGIN AGORA
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © Orkut.br - <a href="/">Sobre o Orkut</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a>
          </p>
        </footer>
      </div>
    </main>
  );
}