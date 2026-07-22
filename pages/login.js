import React from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';

export default function LoginScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = React.useState('Jessica-CSchool');
  const [erro, setErro] = React.useState(null); 

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#D9E6F6' }}>
      <style jsx global>{`
        .loginScreen { display: grid; grid-template-columns: 1fr; gap: 16px; max-width: 900px; width: 100%; padding: 16px; }
        @media(min-width: 860px) { .loginScreen { grid-template-columns: 2fr 1fr; } }
        .logoArea { background: #FFFFFF; padding: 40px; border-radius: 8px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .formArea { display: flex; flex-direction: column; gap: 16px; }
        .box { background: #F1F9FE; padding: 24px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; }
        .footerArea { background: #BBCDE8; padding: 16px; border-radius: 8px; grid-column: 1 / -1; text-align: center; font-size: 12px; }
        input { width: 100%; padding: 12px; margin: 16px 0; border: 1px solid #C5C6CA; border-radius: 8px; }
        button { width: 100%; padding: 12px; border: 0; border-radius: 8px; background-color: #2E7BB4; color: white; font-weight: bold; cursor: pointer; }
        .mensagemErro { color: #CC0000; font-size: 13px; font-weight: bold; margin-bottom: 10px; }
      `}</style>

      <div className="loginScreen">
        <section className="logoArea">
          <span style={{ fontSize: '75px', color: '#ED2590', fontWeight: 'bold', marginBottom: '20px' }}>orkut</span>
          <div>
          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
          </div>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={async (e) => {
            e.preventDefault();
            setErro(null); 

            const respostaLocal = await fetch(`/api/cadastro?githubUser=${githubUser}`);

            if (respostaLocal.ok) {
              fetch('https://alurakut.vercel.app/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ githubUser: githubUser })
              })
              .then(async (res) => {
                const dados = await res.json();
                nookies.set(null, 'USER_TOKEN', dados.token, { path: '/', maxAge: 86400 * 7 });
                window.location.replace('/');
              });
            } else {
              setErro('Utilizador não cadastrado no banco local!');
            }
          }}>
            <p>Acesse com seu usuário do <strong>GitHub</strong>!</p>
            
            {erro && <p id="msgErroUser" className="mensagemErro" data-testid="mensagem-erro">{erro}</p>}
            
            <input
              placeholder="Usuário"
              //placeholder="User"//------------------------------------SELF_HEALING
              //placeholder="Random2468@github.com"//------------------------------------SELF_HEALING_ALEATORIO
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
            />
            <button type="submit">Login</button>
            <a href="/login" style={{ color: '#2E7BB9', fontSize: '13px', marginTop: '10px' }}>Não consegue acessar a sua conta?</a>
          </form>

          <footer className="box">
            <div style={{ textAlign: 'center', margin: 0 }}>
            <p>Ainda não é membro? <br />
              <a href="/cadastro" style={{ textAlign: 'center', margin: 0 }}>
                <strong style={{ textAlign: 'center', margin: 0 }}>ENTRAR JÁ</strong>
              </a>
            </p>
            </div>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
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