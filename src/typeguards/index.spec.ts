import {typeguards, Typeguards} from '.';

describe('The typeguards object', () => {
  test('should contain a new instance of typeguards', () => {
    expect(typeguards)
        .toBeInstanceOf(Typeguards);
  });

  describe('has a method isString', () => {
    test('that should return a boolean', () => {
      expect(typeof typeguards.isString('test string'))
          .toBe('boolean');
    });
  });

  describe('has a method isPrimaryKeyValue', () => {
    test('that should return a boolean', () => {
      expect(typeof typeguards.isPrimaryKeyValue('FA_BL'))
          .toBe('boolean');
    });
  });

  describe('has a method isCdata', () => {
    test('that should return a boolean', () => {
      expect(typeof typeguards.isCdata({__cdata: 'data'}))
          .toBe('boolean');
    });
  });

  describe('has a method isJsonDocumentFiche', () => {
    test('that should return a boolean', () => {
      expect(typeof typeguards.isJsonDocumentFiche(undefined))
          .toBe('boolean');
    });
  });
});
