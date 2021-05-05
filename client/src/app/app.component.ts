import { Component } from '@angular/core';

export class Message {
  constructor(
      public content: string | null,
      public isBroadcast = false,
      public sender: string | null = 'client',
  ) { }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public sseMessage: Message = {
    content: null,
    isBroadcast: false,
    sender: null,
  };
  public clientId: string = 'client-' + this.generateRandomId();

  // Create WebSocket connection.
  private socket: WebSocket = new WebSocket('ws://localhost:8999');

  constructor() {
    // Listen for messages
    this.socket.addEventListener('message', (event: MessageEvent<string>) => {
        this.sseMessage = JSON.parse(event.data) as Message;
        console.log("Received message: ", this.sseMessage);
    });
  }

  public sendMessage(content: string, isBroadcast: boolean = true): void {
    console.log(`Send message with content "${content}" and isBroacast "${isBroadcast}" as client "${this.clientId}"`);
    this.socket.send(JSON.stringify(new Message(content, isBroadcast, this.clientId)));
  }

  private generateRandomId(): string {
    let n: string = '';

    for (let i = 0; i < 6; i++) {
      n += Math.floor(Math.random() * 10);
    }

    return n;
  }
}
