const db = require("../utils/db");

module.exports = class Ticket {
  constructor(idKorisnika, brLet, status) {
    this.idKorisnika = idKorisnika;
    this.brLet = brLet;
    this.status = status;
  }

  save() {
    return db.execute(
      "INSERT INTO Rezervacija (idKorisnika, brLet, status) VALUES (?, ?, ?)",
      [this.idKorisnika, this.brLet, this.status]
    );
  }

  static fetchAllByUserId(userId) {
    return db.execute("SELECT * FROM Rezervacija WHERE ID_korisnika = ?", [
      userId,
    ]);
  }

  static findById(idKarte) {
    return db.execute("SELECT * FROM Rezervacija WHERE ID_rezervacija = ?", [idKarte]);
  }
};
