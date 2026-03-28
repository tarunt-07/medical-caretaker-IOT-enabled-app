export class Device {
  constructor(id, name, type, status, lastSync) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.status = status;
    this.lastSync = lastSync;
  }
}