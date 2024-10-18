import axios from "axios";

class APIBuilderBot {
	private baseUrl: string;
	private headers: object;

	constructor(apiKey: string) {
		this.baseUrl = "https://www.builderbot.cloud";
		this.headers = {
			"Content-Type": "application/json",
			"x-api-builderbot": apiKey || process.env.BUILDERBOT_KEY,
		};
	}

	// Función para generar el contenido del mensaje
	generateWelcomeMessage(
		clientName: string,
		chosenDate: string,
		chosenTime: string,
    company: string,
	): string {
		return `Hola buen día ${clientName}, espero se encuentre muy bien, lo saluda [Director/a Comercial] de ${company}.
Le escribo para confirmar su sesión de asesoría en desarrollo de Software o APP que agendó para el día de ${chosenDate} a las ${chosenTime}.`;
	}

	// Función para enviar el mensaje usando BuilderBot
	async sendFirstMessage(
		clientName: string,
		phoneNumber: string,
		chosenDate: string,
		chosenTime: string,
		projectId: string,
    company: string
	): Promise<any> {
		const url = `${this.baseUrl}/api/v2/${projectId}/messages`;

		// Generar el mensaje con los datos proporcionados
		const messageContent = this.generateWelcomeMessage(
			clientName,
			chosenDate,
			chosenTime,
      company
		);

		const data = {
			messages: {
				content: messageContent,
			},
			number: String(phoneNumber),
		};

		try {
			const response = await axios.post(url, data, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			console.error("Error sending message:", error);
			throw error;
		}
	}
}

export default APIBuilderBot;
