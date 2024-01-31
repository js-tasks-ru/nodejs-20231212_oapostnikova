const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('проверка минимальной длины строки', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('проверка максимальной длины строки', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 0,
          max: 2,
        },
      });

      const errors = validator.validate({ name: 'Абдурахмангаджи' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 2, got 15');
    });

    it('валидная строка максимальной длины', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 0,
          max: 2,
        },
      });

      const errors = validator.validate({ name: 'Ия' });

      expect(errors).to.have.length(0);
    });

    it('валидная строка минимальной длины', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 10,
        },
      });

      const errors = validator.validate({ name: 'Ия' });

      expect(errors).to.have.length(0);
    });

    it('проверка минимального значения числа', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 0,
          max: 200,
        },
      });

      const errors = validator.validate({ age: -1 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 0, got -1');
    });

    it('проверка максимального значения числа', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 0,
          max: 200,
        },
      });

      const errors = validator.validate({ age: 100500 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 200, got 100500');
    });

    it('валидное минимальное число', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 0,
          max: 200,
        },
      });

      const errors = validator.validate({ age: 0 });

      expect(errors).to.have.length(0);
    });

    it('валидное максимальное число', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 0,
          max: 200,
        },
      });

      const errors = validator.validate({ age: 200 });

      expect(errors).to.have.length(0);
    });

    it('несколько ошибок', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 10,
        },
        age: {
          type: 'number',
          min: 0,
          max: 200,
        },
        dreams: {
          type: 'number',
          min: 0,
          max: 100,
        },
      });

      const errors = validator.validate({ name: 'Абдурахмангаджи', age: 201, dreams: 1000 });

      expect(errors).to.have.length(3);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 15');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too big, expect 200, got 201');
      expect(errors[2]).to.have.property('field').and.to.be.equal('dreams');
      expect(errors[2]).to.have.property('error').and.to.be.equal('too big, expect 100, got 1000');
    });

    it('проверка типа', () => {
      const validator = new Validator({
        name: {
          type: 'number',
        }
      });

      const errors = validator.validate({ name: 'Просто кот' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('неизвестный тип', () => {
      const validator = new Validator({
        name: {
          type: 'function',
        }
      });

      const errors = validator.validate({ name: 'Просто кот' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect function, got string');
    });

    it('проверка несуществующего поля', () => {
      const validator = new Validator({
        unexpectedField: {
          type: 'string',
          min: 0,
          max: 100,
        }
      });

      const errors = validator.validate({ name: 'Просто кот' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('unexpectedField');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got undefined');
    });
  });
});