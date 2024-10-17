import 'dotenv/config'
import { Request, Response } from 'express';
import FreepikService from '../services/freepik.class';

const freepik = new FreepikService(process.env.API_KEY_FREEPIK!);


export async function generateImage(req: Request, res: Response) {
  const { history } = req.body;
  
  try {

    const prompt = 'Imagina que eres un diseñador gráfico y un cliente te ha pedido que diseñes unas tarjetas de presentación. Siempre deberás basarte en la conversación del historial, que es la siguiente: [{history}]. Crea dos propuestas de diseño que sean elegantes y modernas.'.replace('{history}', history);
   
    const image = await freepik.generateImageFromText(prompt);

    const response = {
      messages: [
        {
          type: 'to_user', 
          media_url: image,
          content: 'ejemplo',
        }
      ]
    }

    res.status(200).send(response);
  } catch (error) {
    console.error('errosss: ', error)
  }
}