export class Quantity {
  private constructor(private readonly value: number) {
    if (value <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }
  }

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  getValue(): number {
    return this.value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }

  multiply(factor: number): number {
    return this.value * factor;
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}