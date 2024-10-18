import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { ClientInfo } from "../interfaces/sheet.interface";

export default class GoogleSheetService {
  private doc: GoogleSpreadsheet;

  constructor() {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ]
    });

    this.doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!, serviceAccountAuth);
  }

  async loadDoc() {
    await this.doc.loadInfo();
  }

  async getBotDataByClientName(clientName: string): Promise<any> {
    await this.loadDoc();

    const firstSheet = this.doc.sheetsByIndex[0]; 

    const rows = await firstSheet.getRows();

    for (const row of rows) {
      if (row.get('nombre del cliente')?.toLowerCase() === clientName.toLowerCase()) {
        return {
          clientName: row.get('nombre del cliente'),
          botKey: row.get('bot del cliente'),
          projectId: row.get('proyecto del cliente')
        };
      }
    }

    throw new Error(`Cliente ${clientName} no encontrado en la primera hoja.`);
  }

  async findSheetByClientName(clientName: string): Promise<ClientInfo[]> {
    await this.loadDoc();

    const sheet = this.doc.sheetsByIndex.find(sheet => 
      sheet.title.toLowerCase() === clientName.toLowerCase()
    );

    if (!sheet) {
      throw new Error(`Hoja para el cliente ${clientName} no encontrada`);
    }

    const rows: GoogleSpreadsheetRow[] = await sheet.getRows();
    
    if (rows.length === 0) {
      throw new Error(`No hay datos en la hoja para el cliente ${clientName}`);
    }

    const clientInfo: ClientInfo[] = rows.map(row => ({
      clientName: row.get('nombre'),
      emailAddress: row.get('correo electronico') || null,
      whatsappNumber: row.get('numero de whatsapp') || null,
      chosenDate: row.get('fecha escogida') || null,
      chosenTime: row.get('hora escogida') || null,
      company: row.get('empresa') || null
    }));

    return clientInfo;
  }
}
