import { ConnectionStatus } from "./connection_status"

export class Connection {

  private status: ConnectionStatus;
  private connected: boolean;
  
  public getStatus(): ConnectionStatus {
    return this.status;
  }
  public setStatus(value: ConnectionStatus) {
    this.status = value;
  }

  public isConnected(): boolean {
    return this.connected;
  }
  public setConnected(value: boolean) {
    this.connection = value;
  }

  constructor(
    status: string,
    connected: boolean
  ) {
    this.status = status;
    this.connected = connected;
  }
}
