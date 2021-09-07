import IdylisAPI from "./IdylisAPI";

/**
 * @param {string} url the url to connect to your Idylis API endpoint
 * @param {string} code the Code Abonné linked to the user Idylis account
 * @param {string} id the Identifiant used to connect to the user Idylis account
 * @param {string} pwd the Mot de Passe used to connect
 * to the user Idylis account
 * @param {string} xmlnsAddress the xmlns address
 * to be used inside the soap header
 * to make calls to the Idylis API
 * @return {IdylisAPI} this function returns a usable instance of IdylisAPI.
*/
export default function idylisapi(
    url: string,
    code: string,
    id: string,
    pwd: string,
    xmlnsAddress: string,
): IdylisAPI {
  const idylisapi = new IdylisAPI(
      url,
      code,
      id,
      pwd,
      xmlnsAddress,
  );
  return idylisapi;
}
