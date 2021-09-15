/* eslint-disable no-invalid-this */
/* eslint-disable new-cap */
/* eslint-disable max-len */

import * as soap from 'soap';
import {URL} from 'url';
import Parser from 'fast-xml-parser';
import {
  AuthentificationAvec3Parametres1,
  Auth3,
  LireTableResult,
  MajTableResult,
  IdylisTableField,
  ParseOptions,
  MajTableJson,
  OriginJsonDocument,
  JsonDocumentFicheToUpdate,
  CDATA,
} from './interfaces';
import {typeguards} from '../typeguards';


const options: ParseOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: 'attr',
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataTagName: '__cdata',
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false,
  /* istanbul ignore next */ attrValueProcessor: /* istanbul ignore next */ (a: any) => a,
  /* istanbul ignore next */ tagValueProcessor: /* istanbul ignore next */ (a: any) => a,
};

const j2xParser = new Parser.j2xParser(options);

/**
 * @param {string} url the url to connect to your Idylis API endpoint
 * @param {string} code the Code Abonné linked to the user Idylis account
 * @param {string} id the Identifiant used to connect to the user Idylis account
 * @param {string} pwd the Mot de Passe used to connect to the user Idylis account
 * @param {string} xmlnsAddress the xmlns address to be used inside the soap header
 * to make calls to the Idylis API
 */
export default class IdylisAPI {
  private token: string = '';
  private client!: soap.Client;
  private tokenIsValid: boolean = false;
  private clientIsValid: boolean = false;

  /**
 * @param {string} url the url to connect to your Idylis API endpoint
 * @param {string} code the Code Abonné linked to the user Idylis account
 * @param {string} id the Identifiant used to connect to the user Idylis account
 * @param {string} pwd the Mot de Passe used to connect to the user Idylis account
 * @param {string} xmlnsAddress the xmlns address to be used inside the soap header
 * to make calls to the Idylis API
 */
  constructor(
    private url: string,
    private code: string,
    private id: string,
    private pwd: string,
    private xmlnsAddress: string,
  ) { }

  /**
   * @return {boolean} this method returns a boolean that checks the url
   */
  private wsdlSoapUrlIsValid(): boolean {
    try {
      new URL(this.url);
      return true;
    } catch (error) {
      /* istanbul ignore next */
      return false;
    };
  };

  /**
   * @param {soap} soap this represents the soap object
   * @return {Promise<soap.Client>} this method returns a valid client instance
   */
  private async createSoapClient(): Promise<soap.Client> {
    let client: soap.Client;

    if (this.wsdlSoapUrlIsValid()) {
      try {
        client = await soap.createClientAsync(`${this.url}?WSDL`);
        this.clientIsValid = true;
      } catch (error) {
        /* istanbul ignore next */
        throw new Error(String(error));
      }
    } else {
      throw new Error('The WSDL SOAP url is invalid.');
    };
    return client;
  };

  /**
   * @return {boolean} returns a boolean that tells whether a client exists or not
   */
  private soapClientExists(): boolean {
    return !!this.client;
  };

  /**
   * @return {boolean} returns a boolean that tells whether a client is valid or not
   */
  private soapClientIsValid(): boolean {
    return this.clientIsValid;
  };

  /**
   * @return {IdylisAPI} returns an object of type IdylisAPI after
   * resetting the SOAP client control value.
   */
  private invalidateSoapClient(): IdylisAPI {
    this.clientIsValid = false;
    return this;
  };

  /**
   * @return {boolean} returns a boolean that tells whether a token exists or not
   */
  private tokenExists(): boolean {
    return !!this.token;
  };

  /**
   * @return {boolean} returns a boolean that tells whether a token is valid or not
   */
  private apiTokenIsValid(): boolean {
    return this.tokenIsValid;
  };

  /**
   * @return {boolean} returns a boolean that tells whether a token is empty or not
   */
  private apiTokenIsNotEmpty(): boolean {
    if ('' !== this.token) {
      this.tokenIsValid = true;
    } else {
      /* istanbul ignore next */
      this.tokenIsValid = false;
    };
    return this.tokenIsValid;
  };

  /**
   * @return {IdylisAPI} returns an object of type IdylisAPI after resetting
   *  the token value and control value
   */
  private invalidateApiToken(): IdylisAPI {
    this.tokenIsValid = false;
    this.token = '';
    return this;
  };

  /**
   * @return {Promise<soap.Client>} this method checks whether
   * an instance of the soap client exists.
   * and if it doesn't, it creates one. At the end, it returns
   * a brand new client or the existing one.
   */
  public async getSoapClient(): Promise<soap.Client> {
    let client: soap.Client;
    if (this.soapClientExists() && this.soapClientIsValid()) {
      return this.client;
    } else {
      try {
        client = await this.createSoapClient();
      } catch (error) {
        /* istanbul ignore next */
        throw new Error(String(error));
      }
    };
    return client;
  };

  /**
   * @return {Promise<IdylisAPI>} this method returns an object of type IdylisAPI
   */
  private async setSoapClient(): Promise<IdylisAPI> {
    try {
      this.client = await this.getSoapClient();
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };
    return this;
  };

  /**
   * @param {soap.Client} client A valid client instance that will be used to get a new
   * authentication token from Idylis
   * @return {Promise<string>} this method returns a valid token
   */
  private async tokenRequest(): Promise<string> {
    const argsAuth: Auth3 = {
      '_codeAbonne': String(this.code || ''),
      '_identifiant': String(this.id || ''),
      '_motdePasse': String(this.pwd || ''),
    };
    let client: soap.Client;
    let token: string = '';
    try {
      client = (await this.setSoapClient()).client;
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };
    try {
      const [AuthentificationAvec3Parametres1]: [AuthentificationAvec3Parametres1] = await client.authentification1Async(argsAuth, {timeout: 30000});
      const authResult: string = AuthentificationAvec3Parametres1.AuthentificationAvec3Parametres1Result;
      if (authResult === '-1') {
        this.invalidateApiToken();
        throw new Error(`The authentication failed. Please check your credentials and try again.`);
      } else {
        token = authResult;
        this.tokenIsValid = true;
      }
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };
    return token;
  };

  /**
   * @return {Promise<string>} this method checks whether the token is still valid,
   * and if it is not, it returns a new valid token
   */
  public async getAuthToken(): Promise<string> {
    let token: string = '';
    if (this.tokenExists() && this.apiTokenIsValid() && this.apiTokenIsNotEmpty()) {
      return this.token;
    } else {
      try {
        token = await this.tokenRequest();
      } catch (error) {
        /* istanbul ignore next */
        throw new Error(String(error));
      }
    };
    return token;
  };

  /**
   * @return {Promise<IdylisAPI>} this method returns an object of type IdylisAPI
   */
  private async setAuthToken(): Promise<IdylisAPI> {
    try {
      this.token = await this.getAuthToken();
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };
    return this;
  };

  /**
   * @return {Promise<void>} this method adds the required header to the SOAP client;
   */
  private async addSoapClientHeader(): Promise<void> {
    let token: string;
    try {
      token = (await (await (await this
          .invalidateSoapClient()
          .invalidateApiToken()
          .setSoapClient())
          .setAuthToken())
          .getAuthToken());
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    }
    if (!this.tokenIsValid) {
      /* istanbul ignore next */
      return;
    }
    try {
      this.client.clearSoapHeaders();
      this.client.addSoapHeader(`<SessionIDHeader xmlns='${this.xmlnsAddress}'><SessionID>${token}</SessionID></SessionIDHeader>`);
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };
  };

  /**
   * @param {string} docType this is the type of document that will be
   * retrieved from Idylis API (e.g..: 'FA_DEVIS', 'FA_BL', etc).
   * @param {string} searchCriteria this is the criteria that will be
   * used to retrieve one or more document(s) from Idylis API
   * (e.g.: 'DATECREATION', 'CODEDEVIS', etc).
   * @param {string} operator this represents the assignment operator used
   * for the search (e.g.: '=', '>=', etc)
   * @param {string} criteriaValue this is the value that will be used along
   * with the search criteria (e.g.: 'PI2105033', '03/12/2020', etc.
   * Please note that date format must be dd/MM/yyyy).
   * @param {string} orderingType this is the criteria with which the documents
   * will be ordered in the response (e.g.: 'DATECREATION', 'CODEDEVIS', etc).
   * @param {string} orderingValue this is the value that will be used along
   * with the ordering type (possible choices: 'ASC', 'DESC').
   * @param {number} subTable this number allows to choose whether subtables
   * will be present in the response or not (possible choices: 0, 1).
   * @param {number} enclosedDoc this number allows to choose whether enclosed
   * documents will be present in the response or not (possible choices: 0, 1).
   * @param {number} withCompression this number allows to choose whether
   * the response will be compressed or not (possible choices: 0, 1).
   */
  public findDocument = async (
      docType: string,
      searchCriteria: string,
      operator: string,
      criteriaValue: string,
      orderingType: string,
      orderingValue: string,
      subTable: number,
      enclosedDoc: number,
      withCompression: number,
  ): Promise<string | boolean> => {
    let table: string = '';

    try {
      await this.addSoapClientHeader();
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };
    try {
      const [LireTableResult]: [LireTableResult] = await this.client.LireTableAsync(
          {
            '_nomtable': `${docType}`,
            '_criteres': `${searchCriteria}${operator}'${criteriaValue}'`,
            '_ordre': `${orderingType} ${orderingValue}`,
            '_soustables': subTable,
            '_pieceatache': enclosedDoc,
            '_aveccompression': withCompression,
          },
          {timeout: 30000},
      );

      if (LireTableResult.LireTableResult.includes('<error><code>21</code></error>') ||
        LireTableResult.LireTableResult.includes('<error><code>24</code></error>') ||
        LireTableResult.LireTableResult.includes('<FICHE />')) {
        /* istanbul ignore next */ if (LireTableResult.LireTableResult.includes('<error><code>21</code></error>') ||
          LireTableResult.LireTableResult.includes('<error><code>24</code></error>')) {
          this
              .invalidateSoapClient()
              .invalidateApiToken();
          return await this.findDocument(docType, searchCriteria, operator, criteriaValue, orderingType, orderingValue, subTable, enclosedDoc, withCompression);
        }
        if (LireTableResult.LireTableResult.includes('<FICHE />')) {
          this.invalidateSoapClient();
          /* istanbul ignore next */
          return false;
        }
      }
      table = LireTableResult.LireTableResult;
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };
    return table;
  };

  /**
   * @param {string} docType this is the type of document that will be retrieved
   * from Idylis API (e.g..: 'FA_DEVIS', 'FA_BL', etc).
   * @param {string} searchCriteria this is the criteria that will be used to
   * retrieve one or more document(s) from Idylis API
   * (e.g.: 'DATECREATION', 'CODEDEVIS', etc).
   * @param {string} operator this represents the assignment operator used for the
   * search (e.g.: '=', '>=', etc)
   * @param {string} criteriaValue this is the value that will be used along with
   * the search criteria (e.g.: 'PI2105033', '03/12/2020', etc.
   * Please note that date format must be dd/MM/yyyy).
   * @param {string} orderingType this is the criteria with which the documents will
   * be ordered in the response (e.g.: 'DATECREATION', 'CODEDEVIS', etc).
   * @param {string} orderingValue this is the value that will be used along with the
   * ordering type (possible choices: 'ASC', 'DESC').
   * @param {number} subTable this number allows to choose whether subtables will be
   * present in the response or not (possible choices: 0, 1).
   * @param {number} enclosedDoc this number allows to choose whether enclosed
   * documents will be present in the response or not (possible choices: 0, 1).
   * @param {number} withCompression this number allows to choose whether the
   * response will be compressed or not (possible choices: 0, 1).
   * @param {string} primaryKey this represents the primary key necessary to update
   * any table. Generally starts with 'REF' (e.g.: 'REFBL', 'REFDEVIS').
   * @param {IdylisTableField[]} tableUpdateArray this represents an array containing
   * objects of pair key value representing the table to be updated as the key and
   * the value to update as the value (e.g.: [{'ADRESSE1': 'My new address'},
   * {'NOMCONTACT': 'John Doe'}]).
   * @param {string} refToUpdateValue [OPTIONAL] this represents the value for the reference
   * to use to target the table to update in case the update targets a sub table
   * (like FA_COMPTETVADISTINCT).
   * @return {Promise<boolean | OriginJsonDocument>} this method returns either a
   * boolean indicating whether the update was successful or not, or the original
   * document if the update was not successful because of an incorrect key/pair inside
   * the tableUpdateArray argument.
   */
  public async updateDocument(
      docType: string,
      searchCriteria: string,
      operator: string,
      criteriaValue: string,
      orderingType: string,
      orderingValue: string,
      subTable: number,
      enclosedDoc: number,
      withCompression: number,
      primaryKey: string,
      tableUpdateArray: IdylisTableField[],
      refToUpdateValue?: string,
  ): Promise<boolean | JsonDocumentFicheToUpdate> {
    let originXmlDocument: string | boolean = '';
    let majTableXml: string = '';
    let majTableJson: MajTableJson = {};
    let updatedXmlDocument: string | boolean = '';
    let updateConfirmation: boolean = false;

    try {
      originXmlDocument = await this.findDocument(
          docType,
          searchCriteria,
          operator,
          criteriaValue,
          orderingType,
          orderingValue,
          subTable,
          enclosedDoc,
          withCompression,
      );
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };

    if (!typeguards.isString(originXmlDocument)) {
      /* istanbul ignore next */
      return false;
    }

    if (Parser.validate(originXmlDocument) && '' !== originXmlDocument) {
      const originJsonDocument: OriginJsonDocument = Parser.parse(originXmlDocument, options);
      let jsonDocumentFicheToUpdate: JsonDocumentFicheToUpdate | JsonDocumentFicheToUpdate[] = originJsonDocument[docType]?.FICHE;

      if (undefined !== refToUpdateValue) {
        if (Array.isArray(jsonDocumentFicheToUpdate)) {
          jsonDocumentFicheToUpdate.forEach((fiche: JsonDocumentFicheToUpdate) => {
            if (fiche[primaryKey].__cdata === refToUpdateValue) {
              jsonDocumentFicheToUpdate = fiche;
            }
          });
        }
      }

      if (typeguards.isJsonDocumentFiche(jsonDocumentFicheToUpdate)) {
        const primaryKeyValue: string = jsonDocumentFicheToUpdate[primaryKey]?.__cdata;

        if (typeguards.isPrimaryKeyValue(primaryKeyValue)) {
          majTableJson = {
            [docType]: {
              FICHE: {
                [primaryKey]: `<![CDATA[${primaryKeyValue}]]]]><![CDATA[>`,
              },
            },
          };
          tableUpdateArray.forEach((table: IdylisTableField) => {
            if (typeguards.isJsonDocumentFiche(jsonDocumentFicheToUpdate)) {
              const keyToCheck: CDATA = jsonDocumentFicheToUpdate[String(Object.keys(table))];
              const keyToUpdate: string[] = Object.keys(table);
              const originValue: string[] = Object.values(keyToCheck);
              const updatedValue: string[] = Object.values(table);

              if (typeguards.isCdata(keyToCheck)) {
                if (String(originValue) !== String(updatedValue)) {
                  majTableJson[docType].FICHE[String(keyToUpdate)] = `<![CDATA[${Object.values({__cdata: String(updatedValue)})}]]]]><![CDATA[>`;
                  jsonDocumentFicheToUpdate[String(keyToUpdate)] = {__cdata: String(updatedValue)};
                } else {
                  throw new Error(`Cannot update this particular table: ${JSON.stringify(keyToCheck)} because both the original value and the updated value are the same.`);
                }
              } else {
                throw new Error(`Cannot update because the provided key (${JSON.stringify(keyToCheck)}) is either not a cdata or its value is empty.`);
              }
            } else {
              throw new Error('The document to update is undefined. Cannot proceed.');
            }
          });

          majTableXml = j2xParser.parse(majTableJson);

          if (Parser.validate(majTableXml) && '' !== originXmlDocument) {
            try {
              await this.addSoapClientHeader();
            } catch (error) {
              /* istanbul ignore next */
              throw new Error(String(error));
            };
            try {
              const [MajTableResult]: [MajTableResult] = await this.client.MajTableAsync(
                  {_cFiche: `<![CDATA[<?xml version='1.0' encoding='utf-16'?>${majTableXml}]]>`},
                  {timeout: 30000},
              );

              /* istanbul ignore next */ if (MajTableResult.MajTableResult.includes('<error><code>21</code></error>') || MajTableResult.MajTableResult.includes('<error><code>24</code></error>')) {
                this
                    .invalidateSoapClient()
                    .invalidateApiToken();
                return await this.updateDocument(
                    docType,
                    searchCriteria,
                    operator,
                    criteriaValue,
                    orderingType,
                    orderingValue,
                    subTable,
                    enclosedDoc,
                    withCompression,
                    primaryKey,
                    tableUpdateArray,
                );
              } else if (MajTableResult.MajTableResult.includes('<error><code>-99</code><message>Object reference not set to an instance of an object.</message></error>')) {
                /* istanbul ignore next */
                updateConfirmation = false;
                return jsonDocumentFicheToUpdate;
              } else {
                // ***************** START OF VERIFICATION THAT UPDATE HAS BEEN SUCCESSFUL ***************** //

                if (MajTableResult.MajTableResult.includes('<success><message>ok</message></success>')) {
                  try {
                    updatedXmlDocument = await this.findDocument(
                        docType,
                        searchCriteria,
                        operator,
                        criteriaValue,
                        orderingType,
                        orderingValue,
                        subTable,
                        enclosedDoc,
                        withCompression,
                    );
                  } catch (error) {
                    /* istanbul ignore next */
                    throw new Error(String(error));
                  };

                  if (!typeguards.isString(updatedXmlDocument)) {
                    /* istanbul ignore next */
                    return false;
                  }

                  if (Parser.validate(updatedXmlDocument) && '' !== updatedXmlDocument) {
                    const updatedJsonDocument: OriginJsonDocument = Parser.parse(updatedXmlDocument, options);
                    let jsonDocumentUpdatedFiche: JsonDocumentFicheToUpdate | JsonDocumentFicheToUpdate[] = updatedJsonDocument[docType]?.FICHE;

                    if (undefined !== refToUpdateValue) {
                      if (Array.isArray(jsonDocumentUpdatedFiche)) {
                        jsonDocumentUpdatedFiche.forEach((fiche: JsonDocumentFicheToUpdate) => {
                          if (fiche[primaryKey].__cdata === refToUpdateValue) {
                            jsonDocumentUpdatedFiche = fiche;
                          }
                        });
                      }
                    }

                    tableUpdateArray.forEach((table: IdylisTableField) => {
                      if (typeguards.isJsonDocumentFiche(jsonDocumentUpdatedFiche)) {
                        const keyToCheck: CDATA = jsonDocumentUpdatedFiche[String(Object.keys(table))];
                        const originValue: string[] = Object.values(keyToCheck);
                        const updatedValue: string[] = Object.values(table);

                        if (typeguards.isCdata(keyToCheck)) {
                          if (String(originValue) === String(updatedValue)) {
                            updateConfirmation = true;
                          } else {
                            /* istanbul ignore next */
                            updateConfirmation = false;
                          }
                        } else {
                          /* istanbul ignore next */
                          updateConfirmation = false;
                        };
                      }
                    });
                  }
                } else {
                  /* istanbul ignore next */
                  updateConfirmation = false;
                };

                // ***************** END OF VERIFICATION THAT UPDATE HAS BEEN SUCCESSFUL ***************** //
              }
            } catch (error) {
              /* istanbul ignore next */
              updateConfirmation = false;
            };
          } else {
            /* istanbul ignore next */
            updateConfirmation = false;
          };
        } else {
          /* istanbul ignore next */
          console.log('primarykey is not a string');
          updateConfirmation = false;
        };
      } else {
        /* istanbul ignore next */
        updateConfirmation = false;
      };
    } else {
      /* istanbul ignore next */
      updateConfirmation = false;
    };
    return updateConfirmation;
  };

  /**
   * @param {string} cFicheMainDoc this represents the main document that
   * needs to be sent to Idylis.
   * @return {Promise<boolean>} this method returns a boolean value indicating
   * whether the insertion was successful or not.
   */
  private async insertMainDoc(cFicheMainDoc: string): Promise<boolean> {
    let cFicheMainDocConfirmation: boolean = false;
    try {
      await this.addSoapClientHeader();
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };
    if (String(this.token) && Number(this.token) !== -1) {
      if (this.client) {
        try {
          const [rawResponse]: string[] = await this.client.InsererTableAsync(
              {_cFiche: `<![CDATA[<?xml version='1.0' encoding='utf-16'?>${cFicheMainDoc}]]>`},
              {timeout: 30000},
          );

          const response: string = JSON.stringify(rawResponse);

          /* istanbul ignore next */ if (response.includes('<error><code>21</code></error>') || response.includes('<error><code>24</code></error>')) {
            this
                .invalidateSoapClient()
                .invalidateApiToken();
            return await this.insertMainDoc(cFicheMainDoc);
          }

          if (response.includes('<success><message>ok</message></success>')) {
            cFicheMainDocConfirmation = true;
          }
        } catch (error) {
          /* istanbul ignore next */
          throw new Error(String(error));
        };
      } else {
        /* istanbul ignore next */ try {
          this.invalidateSoapClient();
          return await this.insertMainDoc(cFicheMainDoc);
        } catch (error) {
          /* istanbul ignore next */
          throw new Error(String(error));
        };
      }
    } else {
      /* istanbul ignore next */ try {
        this
            .invalidateSoapClient()
            .invalidateApiToken();
        return await this.insertMainDoc(cFicheMainDoc);
      } catch (error) {
        /* istanbul ignore next */
        throw new Error(String(error));
      };
    };
    return cFicheMainDocConfirmation;
  };

  /**
   * @param {string} cFicheSubDoc this represents the sub document of a main
   * document that needs to be inserted to Idylis.
   * @return {Promise<boolean>} this method returns a boolean value indicating
   * whether the insertion was successful or not.
   */
  private async insertSubDoc(cFicheSubDoc: string): Promise<boolean> {
    let cFicheSubDocConfirmation: boolean = false;
    try {
      await this.addSoapClientHeader();
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(String(error));
    };
    if (String(this.token) && Number(this.token) !== -1) {
      if (this.client) {
        try {
          const [rawResponse]: string[] = await this.client.InsererTableAsync(
              {_cFiche: `<![CDATA[<?xml version='1.0' encoding='utf-16'?>${cFicheSubDoc}]]>`},
              {timeout: 30000},
          );

          const response: string = JSON.stringify(rawResponse);

          /* istanbul ignore next */ if (response.includes('<error><code>21</code></error>') || response.includes('<error><code>24</code></error>')) {
            this.invalidateApiToken();
            return await this.insertSubDoc(cFicheSubDoc);
          }

          if (response.includes('<success><message>ok</message></success>')) {
            cFicheSubDocConfirmation = true;
          }
        } catch (error) {
          /* istanbul ignore next */
          throw new Error(String(error)); ;
        };
      } else {
        /* istanbul ignore next */ try {
          this.invalidateSoapClient();
          return await this.insertSubDoc(cFicheSubDoc);
        } catch (error) {
          /* istanbul ignore next */
          throw new Error(String(error));
        };
      };
    } else {
      /* istanbul ignore next */ try {
        this.invalidateSoapClient();
        return await this.insertSubDoc(cFicheSubDoc);
      } catch (error) {
        /* istanbul ignore next */
        throw new Error(String(error));
      };
    };
    return cFicheSubDocConfirmation;
  };

  /**
     * @param {string} mainDocType this is the code which represents
     * the type of document that will be sent to Idylis API
     * (e.g..: 'FA_DEVIS', 'FA_BL', etc).
     * @param {IdylisTableField[]} mainDocFieldsArray this represents an array
     * containing objects of pair key value representing
     * the field as the key and the value of that field as the value. Please
     * note that some fields are required. For instance for a quotation,
     * the following fields are required at minimum: CODECLIENT,
     * CODEDEVIS, MODELEDOC, DATECREA. Please also note that the totals
     * must be calculated precisely and correspond exactly to what is
     * expected by Idylis. The rest of the fields depend on your
     * personal configuration of Idylis (e.g.: [{'ADRESSE1': 'My new address'},
     * {'NOMCONTACT': 'John Doe'}]). EXP_ fiels should not be included.
     * @param {string | undefined} subDocType this is the code which
     * represents the sub document which will be added to
     * the main document, if any. Leave empty if not required.
     * @param {IdylisTableField[] | undefined} subDocFieldsArray this represents an array
     * containing objects of pair key value representing
     * the field as the key and the value of that field as the value.
     * (e.g.: [{'PU': '150.00'}, {'DESCRIPTIF': 'T-shirt XL New Design'}]).
     * Leave empty if not required.
     * @return {Promise<boolean>} the function returns a boolean indicating
     * whether the quotation was successfully sent to Idylis API or not.
    */
  public async insertDocument(
      mainDocType: string,
      mainDocFieldsArray: IdylisTableField[],
      subDocType?: string,
      subDocFieldsArray?: IdylisTableField[],
  ): Promise<boolean> {
    let cFicheMainDocXml: string = '';
    let cFicheSubDocXml: string = '';
    let cFicheMainDocConfirmation: boolean = false;
    let cFicheSubDocConfirmation: boolean = false;
    let finalConfirmation: boolean = false;
    let cFicheMainDoc: MajTableJson;
    let cFicheSubDocJson: MajTableJson;

    if (this.code !== undefined && this.id !== undefined && this.pwd !== undefined) {
      cFicheMainDoc = {
        [mainDocType]: {
          FICHE: {},
        },
      };

      mainDocFieldsArray.forEach((table: IdylisTableField) => {
        const keyToCreate: string[] = Object.keys(table);
        const valueToCreate: string[] = Object.values(table);
        if (String(keyToCreate) !== '') {
          cFicheMainDoc[mainDocType].FICHE[String(keyToCreate)] =
              `<![CDATA[${Object.values({__cdata: String(valueToCreate)})}]]]]><![CDATA[>`;
        }
      });

      cFicheMainDocXml = j2xParser.parse(cFicheMainDoc);

      if (Parser.validate(cFicheMainDocXml) &&'' !== cFicheMainDocXml) {
        try {
          cFicheMainDocConfirmation = await this.insertMainDoc(cFicheMainDocXml);
        } catch (error) {
          /* istanbul ignore next */
          throw new Error(String(error));
        };

        // If there is a sub doc type to add to the main doc type
        if (subDocType && subDocFieldsArray) {
          cFicheSubDocJson = {
            [subDocType]: {
              FICHE: {},
            },
          };

          subDocFieldsArray.forEach((table: IdylisTableField) => {
            const keyToCreate: string[] = Object.keys(table);
            const valueToCreate: string[] = Object.values(table);
            if (String(keyToCreate) !== '') {
              cFicheSubDocJson[subDocType].FICHE[String(keyToCreate)] =
            `<![CDATA[${Object.values({__cdata: String(valueToCreate)})}]]]]><![CDATA[>`;
            }
          });

          cFicheSubDocXml = j2xParser.parse(cFicheSubDocJson);

          if ('' !== cFicheSubDocXml) {
            if (cFicheMainDocConfirmation) {
              try {
                cFicheSubDocConfirmation = await this.insertSubDoc(cFicheSubDocXml);
              } catch (error) {
                /* istanbul ignore next */
                throw new Error(String(error));
              };
            } else {
              /* istanbul ignore next */
              throw new Error(`The base of a quotation couldn't be written successfully on Idylis.`);
            };
          } else {
            /* istanbul ignore next */
            throw new Error(`Either the document for the mainDoc or the subDoc is not a valid XML. Please check and try again.`);
          };
          if (cFicheSubDocConfirmation && cFicheMainDocConfirmation) {
            finalConfirmation = true;
          }
        } else {
          if (cFicheMainDocConfirmation) {
            finalConfirmation = true;
          }
        };
      } else {
        /* istanbul ignore next */
        throw new Error(`The XML for the mainDoc is invalid. Please check and try again.`);
      };
    } else {
      /* istanbul ignore next */
      throw new Error(`Either the code, id or password is missing. Please verify your credentials and try again.`);
    };
    return finalConfirmation;
  };
};
