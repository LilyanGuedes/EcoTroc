import { Email } from './email.vo';

describe('Email Value Object', () => {
  describe('Creation', () => {
    it('should create a valid email', () => {
      const email = new Email('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should accept email with subdomain', () => {
      const email = new Email('user@mail.example.com');
      expect(email.getValue()).toBe('user@mail.example.com');
    });

    it('should accept email with numbers', () => {
      const email = new Email('user123@example123.com');
      expect(email.getValue()).toBe('user123@example123.com');
    });

    it('should accept email with special characters', () => {
      const email = new Email('user.name+tag@example.com');
      expect(email.getValue()).toBe('user.name+tag@example.com');
    });
  });

  describe('Validation', () => {
    it('should throw error for invalid email without @', () => {
      expect(() => new Email('invalidemail.com')).toThrow('Invalid email format');
    });

    it('should throw error for invalid email without domain', () => {
      expect(() => new Email('user@')).toThrow('Invalid email format');
    });

    it('should throw error for invalid email without user', () => {
      expect(() => new Email('@example.com')).toThrow('Invalid email format');
    });

    it('should throw error for invalid email with spaces', () => {
      expect(() => new Email('user @example.com')).toThrow('Invalid email format');
    });

    it('should throw error for empty email', () => {
      expect(() => new Email('')).toThrow('Invalid email format');
    });

    it('should throw error for email without TLD', () => {
      expect(() => new Email('user@example')).toThrow('Invalid email format');
    });
  });
});
