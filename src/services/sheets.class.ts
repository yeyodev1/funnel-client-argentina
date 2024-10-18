import { HttpStatusCode } from "axios";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { googleKey } from "../utils/googlePrivateKey";

export default class GoogleSheetService {
  private doc: GoogleSpreadsheet;

  constructor() {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: googleKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ]
    });

    this.doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!, serviceAccountAuth);
  }

  async loadDoc() {
    await this.doc.loadInfo();
  }

  // Buscar la hoja que tenga el nombre del cliente
  async findSheetByClientName(clientName: string): Promise<any> {
    await this.loadDoc();

    // Recorrer todas las hojas y encontrar una que coincida con el nombre del cliente
    const sheet = this.doc.sheetsByIndex.find(sheet => 
      sheet.title.toLowerCase() === clientName.toLowerCase()
    );

    if (!sheet) {
      throw new Error(`Hoja para el cliente ${clientName} no encontrada`);
    }

    // Obtener las filas de la hoja del cliente encontrada
    const rows = await sheet.getRows();
    
    if (rows.length === 0) {
      throw new Error(`No hay datos en la hoja para el cliente ${clientName}`);
    }

    // Extraemos la información relevante de la hoja
    const clientInfo = rows.map(row => ({
      nombreCliente: row.get('nombre'),
      correoElectronico: row.get('correo electronico'),
      numeroWhatsapp: row.get('numero de whatsapp')
    }));

    return clientInfo;
  }
}
