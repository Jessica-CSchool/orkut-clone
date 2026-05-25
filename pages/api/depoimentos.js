// pages/api/depoimentos.js
import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
  if (request.method === 'POST') {
    // Substitua pelo seu Token de gravação do DatoCMS se quiser salvar lá direto
    const TOKEN = 'cc1daaba3f28a069174d1956082251'; 
    const client = new SiteClient(TOKEN);

    // Cria o registro baseado no Model que você criar no Dato (ex: "Testimonial")
    // Se não tiver o Dato configurado para isso ainda, ele vai responder localmente
    try {
      const registroCriado = await client.items.create({
        itemType: "123456", // Altere para o ID do Model de Depoimentos do seu DatoCMS
        title: request.body.title,
        creatorSlug: request.body.creatorSlug,
        message: request.body.message,
      });

      return response.json({
        registroCriado: registroCriado,
      });
    } catch (error) {
      // Fallback local caso seu Dato não tenha o model criado ainda
      return response.json({
        registroCriado: {
          id: new Date().toISOString(),
          title: request.body.title,
          creatorSlug: request.body.creatorSlug,
          message: request.body.message,
        }
      });
    }
  }

  response.status(405).json({ message: 'Método não permitido' });
}