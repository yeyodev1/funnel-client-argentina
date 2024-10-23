import { JWT } from "google-auth-library";
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { ClientInfo } from "../interfaces/sheet.interface";
import moment from "moment-timezone";
import parsePhoneNumberFromString from "libphonenumber-js";
import { timezonesByCountry } from "../utils/timezonesByCountry";

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
  
    
    const clientInfo: ClientInfo[] = rows
      .filter(row => !row.get('asistencia') || row.get('asistencia') === null)
      .map(row => ({
        clientName: row.get('nombre'),
        emailAddress: row.get('correo electronico') || null,
        whatsappNumber: row.get('numero de whatsapp') || null,
        chosenDate: row.get('fecha escogida') || null,
        chosenTime: row.get('hora escogida') || null,
        company: row.get('empresa') || null,
        asistencia: row.get('asistencia') || null
      }));
  
    return clientInfo;
  }
  

  async confirmAttendanceByPhoneNumber(phoneNumber: string, clientName: string): Promise<{ chosenDate: string, chosenTime: string }> {
    await this.loadDoc();
  
    
    const sheet = this.doc.sheetsByIndex.find(sheet => 
      sheet.title.toLowerCase() === clientName.toLowerCase()
    );
  
    if (!sheet) {
      throw new Error(`Hoja para el cliente ${clientName} no encontrada`);
    }
  
    const rows: GoogleSpreadsheetRow[] = await sheet.getRows();
  
    for (const row of rows) {
      if (row.get('numero de whatsapp') === phoneNumber) {
        
        row.set('asistencia', 'confirmada');
        await row.save(); 
  
        
        return {
          chosenDate: row.get('fecha escogida'),
          chosenTime: row.get('hora escogida'),
        };
      }
    }
  
    throw new Error(`Cliente con número ${phoneNumber} no encontrado`);
  }

  async detectCountryAndConvertTime(whatsappNumber: string, chosenDate: string, chosenTime: string): Promise<{ country: string, convertedTime: string }> {
    
    if (!whatsappNumber.startsWith('+')) {
      whatsappNumber = `+${whatsappNumber}`;
    }
  
    
    const phoneNumber = parsePhoneNumberFromString(whatsappNumber);
  
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new Error(`Número de WhatsApp inválido: ${whatsappNumber}`);
    }
  
    const country = phoneNumber.country;
        
    if (!country) {
      throw new Error(`No se pudo detectar el país para el número: ${whatsappNumber}`);
    }
  

    const formattedDate = moment(chosenDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
    const formattedTime = moment(chosenTime, 'HH:mm').format('HH:mm');
    
    const datetimeString = `${formattedDate} ${formattedTime}`;
    
    
    const targetTimezone = timezonesByCountry[country] || 'UTC'; 
  
    
    const argTimezone = 'America/Argentina/Buenos_Aires';
    const datetimeInArgentina = moment.tz(datetimeString, 'YYYY-MM-DD HH:mm', argTimezone);
    
    
    if (!datetimeInArgentina.isValid()) {
      throw new Error(`Fecha y hora inválida: ${chosenDate} ${chosenTime}`);
    }
  
    const convertedTime = datetimeInArgentina.clone().tz(targetTimezone).format('YYYY-MM-DD HH:mm');
  
    return {
      country,
      convertedTime,
    };
  }
  
  
  
}
