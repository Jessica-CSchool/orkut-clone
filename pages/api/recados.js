// pages/api/recados.js
import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
  if (request.method === 'POST') {
    const TOKEN = 'cc1daaba3f28a069174d1956082251'; 
    const client = new SiteClient(TOKEN);

    try {
      const registroCriado = await client.items.create({
        itemType: "654321", // Altere para o ID do Model de Recados do seu DatoCMS, se tiver
        title: request.body.title,
        creatorSlug: request.body.creatorSlug,
        message: request.body.message,
      });

      return response.json({
        registroCriado: registroCriado,
      });
    } catch (error) {
      // Fallback local caso queira rodar sem mexer no DatoCMS agora
      return response.json({
        registroCriado: {
          id: new Date().toISOString(),
          title: request.body.title,
          creatorSlug: request.body.creatorSlug,
          message: request.body.message,
          date: new Date().toLocaleDateString('pt-BR')
        }
      });
    }
  }

  response.status(405).json({ message: 'Método não permitido' });
}