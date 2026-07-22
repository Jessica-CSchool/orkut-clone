import React from 'react';
import nookies from 'nookies';

export default function LogoutPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <p>A terminar sessão no Orkut...</p>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  // Elimina o cookie de autenticação do navegador
  nookies.destroy(ctx, 'USER_TOKEN', {
    path: '/',
  });

  // Redireciona o utilizador de volta para tela de login
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}