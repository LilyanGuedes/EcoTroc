import { Password } from './password.vo';

describe('Password Value Object', () => {
  describe('Creation', () => {
    it('should create a valid password', async () => {
      const password = await Password.create('password123');
      expect(password).toBeDefined();
      expect(password.getHashedValue()).toBeDefined();
    });

    it('should hash the password', async () => {
      const plainPassword = 'password123';
      const password = await Password.create(plainPassword);

      expect(password.getHashedValue()).not.toBe(plainPassword);
      expect(password.getHashedValue().length).toBeGreaterThan(20);
    });

    it('should create different hashes for same password', async () => {
      const password1 = await Password.create('password123');
      const password2 = await Password.create('password123');

      // Bcrypt usa salt aleatório, então os hashes são diferentes
      expect(password1.getHashedValue()).not.toBe(password2.getHashedValue());
    });
  });

  describe('Validation', () => {
    it('should throw error for password shorter than 8 characters', async () => {
      await expect(Password.create('short')).rejects.toThrow(
        'Password must be at least 8 characters long'
      );
    });

    it('should throw error for 7 character password', async () => {
      await expect(Password.create('1234567')).rejects.toThrow(
        'Password must be at least 8 characters long'
      );
    });

    it('should accept exactly 8 characters', async () => {
      const password = await Password.create('12345678');
      expect(password).toBeDefined();
    });

    it('should accept long password', async () => {
      const password = await Password.create('verylongpassword123456789');
      expect(password).toBeDefined();
    });
  });

  describe('Comparison', () => {
    it('should correctly compare valid password', async () => {
      const plainPassword = 'password123';
      const password = await Password.create(plainPassword);

      const isValid = await password.compare(plainPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = await Password.create('password123');

      const isValid = await password.compare('wrongpassword');
      expect(isValid).toBe(false);
    });

    it('should reject similar but different password', async () => {
      const password = await Password.create('password123');

      const isValid = await password.compare('password124');
      expect(isValid).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = await Password.create('Password123');

      const isValid = await password.compare('password123');
      expect(isValid).toBe(false);
    });
  });

  describe('From Hash', () => {
    it('should create password from existing hash', async () => {
      const original = await Password.create('password123');
      const hash = original.getHashedValue();

      const fromHash = Password.fromHash(hash);
      expect(fromHash.getHashedValue()).toBe(hash);
    });

    it('should validate correctly when created from hash', async () => {
      const original = await Password.create('password123');
      const hash = original.getHashedValue();

      const fromHash = Password.fromHash(hash);
      const isValid = await fromHash.compare('password123');

      expect(isValid).toBe(true);
    });
  });
});
