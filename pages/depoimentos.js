import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';

function ProfileSidebar(props) {
  const usuarioSidebar = props.githubUser || 'Jessica-Lira';
  return (
    <Box as="aside"> 
      <img src={`https://github.com/${usuarioSidebar}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${usuarioSidebar}`}>
          @{usuarioSidebar}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function DepoimentosPage(props) {
  const usuarioLogado = props.githubUser || 'Jessica-Lira';
  
  // State inicial com alguns depoimentos nostálgicos de exemplo
  const [depoimentos, setDepoimentos] = React.useState([
    {
      id: '1',
      creatorSlug: 'omariosouto',
      title: 'Mário Souto',
      message: 'Você é 10! Deixando meu depoimento aqui para registrar nossa parceria!'
    },
    {
      id: '2',
      creatorSlug: 'juunegreiros',
      title: 'Ju Negreiros',
      message: 'Não aceita o depoimento se não for verdadeiro hein! Passando para dizer que seu Orkut customizado está ficando lindo demais.'
    }
  ]);

  function handleCriarDepoimento(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);

    const novoDepoimento = {
      title: usuarioLogado, // Nome de quem está enviando
      creatorSlug: usuarioLogado,
      message: dadosDoForm.get('message'),
    };

    fetch('/api/depoimentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoDepoimento)
    })
    .then(async (response) => {
      const dados = await response.json();
      if (dados.registroCriado) {
        setDepoimentos([dados.registroCriado, ...depoimentos]);
        e.target.reset(); // Limpa o campo de texto do formulário
      }
    })
    .catch((err) => console.error(err));
  }

  return (
    <>
      {/* Estilos customizados para a lista de depoimentos ficarem idênticos aos originais */}
      <style dangerouslySetInnerHTML={{__html: `
        .depoimento-item {
          display: flex;
          gap: 16px;
          background-color: #F1F9FE;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }
        .depoimento-item img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
        }
        .depoimento-conteudo {
          flex: 1;
        }
        .depoimento-autor {
          font-size: 14px;
          font-weight: bold;
          color: #2E7BB4;
          margin-bottom: 6px;
          text-decoration: none;
          display: inline-block;
        }
        .depoimento-texto {
          font-size: 13px;
          color: #333333;
          line-height: 1.5;
        }
        textarea {
          width: 100%;
          border: 1px solid #C5C6CA;
          padding: 12px;
          background-color: #FFFFFF;
          border-radius: 8px;
          margin-top: 8px;
          margin-bottom: 12px;
          resize: vertical;
          font-family: sans-serif;
        }
        button {
          border: 0;
          padding: 10px 16px;
          border-radius: 8px;
          background-color: #2E7BB4;
          color: #FFFFFF;
          font-weight: bold;
        }
      `}} />

      <AlurakutMenu githubUser={usuarioLogado} />

      <MainGrid>
        {/* Barra Lateral */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioLogado} />
        </div>

        {/* Área Central Principal */}
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          
          {/* Caixa 1: Criar Novo Depoimento */}
          <Box>
            <h1 className="title">Depoimentos para {usuarioLogado}</h1>
            <h2 className="subTitle" style={{ marginTop: '10px' }}>Escreva uma mensagem especial</h2>
            
            <form onSubmit={handleCriarDepoimento}>
              <div>
                <textarea 
                  name="message" 
                  placeholder="Deixe seu depoimento aqui... (Lembre-se: só aceite se for legal!)"
                  rows="4"
                  required
                />
              </div>
              <button type="submit">Enviar Depoimento</button>
            </form>
          </Box>

          {/* Caixa 2: Listagem dos depoimentos recebidos */}
          <Box>
            <h2 className="subTitle">Depoimentos Recebidos ({depoimentos.length})</h2>
            
            {depoimentos.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#5A5A5A', marginTop: '12px' }}>Nenhum depoimento por enquanto. Seja o primeiro a escrever!</p>
            ) : (
              depoimentos.map((item) => (
                <div key={item.id} className="depoimento-item">
                  <a href={`https://github.com/${item.creatorSlug}`} target="_blank" rel="noopener noreferrer">
                    <img src={`https://github.com/${item.creatorSlug}.png`} alt={item.title} />
                  </a>
                  <div className="depoimento-conteudo">
                    <a href={`https://github.com/${item.creatorSlug}`} target="_blank" rel="noopener noreferrer" className="depoimento-autor">
                      {item.title}
                    </a>
                    <p className="depoimento-texto">{item.message}</p>
                  </div>
                </div>
              ))
            )}
          </Box>

        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.USER_TOKEN;
  const decodedToken = jwt.decode(token);
  const githubUser = decodedToken?.githubUser || null;

  if (!githubUser) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
    return { props: {} }
  }

  return {
    props: {
      githubUser,
    }
  }
}