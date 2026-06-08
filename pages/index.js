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

// Lista de frases movida para fora para poupar memória do navegador
const frasesDeSorte = [
  "A vontade das pessoas é a melhor das leis.",
  "O amor está mais perto do que você imagina.",
  "Grandes novidades vão surgir nos seus depoimentos esta semana.",
  "Alguém visitou seu perfil recentemente, mas não deixou recado.",
  "A resposta que você procura está na próxima atualização da página.",
  "Sorria! Uma nova comunidade incrível te aguarda hoje."
];

function ProfileSidebar(props) {
  const usuarioSidebar = props.githubUser || 'Jessica-Lira';

  return (
    <Box as="aside"> 
      <img src={`https://github.com/${usuarioSidebar}.png`} style={{ borderRadius: '8px' }} alt="Profile" />
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
  // CORREÇÃO: Garante que se o estado vier quebrado/indefinido por falha da API, vira um array vazio seguro
  const listaItens = Array.isArray(props.items) ? props.items : [];

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
                <img src={itemAtual.avatar_url} alt={itemAtual.login} />
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
  const [sorteDoDia, setSorteDoDia] = React.useState('');

  const personasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
  ];

  React.useEffect(function () {
    // Escolhe a frase da sorte apenas uma vez ao montar o componente
    const fraseAleatoria = frasesDeSorte[Math.floor(Math.random() * frasesDeSorte.length)];
    setSorteDoDia(fraseAleatoria);

    if (!usuarioAleatorio) return;

    // CORREÇÃO: Tratamento rigoroso da API do GitHub contra erros de limite de requisições
    fetch(`https://api.github.com/users/${usuarioAleatorio}/followers`)
      .then((respostaDoServidor) => {
        if (respostaDoServidor.ok) {
          return respostaDoServidor.json();
        }
        throw new Error('Erro ao buscar dados do GitHub');
      })
      .then((respostaCompleta) => {
        if (Array.isArray(respostaCompleta)) {
          setSeguidores(respostaCompleta);
        } else {
          setSeguidores([]);
        }
      })
      .catch((e) => {
        console.error(e);
        setSeguidores([]); 
      });

    // Busca de comunidades no db
      fetch('/api/comunidades')
        .then((response) => response.json())
        .then((comunidadesVindasDoBanco) => {
          // Garante que se vier um formato inesperado, vira array vazio seguro
          setComunidades(Array.isArray(comunidadesVindasDoBanco) ? comunidadesVindasDoBanco : []);
        })
        .catch((e) => {
          console.error('Erro ao buscar comunidades locais na Home:', e);
          setComunidades([]);
        });

  }, [usuarioAleatorio]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .sorte-de-hoje-container { margin-top: 12px; font-size: 13px; color: #333333; font-family: sans-serif; }
        .sorte-de-hoje-container strong { font-weight: bold; }
        .aviso-orkut { margin-top: 14px; padding: 8px 12px; background-color: #FFFEE3; border-radius: 4px; font-size: 13px; color: #333333; font-family: sans-serif; }
        .aviso-orkut strong { color: #CC0000; font-weight: bold; }
        .estatisticas-perfil { margin-top: 20px; border-radius: 8px; font-size: 13px; color: #555555; font-family: sans-serif; line-height: 1.7; }
        .estatisticas-perfil strong { color: #333333; }
        .estatisticas-perfil a { color: #2E7BB2; text-decoration: none; font-weight: bold; }
        .estatisticas-perfil a:hover { text-decoration: underline; }
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

            <div className="estatisticas-perfil">
              <p>
                <strong>Visualizações de seu perfil:</strong> Desde Jun. 2025: 156, Semana passada: 8, Ontem: 2
              </p>

              <p>
                <strong>Seus visitantes recentes:</strong>{' '}
                <a href="#">juunegreiros</a>,{' '}
                <a href="#">omariosouto</a>,{' '}
                <a href="#">peas</a>
              </p>
            </div>

            <div className="sorte-de-hoje-container">
              <strong>Sorte de hoje:</strong> {sorteDoDia}
            </div>

            <div className="aviso-orkut">
              <strong>Aviso:</strong> O orkut não tem vínculo com o Google.
            </div>
          </Box>

        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          
          {/* Caixa de Seguidores (GitHub Assíncrono) */}
          <ProfileRelationsBox title="Seguidores" items={seguidores} />

          {/* Caixa de Amigos (Array Local) */}
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Amigos ({personasFavoritas.length})
            </h2>
            <ul>
              {personasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} >
                      <img src={`https://github.com/${itemAtual}.png`} alt={itemAtual} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          {/* Caixa de Comunidades (DatoCMS) */}
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades ? comunidades.length : 0})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      {/* CORREÇÃO: Garante o uso da propriedade unificada 'imageUrl' ou o fallback oficial */}
                      <img src={itemAtual.imageUrl || 'https://alurakut.vercel.app/capa-comunidade-01.jpg'} alt={itemAtual.title} />
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
    // CORREÇÃO: Sintaxe nativa do Next.js para redirecionamento limpo no ServerSideProps
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      githubUser,
    }
  }
}