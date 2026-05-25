import React from 'react';
import { useRouter } from 'next/router'; // Hook do NextJS
import nookies from 'nookies';

export default function LoginScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = React.useState('Jessica-Lira');

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <div className="loginScreen">
        <section className="logoArea" style={{ textAlign: 'center' }}>
          
          {/* TEXTO LOGO ORKUT ESTILIZADO INLINE */}
          <span style={{
            fontFamily: "'Century Gothic', 'Apple Gothic', sans-serif",
            fontWeight: 'bold',
            fontSize: '75px',
            color: '#ED2590',
            letterSpacing: '-5px',
            display: 'block',
            marginBottom: '20px',
            userSelect: 'none'
          }}>
            orkut
          </span>

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={(infosDoEvento) => {
                infosDoEvento.preventDefault();
                console.log('Usuário: ', githubUser)
                fetch('https://alurakut.vercel.app/api/login', {
                    method: 'POST',
                    headers: {
                       'Content-Type': 'application/json'  
                    },
                    body: JSON.stringify({ githubUser: githubUser })
                })
                .then(async (respostaDoServer) => {
                    const dadosDaResposta = await respostaDoServer.json()
                    const token = dadosDaResposta.token;
                    nookies.set(null, 'USER_TOKEN', token, {
                        path: '/',
                        maxAge: 86400 * 7 
                    })
                    
                    window.location.replace('/');
                })
          }}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input
                placeholder="Usuário"
                value={githubUser}
                onChange={(evento) => {
                    setGithubUser(evento.target.value)
                }}
            />
            {githubUser.length === 0
                ? 'Preencha o campo'
                : ''
            }
            <button type="submit" style={{ marginBottom: '16px' }}>
              Login
            </button>

            {/* ADICIONADO LINK ABAIXO DO BOTÃO */}
            <div style={{ width: '100%', textAlign: 'center' }}>
              <a href="/login" style={{ color: '#2E7BB9', fontSize: '13px', textDecoration: 'underline' }}>
                Não consegue acessar a sua conta?
              </a>
            </div>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/cadastro">
                <strong>
                  ENTRAR JÁ
                </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            {/* LINK DO REPOSITÓRIO CONFIGURADO NO TEXTO DO RODAPÉ */}
            © 2026 <a href="https://github.com/Jessica-CSchool/Automation-Self-Healing" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit'}}>Estrutura de Projeto</a> - 
            <a href="/">Sobre o Orkut.br</a> - 
            <a href="/">Centro de segurança</a> - 
            <a href="/">Privacidade</a> - 
            <a href="/">Termos</a> - 
            <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
}