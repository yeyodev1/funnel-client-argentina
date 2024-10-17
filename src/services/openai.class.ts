import OpenAI from 'openai';
import { EventEmitter } from 'node:events';

/**
 * Class
 */
class AIClass extends EventEmitter {
	private openai: OpenAI;
	constructor(apiKey: string) {
		super();
		this.openai = new OpenAI({ apiKey, timeout: 15 * 1000 });
		if (!apiKey || apiKey.length === 0) {
			throw new Error("OPENAI_KEY is missing");
		}
	}

	generateImage = async (prompt: string) => {
		try {
			const response = await this.openai.images.generate({
				prompt,
				model: 'dall-e-3',
				size: '1024x1024',
				n: 1
			});
			return response.data[0].url;
		} catch (err) {
			console.error(err);
			return "ERROR";
		}
	};
}

export default AIClass;