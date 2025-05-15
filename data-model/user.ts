import { Connection } from "./connection";
import { UserStatus } from "./user_status";

export class User {
  private admin: boolean;
  private first_name: string;
  private last_name: string;
  private phone_number: string;
  private email: string;
  private status: UserStatus;
  private notes: string;
  private connections: Map<string, Connection>;
  
  constructor(
    admin: boolean,
    first_name: string,
    last_name: string,
    email: string,
    status?: UserStatus | UserStatus.Pending,
    phone_number?: string | null,
    notes?: string | null,
    connections?: Map<string, Connection> | null,
  ) {
    this.admin = admin;
    this.first_name = first_name;
    this.last_name = last_name;
    this.status = status;
    this.email = email;
    this.phone_number = phone_number;
    this.notes = notes;
    if (connections) {
      this.connections = connections;
    } else {
      this.connections = new Map<string, Connections>([
        ['Android', null],
        ['WhatsApp', null],
        ['iMessage', null] 
      ]);
    }
  }

  // Getters

  isAdmin(): boolean {
    return this.admin;
  }

  getFirstName(): string {
    return this.first_name;
  }

  getLast_Name(): string {
    return this.last_name;
  }

  getPhoneNumber(): string {
    return this.phone_number;
  }

  getEmail(): string {
    return this.email;
  }
  
  getNotes(): string {
    return this.notes;
  }

  getConnections(): Map<string, Connection> {
    return this.connections;
  }

  // Setters

  setAdmin(admin: boolean): void {
    this.admin = admin;
  }
  
  setFirstName(first_name: string): void {
    this.first_name = first_name;
  }

  setLastName(last_name: string): void {
    this.last_name = last_name;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhoneNumber(phone_number: string): void {
    this.phone_number = phone_number;
  }

  setConnections(connections: Map<string,Connection>): void {
    this.connections = connections;
  }

  setNotes(notes: string): void {
    this.notes = notes;
  }

  addConnection(channel: string, connection: Connection): void {
    this.connections.set(channel, connection);
  }

  removeConnection(channel: string): void {
    this.connections.set(channel, null);
  }

  addConnection(type: string, channel: string, status: string, connected: boolean): void {
    this.connections.set(channel, Connection(type, status, connected));
  }
  
  // Method to get a string representation of the object
  toString(): string {
    return `User(Name: ${this.first_name} ${this.last_name}, Email: ${this.email}, phone number: ${this.phone_number}, Notes: ${this.notes}, connections: ${this.connections})`;
  }
}
