type EventCallback = (data: any) => void;

interface SocketEventBus {
  subscribe(event: string, callback: EventCallback): void;
  unsubscribe(event: string, callback: EventCallback): void;
  publish(event: string, data: any): void;
}

class MockWebSocket implements SocketEventBus {
  private listeners: { [event: string]: EventCallback[] } = {};

  constructor() {
    console.log('MockWebSocket initialized.');
    // Simulate incoming messages
    setInterval(() => {
      this.publish('positionUpdate', { vehicleId: 'V101', lat: 34.0522 + (Math.random() - 0.5) * 0.01, lon: -118.2437 + (Math.random() - 0.5) * 0.01, timestamp: Date.now() });
      this.publish('etaUpdate', { vehicleId: 'V101', eta: Math.floor(Math.random() * 60) + 10, timestamp: Date.now() });
      if (Math.random() > 0.9) {
        this.publish('alert', { type: 'warning', message: 'Vehicle V101 deviating from route!', timestamp: Date.now() });
      }
    }, 5000);
  }

  subscribe(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    console.log(`Subscribed to ${event}`);
  }

  unsubscribe(event: string, callback: EventCallback): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      console.log(`Unsubscribed from ${event}`);
    }
  }

  publish(event: string, data: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

class RealWebSocket implements SocketEventBus {
  private ws: WebSocket | null = null;
  private listeners: { [event: string]: EventCallback[] } = {};
  private socketUrl: string;

  constructor(url: string) {
    this.socketUrl = url;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.socketUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected.');
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event && this.listeners[message.event]) {
          this.listeners[message.event].forEach(callback => callback(message.data));
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...');
      setTimeout(() => this.connect(), 3000); // Reconnect after 3 seconds
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.ws?.close();
    };
  }

  subscribe(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    console.log(`Subscribed to ${event}`);
  }

  unsubscribe(event: string, callback: EventCallback): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      console.log(`Unsubscribed from ${event}`);
    }
  }

  publish(event: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    } else {
      console.warn('WebSocket not open. Cannot publish message.');
    }
  }
}

// Use a feature flag to switch between mock and real WebSocket
const USE_MOCK_SOCKET = import.meta.env.VITE_USE_MOCK_SOCKET === 'true';
const REAL_SOCKET_URL = import.meta.env.VITE_REAL_SOCKET_URL || 'ws://localhost:8080'; // Default or from env

export const socket: SocketEventBus = USE_MOCK_SOCKET ? new MockWebSocket() : new RealWebSocket(REAL_SOCKET_URL);
