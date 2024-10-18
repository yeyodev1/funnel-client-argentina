import { Request, Response } from 'express';
import GoogleSheetService from '../services/sheets.class';
import BuilderbotService from '../services/builderbot.class';
import { HttpStatusCode } from 'axios';


export async function sendMessages(req: Request, res: Response): Promise<void> {
  try {
    const clientName = req.query.name as string;

    if (!clientName) {
      res.status(400).send('Debe proporcionar un nombre de cliente.');
    }

    const sheetService = new GoogleSheetService();
    
    const { botKey, projectId } = await sheetService.getBotDataByClientName(clientName);

    const builderbotService = new BuilderbotService(botKey);

    const clientData = await sheetService.findSheetByClientName(clientName);

    for (const client of clientData) {
      const { clientName, whatsappNumber, chosenDate, chosenTime, company} = client;

      if (!clientName || !whatsappNumber || !chosenDate || !chosenTime || !company) {
        console.warn(`Faltan datos para enviar el mensaje al cliente: ${clientName}`);
        continue; 
      }
      
      await builderbotService.sendFirstMessage(
        clientName, 
        whatsappNumber, 
        chosenDate, 
        chosenTime, 
        projectId, 
        company
      );

    }

    res.status(200).json({ message: 'Mensajes enviados correctamente', clientData });
  } catch (error) {
    console.error('Error al enviar los mensajes:', error);
    res.status(500).send('Error interno del servidor');
  }
}

export async function confirmAppointment(req: Request, res: Response): Promise<void> {
  try {
    const { phoneNumber } = req.body

    const clientName = req.query.name as string;

    if (!clientName) {
      res.status(400).send('Debe proporcionar un nombre de cliente.');
    }

    const googleSheetService = new GoogleSheetService()

    const { chosenDate, chosenTime } = await googleSheetService.confirmAttendanceByPhoneNumber(phoneNumber, clientName)
    
    res.status(HttpStatusCode.Ok).send({
      messages: [
        {
          type: 'to_user',
          content: `Perfecto nos encontramos el próximo ${chosenDate} a las ${chosenTime}` 
        },
        {
          type: 'to_user',
          content: 'Le adjunto nuestras redes sociales y presentación corporativa para que pueda ir conociendo más de nuestra empresa, antes de la reunión'
        }
      ]
    })
  } catch (error: unknown) {
    console.error('Error al enviar los mensajes:', error);
    res.status(500).send({
      messages: [
        {
          type: 'to_user',
          content: 'Este chatbot no esta disponible para tu número :(!'
        }
      ]
    });
  }
}