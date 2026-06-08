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

export default function FotosPage(props) {
  const usuarioLogado = props.githubUser || 'Jessica-Lira';

  return (
    <>
      {/* Estilos para simular a área vazia do álbum de fotos tradicional */}
      <style dangerouslySetInnerHTML={{__html: `
        .album-vazio {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 16px;
          border: 2px dashed #ECF2FA;
          border-radius: 8px;
          margin-top: 16px;
          background-color: #F1F9FE;
          text-align: center;
        }
        .album-vazio-icone {
          font-size: 48px;
          margin-bottom: 12px;
          opacity: 0.7;
        }
        .album-vazio-texto {
          font-size: 14px;
          color: #5A5A5A;
          line-height: 1.5;
          margin: 0;
        }
        .btn-fake-upload {
          margin-top: 16px;
          border: 0;
          padding: 10px 16px;
          border-radius: 8px;
          background-color: #2E7BB4;
          color: #FFFFFF;
          font-weight: bold;
          font-size: 13px;
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}} />

      <AlurakutMenu githubUser={usuarioLogado} />

      <MainGrid>
        {/* Sidebar */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioLogado} />
        </div>

        {/* Álbum de Fotos */}
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Álbuns de {usuarioLogado}</h1>
            <h2 className="subTitle" style={{ marginTop: '10px' }}>Fotos do perfil e recortes</h2>

            <div className="album-vazio">
              <div className="album-vazio-icone">📷</div>
              <p className="album-vazio-texto">
                <strong>Seu álbum está vazio!</strong><br />
                Você não possui nenhuma foto publicada neste perfil por enquanto.
              </p>
              <button className="btn-fake-upload" disabled>
                Adicionar Fotos
              </button>
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