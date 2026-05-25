// pages/recados.js
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

export default function RecadosPage(props) {
  const usuarioLogado = props.githubUser || 'Jessica-Lira';
  
  // Estado inicial populado com alguns scraps clássicos de exemplo
  const [recados, setRecados] = React.useState([
    {
      id: '1',
      creatorSlug: 'rafaballerini',
      title: 'Rafa Ballerini',
      message: 'Oii! Passando para deixar um scrap e dizer que amei seu perfil! Add aí depois pra gente virar amg! Beijos! 🌟',
      date: '24/05/2026'
    },
    {
      id: '2',
      creatorSlug: 'peas',
      title: 'Paulo Silveira',
      message: '[purple]Só passei para deixar um alô![/purple] Não apaga esse recado hein! Abraços!',
      date: '23/05/2026'
    }
  ]);

  function handleCriarRecado(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);

    const novoRecado = {
      title: usuarioLogado,
      creatorSlug: usuarioLogado,
      message: dadosDoForm.get('message'),
    };

    fetch('/api/recados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoRecado)
    })
    .then(async (response) => {
      const dados = await response.json();
      if (dados.registroCriado) {
        setRecados([dados.registroCriado, ...recados]);
        e.target.reset(); // Reseta o campo de texto
      }
    })
    .catch((err) => console.error(err));
  }

  return (
    <>
      {/* Estilização focada no formato de linha de Scraps clássico */}
      <style dangerouslySetInnerHTML={{__html: `
        .recado-item {
          display: flex;
          gap: 16px;
          background-color: #FFFFFF;
          padding: 14px;
          border: 1px solid #ECF2FA;
          border-radius: 8px;
          margin-top: 12px;
        }
        .recado-item:nth-child(even) {
          background-color: #F1F9FE; /* Altera as cores de fundo alternando as linhas */
        }
        .recado-item img {
          width: 50px;
          height: 50px;
          border-radius: 8px;
        }
        .recado-conteudo {
          flex: 1;
        }
        .recado-topo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .recado-autor {
          font-size: 13px;
          font-weight: bold;
          color: #2E7BB4;
          text-decoration: none;
        }
        .recado-data {
          font-size: 11px;
          color: #999999;
        }
        .recado-texto {
          font-size: 13px;
          color: #333333;
          line-height: 1.4;
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
        {/* Sidebar */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioLogado} />
        </div>

        {/* Mural Central */}
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          
          {/* Caixa 1: Formulário de Novo Scrap */}
          <Box>
            <h1 className="title">Mural de Recados de {usuarioLogado}</h1>
            <h2 className="subTitle" style={{ marginTop: '10px' }}>Deixe um scrap rápido</h2>
            
            <form onSubmit={handleCriarRecado}>
              <div>
                <textarea 
                  name="message" 
                  placeholder="Escreva algo legal no mural... [Deixe seu alô!]"
                  rows="3"
                  required
                />
              </div>
              <button type="submit">Postar Recado</button>
            </form>
          </Box>

          {/* Caixa 2: Lista de mensagens públicas */}
          <Box>
            <h2 className="subTitle">Scraps Recebidos ({recados.length})</h2>
            
            <div style={{ marginTop: '8px' }}>
              {recados.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#5A5A5A' }}>Nenhum recado por aqui ainda.</p>
              ) : (
                recados.map((item) => (
                  <div key={item.id} className="recado-item">
                    <a href={`https://github.com/${item.creatorSlug}`} target="_blank" rel="noopener noreferrer">
                      <img src={`https://github.com/${item.creatorSlug}.png`} alt={item.title} />
                    </a>
                    <div className="recado-conteudo">
                      <div className="recado-topo">
                        <a href={`https://github.com/${item.creatorSlug}`} target="_blank" rel="noopener noreferrer" className="recado-autor">
                          {item.title}
                        </a>
                        <span className="recado-data">{item.date || 'Hoje'}</span>
                      </div>
                      <p className="recado-texto">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
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