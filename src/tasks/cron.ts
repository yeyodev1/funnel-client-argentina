import cron from 'node-cron';
import axios from 'axios';

export function scheduleSendMessages() {
  // Programa el cron job para ejecutarse cada 6 horas entre 7am y 7pm
  cron.schedule('40 13 * * *', async () => {
    try {
      console.log('Ejecutando tarea cron cada 6 horas entre 7am y 7pm');
      await axios.post('http://localhost:8100/api/send-messages');
    } catch (error) {
      console.error('Error ejecutando la tarea cron:', error);
    }
  });
}
