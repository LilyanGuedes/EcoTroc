import { DomainEvent } from './domain-event.base';

export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return this._domainEvents.slice();
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  public hasDomainEvents(): boolean {
    return this._domainEvents.length > 0;
  }
}
