import React from 'react';
import Head from 'next/head';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';

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

export default function ComunidadesPage(props) {
  const usuarioAleatorio = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);

  React.useEffect(() => {
    fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Authorization': 'cc1daaba3f28a069174d1956082251',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ "query": `query {
          allCommunities {
            id 
            title
            imageUrl
            creatorSlug
          }
        }` })
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
        if (respostaCompleta?.data?.allCommunities) {
            setComunidades(respostaCompleta.data.allCommunities);
        }
    })
    .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Head><title>Minhas Comunidades - Orkut</title></Head>
      
      {/* O menu agora entra de forma limpa, confiando na pílula do Orkut nativa que criamos */}
      <AlurakutMenu githubUser={usuarioAleatorio} />
      
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea', gridColumnStart: '2', gridColumnEnd: '4' }}>
          <Box>
            <h1 className="title" style={{ marginBottom: '20px' }}>Minhas Comunidades ({comunidades.length})</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
              {comunidades.map((comunidade) => (
                <div key={comunidade.id} style={{ textAlign: 'center' }}>
                  <a href={`/users/${comunidade.title}`} style={{ textDecoration: 'none', color: '#2E7BB9' }}>
                    <img src={comunidade.imageUrl || 'https://placehold.co/300x300?text=Sem+Foto'} style={{ borderRadius: '8px', width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                    <span style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '14px', marginTop: '5px' }}>
                      {comunidade.title}
                    </span>
                  </a>
                </div>
              ))}
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
  const githubUser = decodedToken?.githubUser;

  if (!githubUser) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
    return { props: {} };
  }

  return { props: { githubUser } };
}