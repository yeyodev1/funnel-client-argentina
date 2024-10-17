import axios from 'axios';

class APIBuilderBot {
  private baseUrl: string;
  private headers: object;

  constructor() {
      this.baseUrl = 'https://www.builderbot.cloud';
      this.headers = {
        'Content-Type': 'application/json',
        'x-api-builderbot': process.env.BUILDERBOT_KEY
      };
  }

  async sendMessage(messageContent: string, phoneNumber: string, botId: string): Promise<any> {
    const url = `${this.baseUrl}/api/v2/${botId}/messages`;
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
        console.error('Error sending message:', error);
        throw error;
    }
  }
}

export default APIBuilderBot;