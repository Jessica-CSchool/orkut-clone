import React from 'react';
import Head from 'next/head';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { createGlobalStyle } from 'styled-components';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

const OrkutLogoStyle = createGlobalStyle`
  header img[src*="logo.svg"] { display: none !important; }
  #orkut-logo-text {
    background-color: #ffffff; padding: 7px 18px; border-radius: 50px;
    display: inline-flex; align-items: center; justify-content: center; margin-right: 20px;
    font-family: 'Century Gothic', sans-serif; font-weight: bold; font-size: 20px;
    color: #ED2590; letter-spacing: -1.5px; cursor: pointer; text-transform: lowercase;
  }
  header > div { display: flex; align-items: center; }
`;

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

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const containerMenu = document.querySelector('header > div');
        if (containerMenu && !document.querySelector('#orkut-logo-text')) {
          const novoLogoTexto = document.createElement('span');
          novoLogoTexto.id = 'orkut-logo-text'; novoLogoTexto.innerText = 'orkut';
          novoLogoTexto.onclick = () => { window.location.href = '/'; };
          containerMenu.insertBefore(novoLogoTexto, containerMenu.firstChild);
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <Head><title>Meus Amigos - Orkut</title></Head>
      <OrkutLogoStyle />
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea', gridColumnStart: '2', gridColumnEnd: '4' }}>
          <Box>
            <h1 className="title" style={{ marginBottom: '20px' }}>Meus Amigos</h1>
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
    return { redirect: { destination: '/login', permanent: false } };
  }

  return { props: { githubUser } };
}