export class Points {
  private constructor(private readonly value: number) {
    if (value < 0) {
      throw new Error('Points cannot be negative');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Points must be an integer');
    }
  }

  static create(value: number): Points {
    return new Points(value);
  }

  static zero(): Points {
    return new Points(0);
  }

  add(other: Points): Points {
    return new Points(this.value + other.value);
  }

  subtract(other: Points): Points {
    const result = this.value - other.value;
    if (result < 0) {
      throw new Error('Insufficient points');
    }
    return new Points(result);
  }

  getValue(): number {
    return this.value;
  }

  isGreaterThan(other: Points): boolean {
    return this.value > other.value;
  }

  isLessThan(other: Points): boolean {
    return this.value < other.value;
  }

  equals(other: Points): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}