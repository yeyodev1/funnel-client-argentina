import axios from "axios";

class FreepikService {
  private apiKey: string;
  private baseUrl: string;
  private isInitialized: boolean = false;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.freepik.com/v1/ai"; 
  }

  private async initialize() {
    if (!this.isInitialized) {
      this.isInitialized = true;
    }
  }

  async generateImageFromText(prompt: string): Promise<string | null> {
    await this.initialize();

    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-image`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'x-freepik-api-key': this.apiKey,
            'Content-Type': "application/json",
          },
        }
      );

      return response.data
    } catch (error) {
      console.error("Error al generar la imagen:", error);
      return null;
    }
  }
}

export default FreepikService;
