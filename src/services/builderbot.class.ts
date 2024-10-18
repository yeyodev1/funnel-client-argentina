import axios from "axios";

export default class BuilderbotService {
  private baseUrl: string;
  private headers: object;

  constructor(apiKey: string) {
    this.baseUrl = "https://www.builderbot.cloud";
    this.headers = {
      "Content-Type": "application/json",
      "x-api-builderbot": apiKey || process.env.BUILDERBOT_KEY,
    };
  }

  generateWelcomeMessage(
    clientName: string,
    chosenDate: string,
    chosenTime: string,
    company: string,
  ) {
    const firstPart = `Hola buen día ${clientName}, espero se encuentre muy bien, lo saluda el encargado de la gerencia Comercial de ${company}`;
    const secondPart = `Le escribo para confirmar su sesión de asesoría en desarrollo de Software o APP que agendó para el día de ${chosenDate} en el horario de ${chosenTime}.`;
    return {
      firstPart,
      secondPart
    }
  }

  async sendFirstMessage(
    clientName: string,
    phoneNumber: string,
    chosenDate: string,
    chosenTime: string,
    projectId: string,
    company: string
  ): Promise<{ firstMessageResponse: void; secondMessageResponse: void }> {

    const { firstPart, secondPart } = this.generateWelcomeMessage(
      clientName,
      chosenDate,
      chosenTime,
      company
    );

    try {
      const firstMessageResponse = await this.sendMessage(firstPart, phoneNumber, projectId);

      const secondMessageResponse = await this.sendMessage(secondPart, phoneNumber, projectId);

      return {
        firstMessageResponse,
        secondMessageResponse
      };
    } catch (error) {
      console.error("Error al enviar los mensajes:", error);
      throw error;
    }
  }

  async sendMessage(messageContent: string, phoneNumber: string, projectId: string): Promise<void> {
    const url = `${this.baseUrl}/api/v2/${projectId}/messages`;
    const data = {
      messages: {
        content: messageContent
      },
      number: String(phoneNumber)
    };

    try {
      const response = await axios.post(url, data, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      throw error;
    }
  }
}
