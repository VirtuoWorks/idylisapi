import {CDATA, JsonDocumentFicheToUpdate} from "./interfaces";


/**
 * This class offers different methods to check the type of the data passed
 * as an argument.
 */
export class Typeguards {
  /**
   * The constructor does not require any parameter.
   */
  constructor() { }

  /**
   *
   * @param {string} str A piece of data we want to confirm being of type string
   * @return {boolean} The function returns true if the type of the data
   * is the one expected
   */
  isString(
      str: string | any
  ): str is string {
    return "string" === typeof str || str instanceof String;
  };

  /**
   *
   * @param {string | void} primaryKeyValue A piece of data we want to confirm
   * as being of type string
   * @return {boolean} The function returns true if the type of the data
   * is the one expected
   */
  isPrimaryKeyValue(
      primaryKeyValue: string | void,
  ): primaryKeyValue is string {
    return !!primaryKeyValue;
  };

  /**
   *
   * @param {CDATA} cData A piece of data we want to confirm
   * as being of type CDATA
   * @return {boolean} The function returns true if the type of
   * the data is the one expected
   */
  isCdata(cData: CDATA | string): cData is CDATA {
    return !!cData;
  };

  /**
   *
   * @param {JsonDocumentFicheToUpdate | void} jsonDocument
   * A piece of data we want to confirm
   * as being of type JsonDocumentFicheToUpdate
   * @return {boolean} The function returns true if the type of the data
   * is the one expected
   */
  isJsonDocumentFiche(
      jsonDocument: JsonDocumentFicheToUpdate | void,
  ): jsonDocument is JsonDocumentFicheToUpdate {
    return !!jsonDocument;
  };
}

export const typeguards = new Typeguards();
