import React from 'react';
import { useRouter } from 'next/router';

export default function CadastroScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = React.useState('');
  const [mensagem, setMensagem] = React.useState(null);

  async function handleCadastro(e) {
    e.preventDefault();
    setMensagem('A processar...');

    try {
      const resposta = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUser }),
      });

      if (resposta.ok) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = '/login'; 
      } else {
        const erro = await resposta.json();
        setMensagem(erro.error || 'Erro ao realizar cadastro.');
      }
    } catch (err) {
      setMensagem('Erro de conexão. Verifique se a API está rodando.');
    }
  }

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#D9E6F6', fontFamily: 'sans-serif' }}>
      
      {/* Estilo para centralizar e dar o look nostálgico */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%', padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        
        <span style={{ fontSize: '60px', fontWeight: 'bold', color: '#ED2590', marginBottom: '20px' }}>orkut</span>
        
        <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '20px' }}>Criar conta</h2>
        
        <form onSubmit={handleCadastro} style={{ width: '100%' }}>
          <input 
            placeholder="Nome de usuário no GitHub" 
            value={githubUser} 
            onChange={(e) => setGithubUser(e.target.value)} 
            style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #C5C6CA', borderRadius: '8px' }}
          />
          
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2E7BB4', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Cadastrar
          </button>
        </form>

        {mensagem && (
          <p style={{ marginTop: '15px', color: '#CC0000', fontSize: '14px', fontWeight: 'bold' }}>
            {mensagem}
          </p>
        )}

        <p style={{ marginTop: '20px', fontSize: '12px' }}>
          Já possui uma conta? <a href="/login" style={{ color: '#2E7BB4', textDecoration: 'underline' }}>Entrar agora</a>
        </p>
      </div>
    </main>
  );
}