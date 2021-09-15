export interface LireTable {
  _nomtable: string;
  _criteres: string;
  _ordre: string;
  _soustables: number;
  _pieceatache: number;
  _aveccompression: number;
}

export interface Auth3 {
  _codeAbonne: string,
  _identifiant: string,
  _motdePasse: string,
}

export interface AuthentificationAvec3Parametres1 {
  AuthentificationAvec3Parametres1Result: string,
}

export interface LireTableResult {
  LireTableResult: string,
}

export interface MajTableResult {
  MajTableResult: string,
}

export interface IdylisTableField {
  [fieldValue: string]: string
}

export interface ParseOptions {
  attributeNamePrefix: string;
  attrNodeName: string;
  textNodeName: string;
  ignoreAttributes: boolean;
  ignoreNameSpace?: boolean;
  allowBooleanAttributes?: false;
  parseNodeValue?: true;
  parseAttributeValue?: false;
  trimValues?: true;
  cdataTagName: string;
  cdataPositionChar: string;
  parseTrueNumberOnly?: boolean;
  arrayMode?: boolean;
  format?: boolean;
  indentBy?: string;
  supressEmptyNode?: boolean;
  tagValueProcessor: (a: any) => string;
  attrValueProcessor: (a: any) => string;
}

export interface CDATA {
  __cdata: string
}

interface FICHE {
  [table: string]: CDATA
}

interface FICHEXML {
  [table: string]: string
}

interface ORIGINFICHE {
  CRITERES: CDATA,
  ORDRE: CDATA,
  FICHE: FICHE | FICHE[]
}

interface MAJTABLEFICHE {
  CRITERES?: CDATA,
  ORDRE?: CDATA,
  FICHE: FICHEXML
}

export interface OriginJsonDocument {
  [ficheName: string]: ORIGINFICHE
}

export interface JsonDocumentFicheToUpdate {
  [table: string]: CDATA
}
export interface MajTableJson {
  [fieldValue: string]: MAJTABLEFICHE
}
