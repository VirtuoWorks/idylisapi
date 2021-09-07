import idylisapi from '.';
import IdylisAPI from './IdylisAPI';

describe('The idylisapi function', () => {
  test('should allow us to get a new instance of IdylisAPI', () => {
    expect(idylisapi(
        'https://exe.idylis.com//Idylisapi.asmx',
        String(process.env.CODEABONNE) || '',
        String(process.env.IDENTIFIANT) || '',
        String(process.env.MOTDEPASSE) || '',
        'https://www.idylis.com/Idylisapi.asmx/',
    ))
        .toBeInstanceOf(IdylisAPI);
  });
});
