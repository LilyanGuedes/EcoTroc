export class Email {
  constructor(private readonly value: string) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error('Invalid email format');
    }
  }
  getValue(): string {
    return this.value;
  }
}
