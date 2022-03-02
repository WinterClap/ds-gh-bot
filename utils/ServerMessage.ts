export class ServerMessage {
  message: string;
  status: number;
  type: string;

  constructor(message: string, status: number, type?: string) {
    this.message = message;
    this.status = status;
    type && (this.type = type);
  }
}
