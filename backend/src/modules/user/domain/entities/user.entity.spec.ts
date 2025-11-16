import { User, UserRegisteredEvent, PointsAddedEvent, PointsRedeemedEvent } from './user.entity';
import { RoleReference } from 'src/shared/domain/role-reference.enum';

describe('User Entity', () => {
  describe('Creation', () => {
    it('should create a recycler user', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      expect(user).toBeDefined();
      expect(user.name).toBe('João Silva');
      expect(user.email).toBe('joao@example.com');
      expect(user.role).toBe(RoleReference.RECYCLER);
      expect(user.pointsBalance).toBe(0);
      expect(user.id).toBeDefined();
    });

    it('should create an eco-operator user', async () => {
      const user = await User.create({
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: 'password123',
        role: RoleReference.ECOOPERATOR,
      });

      expect(user.role).toBe(RoleReference.ECOOPERATOR);
      expect(user.isEcoOperator()).toBe(true);
      expect(user.isRecycler()).toBe(false);
    });

    it('should emit UserRegisteredEvent on creation', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      const events = user.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserRegisteredEvent);
      expect((events[0] as UserRegisteredEvent).email).toBe('joao@example.com');
      expect((events[0] as UserRegisteredEvent).role).toBe(RoleReference.RECYCLER);
    });

    it('should create user with ecopoint assignment', async () => {
      const user = await User.create({
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: 'password123',
        role: RoleReference.ECOOPERATOR,
        ecopointId: 'ecopoint-123',
      });

      expect(user.ecopointId).toBe('ecopoint-123');
    });

    it('should hash the password on creation', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      expect(user.passwordHash).not.toBe('password123');
      expect(user.passwordHash.length).toBeGreaterThan(20);
    });
  });

  describe('Reconstitution', () => {
    it('should reconstitute user from persistence', () => {
      const user = User.reconstitute({
        id: 'user-123',
        name: 'João Silva',
        email: 'joao@example.com',
        passwordHash: '$2b$10$hashedpassword',
        role: RoleReference.RECYCLER,
        pointsBalance: 100,
      });

      expect(user.id).toBe('user-123');
      expect(user.name).toBe('João Silva');
      expect(user.pointsBalance).toBe(100);
    });

    it('should not emit events when reconstituting', () => {
      const user = User.reconstitute({
        id: 'user-123',
        name: 'João Silva',
        email: 'joao@example.com',
        passwordHash: '$2b$10$hashedpassword',
        role: RoleReference.RECYCLER,
        pointsBalance: 100,
      });

      expect(user.getDomainEvents()).toHaveLength(0);
    });
  });

  describe('Password Verification', () => {
    it('should verify correct password', async () => {
      const password = 'password123';
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password,
        role: RoleReference.RECYCLER,
      });

      const isValid = await user.verifyPassword(password);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      const isValid = await user.verifyPassword('wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('Points Management', () => {
    it('should add points from collection', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      user.clearDomainEvents();
      user.addPointsFromCollection('collection-1', 100);

      expect(user.pointsBalance).toBe(100);
    });

    it('should emit PointsAddedEvent when adding points', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      user.clearDomainEvents();
      user.addPointsFromCollection('collection-1', 100);

      const events = user.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PointsAddedEvent);

      const event = events[0] as PointsAddedEvent;
      expect(event.points).toBe(100);
      expect(event.collectionId).toBe('collection-1');
      expect(event.totalBalance).toBe(100);
    });

    it('should accumulate points from multiple collections', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      user.addPointsFromCollection('collection-1', 100);
      user.addPointsFromCollection('collection-2', 50);
      user.addPointsFromCollection('collection-3', 25);

      expect(user.pointsBalance).toBe(175);
    });

    it('should throw error when adding zero or negative points', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      expect(() => user.addPointsFromCollection('collection-1', 0)).toThrow(
        'Points to add must be greater than zero'
      );
      expect(() => user.addPointsFromCollection('collection-1', -50)).toThrow(
        'Points to add must be greater than zero'
      );
    });

    it('should redeem points successfully', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      user.addPointsFromCollection('collection-1', 100);
      user.clearDomainEvents();

      user.redeemPoints(50, 'Troca por produto');

      expect(user.pointsBalance).toBe(50);
    });

    it('should emit PointsRedeemedEvent when redeeming', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      user.addPointsFromCollection('collection-1', 100);
      user.clearDomainEvents();

      user.redeemPoints(50, 'Troca por produto');

      const events = user.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PointsRedeemedEvent);

      const event = events[0] as PointsRedeemedEvent;
      expect(event.points).toBe(50);
      expect(event.description).toBe('Troca por produto');
      expect(event.remainingBalance).toBe(50);
    });

    it('should throw error when redeeming more points than available', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      user.addPointsFromCollection('collection-1', 100);

      expect(() => user.redeemPoints(150, 'Tentativa inválida')).toThrow('Insufficient points');
    });

    it('should throw error when redeeming zero or negative points', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      expect(() => user.redeemPoints(0, 'Invalid')).toThrow(
        'Points to redeem must be greater than zero'
      );
      expect(() => user.redeemPoints(-50, 'Invalid')).toThrow(
        'Points to redeem must be greater than zero'
      );
    });
  });

  describe('User Updates', () => {
    it('should update name', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      user.updateName('João Pedro Silva');
      expect(user.name).toBe('João Pedro Silva');
    });

    it('should throw error for empty name', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      expect(() => user.updateName('')).toThrow('Name cannot be empty');
      expect(() => user.updateName('   ')).toThrow('Name cannot be empty');
    });

    it('should update email', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      user.updateEmail('newemail@example.com');
      expect(user.email).toBe('newemail@example.com');
    });

    it('should update password', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'oldpassword',
        role: RoleReference.RECYCLER,
      });

      const oldHash = user.passwordHash;
      await user.updatePassword('newpassword123');

      expect(user.passwordHash).not.toBe(oldHash);
      expect(await user.verifyPassword('newpassword123')).toBe(true);
      expect(await user.verifyPassword('oldpassword')).toBe(false);
    });
  });

  describe('Ecopoint Assignment', () => {
    it('should assign eco-operator to ecopoint', async () => {
      const user = await User.create({
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: 'password123',
        role: RoleReference.ECOOPERATOR,
      });

      user.assignToEcopoint('ecopoint-123');
      expect(user.ecopointId).toBe('ecopoint-123');
    });

    it('should throw error when assigning recycler to ecopoint', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      expect(() => user.assignToEcopoint('ecopoint-123')).toThrow(
        'Only eco-operators can be assigned to ecopoints'
      );
    });
  });

  describe('Role Checks', () => {
    it('should correctly identify recycler', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      expect(user.isRecycler()).toBe(true);
      expect(user.isEcoOperator()).toBe(false);
    });

    it('should correctly identify eco-operator', async () => {
      const user = await User.create({
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: 'password123',
        role: RoleReference.ECOOPERATOR,
      });

      expect(user.isEcoOperator()).toBe(true);
      expect(user.isRecycler()).toBe(false);
    });
  });

  describe('JSON Serialization', () => {
    it('should serialize to JSON correctly', async () => {
      const user = await User.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'password123',
        role: RoleReference.RECYCLER,
      });

      user.addPointsFromCollection('collection-1', 100);

      const json = user.toJSON();

      expect(json.name).toBe('João Silva');
      expect(json.email).toBe('joao@example.com');
      expect(json.role).toBe(RoleReference.RECYCLER);
      expect(json.pointsBalance).toBe(100);
      expect(json.id).toBeDefined();
    });
  });
});
