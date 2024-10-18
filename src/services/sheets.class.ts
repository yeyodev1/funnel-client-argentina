import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

export default class GoogleSheetService {
  private doc: GoogleSpreadsheet;

  constructor() {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ]
    });

    this.doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!, serviceAccountAuth);
  }

  async loadDoc() {
    await this.doc.loadInfo();
  }

  async findSheetByClientName(clientName: string): Promise<any> {
    await this.loadDoc();

    const sheet = this.doc.sheetsByIndex.find(sheet => 
      sheet.title.toLowerCase() === clientName.toLowerCase()
    );

    if (!sheet) {
      throw new Error(`Hoja para el cliente ${clientName} no encontrada`);
    }

    const rows = await sheet.getRows();
    
    if (rows.length === 0) {
      throw new Error(`No hay datos en la hoja para el cliente ${clientName}`);
    }

    const clientInfo = rows.map(row => ({
      nombreCliente: row.get('nombre'),
      correoElectronico: row.get('correo electronico'),
      numeroWhatsapp: row.get('numero de whatsapp')
    }));

    return clientInfo;
  }
}
