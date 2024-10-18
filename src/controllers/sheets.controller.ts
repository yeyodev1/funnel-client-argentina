import { HttpStatusCode } from 'axios'
import type { Request, Response } from 'express'
import GoogleSheetService from '../services/sheets.class'

export async function sendMessages(req: Request, res: Response): Promise<void> {
  try {
    
    const clientName = req.query.name as string; 

    if (!clientName) {  
      res.status(400).send('Debe proporcionar un nombre de cliente.');
    }

    const sheetService = new GoogleSheetService();
    
    const clientData = await sheetService.findSheetByClientName(clientName);
    
    
    res.status(200).json(clientData);
  } catch (error: unknown) {
    console.error('Error al buscar el cliente:', error);
    
    if (error instanceof Error && error.message === 'Cliente no encontrado') {
      res.status(404).send('Cliente no encontrado');
    }
    
    res.status(500).send('Error interno del servidor');
  }
}