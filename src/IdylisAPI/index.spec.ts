/* eslint-disable max-len */
import soap from 'soap';
import IdylisAPI from '.';
import {JsonDocumentFicheToUpdate} from './interfaces';


let idylis: IdylisAPI = new IdylisAPI(
    'https://exe.idylis.com//Idylisapi.asmx',
    String(process.env.CODEABONNE) || '',
    String(process.env.IDENTIFIANT) || '',
    String(process.env.MOTDEPASSE) || '',
    'https://www.idylis.com/Idylisapi.asmx/',
);

let firstDocNumber: string = '';
let secondDocNumber: string = '';
let firstDocToDelete: string = '';
let secondDocToDelete: string = '';

describe('The IdyliAPI class', () => {
  test('should allow us to get a new instance of IdylisAPI', () => {
    expect(idylis)
        .toBeInstanceOf(IdylisAPI);
  });

  describe('has a public findDocument method', () => {
    test('that should return a string representing the document seeked', async () => {
      const foundDocument: string | boolean = await idylis.findDocument(
          'FA_BL',
          'CODEBL',
          '=',
          'DN2106102',
          'CODEBL',
          'ASC',
          0,
          0,
          0,
      );
      expect(typeof foundDocument)
          .toBe('string');
    });

    test('that should return false if the document seeked is not present on Idylis', async () => {
      await expect(idylis.findDocument(
          'FA_BL',
          'CODEBL',
          '=',
          'wrong-param',
          'CODEBL',
          'ASC',
          0,
          0,
          0,
      ))
          .resolves
          .toBe(false);
    });
  });

  describe('has a public updateDocument method', () => {
    let objetDevis: string = '';

    beforeAll(() => {
      objetDevis = `Modifié pour test unitaire (random number: ${Math.floor(Math.random() * 100 + Math.random() * 10)})`;
    });

    test('that should return true if a table update was successful', async () => {
      const receivedValue = await idylis.updateDocument(
          'FA_DEVIS',
          'CODEDEVIS',
          '=',
          'PIWC32387',
          'CODEDEVIS',
          'ASC',
          0,
          0,
          0,
          'REFDEVIS',
          [{'OBJETDEVIS': objetDevis}],
      );

      expect(receivedValue)
          .toBe(true);
    });

    test('that should return true if a sub table update was successful', async () => {
      const compteAchatTest: number = Math.ceil(Math.random() * 10000 + Math.random() * 1000 + Math.random() * 100 + Math.random() * 10);
      const receivedValue = await idylis.updateDocument(
          'FA_COMPTETVADISTINCT',
          'CODEARTICLE',
          '=',
          '1ARM01',
          'CODEARTICLE',
          'ASC',
          0,
          0,
          0,
          'REFTVADISTINCT',
          [{'COMPTEACHATTVA': `${compteAchatTest}`}],
          'CODETVA',
          'EE',
      );

      expect(receivedValue)
          .toBe(true);
    });

    test('that should return false if the update was unsuccessful because of missing parameters to update a sub table', async () => {
      const compteAchatTest: number = Math.ceil(Math.random() * 10000 + Math.random() * 1000 + Math.random() * 100 + Math.random() * 10);
      const updateResult: boolean | JsonDocumentFicheToUpdate = await idylis.updateDocument(
          'FA_COMPTETVADISTINCT',
          'CODEARTICLE',
          '=',
          '1ARM01',
          'CODEARTICLE',
          'ASC',
          0,
          0,
          0,
          'REFTVADISTINCT',
          [{'COMPTEACHATTVA': `${compteAchatTest}`}],
      );
      expect(updateResult)
          .toBe(false);
    });

    test('that should return false if the update was unsuccessful', async () => {
      const updateResult: boolean | JsonDocumentFicheToUpdate = await idylis.updateDocument(
          'FA_WRONGTYPE',
          'CODEDEVIS',
          '=',
          'PIWC32387',
          'CODEDEVIS',
          'ASC',
          0,
          0,
          0,
          'REFDEVIS',
          [{'OBJETDEVIS': 'Failing test...'}],
      );
      expect(updateResult)
          .toBe(false);
    });
  });

  describe('has a public insertDocument method', () => {
    test('that should return true if the insertion of the main document was successful', async () => {
      firstDocNumber = `PITU${Math.ceil(Math.random() * 10000 + Math.random() * 1000 + Math.random() * 100 + Math.random() * 10)}`;
      let insertDocumentConfirmation: boolean = false;
      insertDocumentConfirmation = await idylis.insertDocument(
          'FA_DEVIS',
          [
            {'CODECLIENT': 'TESTS01'},
            {'CODEDEVIS': firstDocNumber},
            {'DATECREA': '23/08/2021'},
            {'MODELEDOC': '133'},
            {'COMP_COUNTRY': 'France FR'},
            {'COMP_CHANNEL': 'Dir'},
            {'COMP_ENDCUSTOMER': 'Private'},
            {'COMP_NEWDEMO': 'New'},
            {'COMP_WEB': 'No'},
            {'COMP_INCOTERMS': 'DAP Tests Unitaires'},
            {'COMP_TRANSPORTEUR': 'To be confirmed'},
            {'COMP_LIGNETVAEXO': 'Exonération de TVA article 262 I du CGI'},
          ],
      );
      expect(insertDocumentConfirmation)
          .toBe(true);
    });

    test('that should return true if both the insertions were successful', async () => {
      secondDocNumber = `PITU${Math.ceil(Math.random() * 10000 + Math.random() * 1000 + Math.random() * 100 + Math.random() * 10)}`;
      let insertDocumentConfirmation: boolean = false;
      insertDocumentConfirmation = await idylis.insertDocument(
          'FA_DEVIS',
          [
            {'CODECLIENT': 'TESTS01'},
            {'CODEDEVIS': secondDocNumber},
            {'DATECREA': '23/08/2021'},
            {'MODELEDOC': '133'},
            {'TOTHT': '100.00'},
            {'TOTHT2': '0.00'},
            {'TOTHT3': '0.00'},
            {'TOTHT4': '0.00'},
            {'TOTHT5': '0.00'},
            {'TOTHT_G': '100.00'},
            {'TOTTC': '100.00'},
            {'TOTTC': '120.00'},
            {'TOTTC2': '0.00'},
            {'TOTTC3': '0.00'},
            {'TOTTC4': '0.00'},
            {'TOTTC5': '0.00'},
            {'TOTTC_G': '120.00'},
            {'TOTTVA': '20.00'},
            {'TAUXTVA': '20.00'},
            {'TAUXTVA2': '20.00'},
            {'TAUXTVA3': '0.00'},
            {'TAUXTVA4': '0.00'},
            {'TAUXTVA5': '0.00'},
            {'UTILISETTC': '1'},
            {'COMP_COUNTRY': 'France FR'},
            {'COMP_CHANNEL': 'Dir'},
            {'COMP_ENDCUSTOMER': 'Private'},
            {'COMP_NEWDEMO': 'New'},
            {'COMP_WEB': 'No'},
            {'COMP_INCOTERMS': 'DAP Tests Unitaires'},
            {'COMP_TRANSPORTEUR': 'To be confirmed'},
            {'COMP_LIGNETVAEXO': 'Exonération de TVA article 262 I du CGI'},
          ],
          'FA_DETAILARTICLEDEVIS',
          [
            {'CODEARTICLE': '1TWL050'},
            {'CODECATALOGUE': 'CUST'},
            {'CODEDEVIS': secondDocNumber},
            {'CODETVA': '1'},
            {'DESCRIPTIF': 'Tiwal 3 et voile arisable 7/5.20 m² sans graphisme'},
            {'NOMBRECOLIS': '0'},
            {'PU': '120'},
            {'QTE': '1'},
            {'TAUXTVA': '20,00'},
            {'TOTHT': '100'},
            {'TOTTTC': '120'},
            {'TOTTVA': '20'},
          ],
      );
      expect(insertDocumentConfirmation)
          .toBe(true);
    });
  });

  describe('has a public deleteDocument method', () => {
    beforeAll(() => {
      firstDocToDelete = firstDocNumber;
      secondDocToDelete = secondDocNumber;
    });

    test('that should return true if the deletion was successful', async () => {
      let firstDeletion: boolean = false;
      let secondDeletion: boolean = false;
      let finalConfirmation: boolean = false;

      firstDeletion = await idylis.deleteDocument(
          'FA_DEVIS',
          'CODEDEVIS',
          firstDocToDelete,
          'REFDEVIS',
      );

      secondDeletion = await idylis.deleteDocument(
          'FA_DEVIS',
          'CODEDEVIS',
          secondDocToDelete,
          'REFDEVIS',
      );

      if (firstDeletion && secondDeletion) {
        finalConfirmation = true;
      }

      expect(finalConfirmation)
          .toBe(true);
    });

    test('that should return false if the deletion was unsuccessful', async () => {
      let deletionConfirmation: boolean = false;
      deletionConfirmation = await idylis.deleteDocument(
          'FA_DEVIS',
          'CODEDEVIS',
          'FAKEID',
          'REFDEVIS',
      );
      expect(deletionConfirmation)
          .toBe(false);
    });
  });

  describe('has a public getSoapClient method', () => {
    test('that should return a valid SOAP client', async () => {
      const soapClient: soap.Client = await idylis.getSoapClient();
      expect(soapClient)
          .toHaveProperty('Authentification_Divalto');
    });

    test('that should throw an error returning a string if the url to get the SOAP client from is invalid', async () => {
      idylis = new IdylisAPI(
          'not-a-valid-url',
          String(process.env.CODEABONNE) || '',
          String(process.env.IDENTIFIANT) || '',
          String(process.env.MOTDEPASSE) || '',
          'https://www.idylis.com/Idylisapi.asmx/',
      );
      await expect(idylis.getSoapClient())
          .rejects
          .toThrowError('The WSDL SOAP url is invalid.');
    });

    test('that should throw a generic error when the SOAP client could not be created', async () => {
      idylis = new IdylisAPI(
          'https://www.google.com/',
          String(process.env.CODEABONNE) || '',
          String(process.env.IDENTIFIANT) || '',
          String(process.env.MOTDEPASSE) || '',
          'https://www.idylis.com/Idylisapi.asmx/',
      );
      await expect(idylis.getSoapClient())
          .rejects
          .toThrowError();
    });
  });

  describe('has a public getAuthToken method', () => {
    let token: string = '';
    beforeAll(async () => {
      idylis = new IdylisAPI(
          'https://exe.idylis.com//Idylisapi.asmx',
          String(process.env.CODEABONNE) || '',
          String(process.env.IDENTIFIANT) || '',
          String(process.env.MOTDEPASSE) || '',
          'https://www.idylis.com/Idylisapi.asmx/',
      );
      token = await idylis.getAuthToken();
    });

    test('that should return a valid token', async () => {
      expect(typeof token)
          .toBe('string');
    });

    test('that should throw an error returning a string when it fails', async () => {
      idylis = new IdylisAPI(
          'https://exe.idylis.com//Idylisapi.asmx',
          'wrong-credential',
          'wrong-credential',
          'wrong-credential',
          'https://www.idylis.com/Idylisapi.asmx/',
      );
      await expect(idylis.getAuthToken())
          .rejects
          .toThrowError('The authentication failed. Please check your credentials and try again.');
    });
  });
});
