const { Pool } = require("pg");

class ColaborationsService {
  constructor() {
    this._poll = new Pool();
  }
}
