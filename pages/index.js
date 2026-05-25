import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { 
  AlurakutMenu, 
  OrkutNostalgicIconSet, 
  AlurakutProfileSidebarMenuDefault 
} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

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

function ProfileRelationsBox(props) {
  const listaItens = props.items || [];

  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({listaItens.length})
      </h2>
      <ul>
        {listaItens.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={itemAtual.html_url} target="_blank" rel="noopener noreferrer">
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          ); 
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const usuarioAleatorio = props.githubUser || 'Jessica-Lira';

  const [comunidades, setComunidades] = React.useState([]);
  const [seguidores, setSeguidores] = React.useState([]);

  // Lista nostálgica de frases para a Sorte de Hoje
  const frasesDeSorte = [
    "A vontade das pessoas é a melhor das leis.",
    "O amor está mais perto do que você imagina.",
    "Grandes novidades vão surgir nos seus depoimentos esta semana.",
    "Alguém visitou seu perfil recentemente, mas não deixou recado.",
    "A resposta que você procura está na próxima atualização da página.",
    "Sorria! Uma nova comunidade incrível te aguarda hoje."
  ];

  const [sorteDoDia, setSorteDoDia] = React.useState('');

  const personasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
  ];

  React.useEffect(function () {
    // Escolhe a frase aleatória assim que a página carrega
    const fraseAleatoria = frasesDeSorte[Math.floor(Math.random() * frasesDeSorte.length)];
    setSorteDoDia(fraseAleatoria);

    if (!usuarioAleatorio) return;

    fetch(`https://api.github.com/users/${usuarioAleatorio}/followers`)
      .then((respostaDoServidor) => respostaDoServidor.json())
      .then((respostaCompleta) => {
        if (Array.isArray(respostaCompleta)) {
          setSeguidores(respostaCompleta);
        }
      })
      .catch((e) => console.error(e));

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
      const comunidadesVindasDoDato = respostaCompleta?.data?.allCommunities || [];
      setComunidades(comunidadesVindasDoDato);
    })
    .catch((e) => console.error(e));

  }, [usuarioAleatorio]);

  return (
    <>
      {/* CSS local apenas para estilizar a linha da Sorte de Hoje e o Aviso do Orkut */}
      <style dangerouslySetInnerHTML={{__html: `
        .sorte-de-hoje-container {
          margin-top: 24px;
          font-size: 13px;
          color: #333333;
          font-family: sans-serif;
        }
        
        .sorte-de-hoje-container strong {
          font-weight: bold;
        }

        .aviso-orkut {
          margin-top: 14px;
          padding: 8px 12px;
          background-color: #FFFEE3;
          border-radius: 4px;
          font-size: 13px;
          color: #333333;
          font-family: sans-serif;
        }

        .aviso-orkut strong {
          color: #CC0000;
          font-weight: bold;
        }
      `}} />

      <AlurakutMenu githubUser={usuarioAleatorio} />
      
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a), {usuarioAleatorio}
            </h1>
            <OrkutNostalgicIconSet />

            {/* Injeção da Sorte de Hoje e do Aviso exatamente como no print */}
            <div className="sorte-de-hoje-container">
              <strong>Sorte de hoje:</strong> {sorteDoDia}
            </div>

            <div className="aviso-orkut">
              <strong>Aviso:</strong> O orkut não tem vínculo com o Google.
            </div>
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                const comunidad = {
                  title: dadosDoForm.get('title'),
                  image: dadosDoForm.get('image'),
                  creatorSlug: usuarioAleatorio,
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidad)
                })
                .then(async (response) => {
                  const dados = await response.json();
                  const registroNovo = dados.registroCriado;
                  if (registroNovo) {
                    setComunidades([...comunidades, registroNovo]);
                  }
                })
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>

        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox title="Seguidores" items={seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Amigos ({personasFavoritas.length})
            </h2>
            <ul>
              {personasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} >
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades ? comunidades.length : 0})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`}>
                      <img src={itemAtual.imageUrl || itemAtual.image || 'https://alurakut.vercel.app/capa-comunidade-01.jpg'} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.USER_TOKEN;
  const decodedToken = jwt.decode(token);
  const githubUser = decodedToken?.githubUser || null;

  if (!githubUser) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
    return {
      props: {} 
    }
  }

  return {
    props: {
      githubUser,
    }
  }
}