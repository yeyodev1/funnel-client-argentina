import cron from 'node-cron';
import axios from 'axios';
import GoogleSheetService from '../services/sheets.class';


export function scheduleSendMessages() {
  cron.schedule('12 7,13 * * *', async () => {
    try {
      console.log('Ejecutando tarea cron a la 1:51 PM');

      const sheetService = new GoogleSheetService();
      
      const clientNames = await sheetService.getSheetNames();

      for (let i = 1; i < clientNames.length; i++) {
        const clientName = clientNames[i];
        
        const encodedClientName = encodeURIComponent(clientName);

        try {
          console.log(`Enviando petición para: ${clientName}`);
          const response = await axios.post(`http://localhost:8100/api/send-messages?name=${encodedClientName}`);
          console.log(`Respuesta para ${clientName}:`, response.data);
        } catch (error) {
          console.error(`Error enviando petición para ${clientName}:`, error);
        }
      }

    } catch (error) {
      console.error('Error ejecutando la tarea cron:', error);
    }
  });
}
