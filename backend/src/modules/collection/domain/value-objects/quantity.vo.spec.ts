import { Quantity } from './quantity.vo';

describe('Quantity Value Object', () => {
  describe('Creation', () => {
    it('should create quantity with valid value', () => {
      const quantity = Quantity.create(10);
      expect(quantity.getValue()).toBe(10);
    });

    it('should create quantity with value 1', () => {
      const quantity = Quantity.create(1);
      expect(quantity.getValue()).toBe(1);
    });

    it('should create large quantity', () => {
      const quantity = Quantity.create(1000);
      expect(quantity.getValue()).toBe(1000);
    });
  });

  describe('Validation', () => {
    it('should throw error for zero quantity', () => {
      expect(() => Quantity.create(0)).toThrow('Quantity must be greater than zero');
    });

    it('should throw error for negative quantity', () => {
      expect(() => Quantity.create(-5)).toThrow('Quantity must be greater than zero');
    });

    it('should throw error for decimal quantity', () => {
      expect(() => Quantity.create(5.5)).toThrow('Quantity must be an integer');
    });

    it('should throw error for small decimal', () => {
      expect(() => Quantity.create(1.1)).toThrow('Quantity must be an integer');
    });
  });

  describe('Addition', () => {
    it('should add two quantities correctly', () => {
      const quantity1 = Quantity.create(10);
      const quantity2 = Quantity.create(5);

      const result = quantity1.add(quantity2);
      expect(result.getValue()).toBe(15);
    });

    it('should not modify original quantities when adding', () => {
      const quantity1 = Quantity.create(10);
      const quantity2 = Quantity.create(5);

      quantity1.add(quantity2);

      expect(quantity1.getValue()).toBe(10);
      expect(quantity2.getValue()).toBe(5);
    });

    it('should add large quantities', () => {
      const quantity1 = Quantity.create(500);
      const quantity2 = Quantity.create(300);

      const result = quantity1.add(quantity2);
      expect(result.getValue()).toBe(800);
    });
  });

  describe('Multiplication', () => {
    it('should multiply quantity by factor', () => {
      const quantity = Quantity.create(10);
      const result = quantity.multiply(5);

      expect(result).toBe(50);
    });

    it('should multiply by decimal factor', () => {
      const quantity = Quantity.create(10);
      const result = quantity.multiply(2.5);

      expect(result).toBe(25);
    });

    it('should multiply by zero', () => {
      const quantity = Quantity.create(10);
      const result = quantity.multiply(0);

      expect(result).toBe(0);
    });

    it('should multiply by one', () => {
      const quantity = Quantity.create(10);
      const result = quantity.multiply(1);

      expect(result).toBe(10);
    });

    it('should not modify original quantity when multiplying', () => {
      const quantity = Quantity.create(10);
      quantity.multiply(5);

      expect(quantity.getValue()).toBe(10);
    });
  });

  describe('Comparison', () => {
    it('should correctly identify equality', () => {
      const quantity1 = Quantity.create(10);
      const quantity2 = Quantity.create(10);

      expect(quantity1.equals(quantity2)).toBe(true);
    });

    it('should correctly identify inequality', () => {
      const quantity1 = Quantity.create(10);
      const quantity2 = Quantity.create(5);

      expect(quantity1.equals(quantity2)).toBe(false);
    });
  });

  describe('String Conversion', () => {
    it('should convert to string correctly', () => {
      const quantity = Quantity.create(10);
      expect(quantity.toString()).toBe('10');
    });

    it('should convert large number to string', () => {
      const quantity = Quantity.create(999);
      expect(quantity.toString()).toBe('999');
    });
  });
});
