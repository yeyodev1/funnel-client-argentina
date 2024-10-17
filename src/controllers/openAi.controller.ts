import 'dotenv/config'
import { Request, Response } from 'express';

import AIClass from '../services/openai.class';
import { parseHistory } from '../utils/handleHistory';

const ai = new AIClass(process.env.OPEN_AI_KEY!);

export async function generateImage (req: Request, res: Response) {

  const { history } = req.body;

  if(!history) {
    return console.error(' no hay historial')
  }

  const parsedHistory = parseHistory(history);
  
  try {

    const prompt = 'Imagina que eres uno de los mejores diseñadores gráficos que existe, estas en la capacidad de diseñar cualquier arte que el cliente te pida, como tarjetas de presentacion, poster, logos, flayer, avisos en acrilico, pendones, valla publicitaria, básate en la informacion que el cliente te suministre en la conversación, veras todo en el historial que es el siguiente | {history} |'.replace('{history}', parsedHistory);
   
    const image = await ai.generateImage(prompt);

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
};