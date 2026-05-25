import React from 'react';
import Head from 'next/head';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside"> 
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>@{propriedades.githubUser}</a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export default function AmigosPage(props) {
  const usuarioAleatorio = props.githubUser;
  const personasFavoritas = ['juunegreiros', 'omariosouto', 'peas'];

  return (
    <>
      <Head><title>Meus Amigos - Orkut</title></Head>
      
      {/* O menu agora renderiza limpo, usando a logo única do AlurakutCommons */}
      <AlurakutMenu githubUser={usuarioAleatorio} />
      
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea', gridColumnStart: '2', gridColumnEnd: '4' }}>
          <Box>
            <h1 className="title" style={{ marginBottom: '20px' }}>Meus Amigos ({personasFavoritas.length})</h1>
            <ProfileRelationsBoxWrapper>
              <ul>
                {personasFavoritas.map((itemAtual) => (
                  <li key={itemAtual} style={{ display: 'inline-block', margin: '10px', textAlign: 'center' }}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} style={{ borderRadius: '8px', width: '100px' }} />
                      <span style={{ display: 'block', marginTop: '5px' }}>{itemAtual}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </ProfileRelationsBoxWrapper>
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
  const githubUser = decodedToken?.githubUser;

  if (!githubUser) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
    return { props: {} };
  }

  return { props: { githubUser } };
}