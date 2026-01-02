import { DomainEvent, AllDomainEvents } from '../../domain/events/index.js';

type EventHandler = (event: DomainEvent) => void | Promise<void>;

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Subscribe to a specific event
   */
  on(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  /**
   * Publish an event to all subscribers
   */
  async publish(event: AllDomainEvents): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || [];
    
    // Execute all handlers (could be made parallel if needed)
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error handling event ${event.eventName}:`, error);
        // Continue with other handlers even if one fails
      }
    }
  }

  /**
   * Remove all handlers for an event
   */
  clear(eventName: string): void {
    this.handlers.delete(eventName);
  }

  /**
   * Remove all handlers
   */
  clearAll(): void {
    this.handlers.clear();
  }
}

// Singleton instance
export const eventBus = new EventBus();
