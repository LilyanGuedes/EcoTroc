import { Points } from './points.vo';

describe('Points Value Object', () => {
  describe('Creation', () => {
    it('should create points with valid value', () => {
      const points = Points.create(100);
      expect(points.getValue()).toBe(100);
    });

    it('should create zero points', () => {
      const points = Points.zero();
      expect(points.getValue()).toBe(0);
    });

    it('should create points with zero using create', () => {
      const points = Points.create(0);
      expect(points.getValue()).toBe(0);
    });

    it('should create large number of points', () => {
      const points = Points.create(999999);
      expect(points.getValue()).toBe(999999);
    });
  });

  describe('Validation', () => {
    it('should throw error for negative points', () => {
      expect(() => Points.create(-1)).toThrow('Points cannot be negative');
    });

    it('should throw error for large negative points', () => {
      expect(() => Points.create(-100)).toThrow('Points cannot be negative');
    });

    it('should throw error for decimal points', () => {
      expect(() => Points.create(10.5)).toThrow('Points must be an integer');
    });

    it('should throw error for small decimal', () => {
      expect(() => Points.create(1.1)).toThrow('Points must be an integer');
    });
  });

  describe('Addition', () => {
    it('should add two points correctly', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(30);

      const result = points1.add(points2);
      expect(result.getValue()).toBe(80);
    });

    it('should add zero points', () => {
      const points1 = Points.create(50);
      const points2 = Points.zero();

      const result = points1.add(points2);
      expect(result.getValue()).toBe(50);
    });

    it('should not modify original points when adding', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(30);

      points1.add(points2);

      expect(points1.getValue()).toBe(50);
      expect(points2.getValue()).toBe(30);
    });
  });

  describe('Subtraction', () => {
    it('should subtract points correctly', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(30);

      const result = points1.subtract(points2);
      expect(result.getValue()).toBe(20);
    });

    it('should subtract to zero', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(50);

      const result = points1.subtract(points2);
      expect(result.getValue()).toBe(0);
    });

    it('should throw error when subtracting more than available', () => {
      const points1 = Points.create(30);
      const points2 = Points.create(50);

      expect(() => points1.subtract(points2)).toThrow('Insufficient points');
    });

    it('should not modify original points when subtracting', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(30);

      points1.subtract(points2);

      expect(points1.getValue()).toBe(50);
      expect(points2.getValue()).toBe(30);
    });
  });

  describe('Comparison', () => {
    it('should correctly identify greater than', () => {
      const points1 = Points.create(100);
      const points2 = Points.create(50);

      expect(points1.isGreaterThan(points2)).toBe(true);
      expect(points2.isGreaterThan(points1)).toBe(false);
    });

    it('should correctly identify less than', () => {
      const points1 = Points.create(50);
      const points2 = Points.create(100);

      expect(points1.isLessThan(points2)).toBe(true);
      expect(points2.isLessThan(points1)).toBe(false);
    });

    it('should correctly identify equality', () => {
      const points1 = Points.create(100);
      const points2 = Points.create(100);

      expect(points1.equals(points2)).toBe(true);
      expect(points1.isGreaterThan(points2)).toBe(false);
      expect(points1.isLessThan(points2)).toBe(false);
    });

    it('should handle zero comparisons', () => {
      const points = Points.create(0);
      const zero = Points.zero();

      expect(points.equals(zero)).toBe(true);
    });
  });

  describe('String Conversion', () => {
    it('should convert to string correctly', () => {
      const points = Points.create(100);
      expect(points.toString()).toBe('100');
    });

    it('should convert zero to string', () => {
      const points = Points.zero();
      expect(points.toString()).toBe('0');
    });
  });
});
