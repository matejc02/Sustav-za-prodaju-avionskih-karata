const express = require("express");
const router = express.Router();
const db = require("../utils/db");

// Kreiranje nove rezervacije
router.post("/", async (req, res) => {
  const { userId, flightId, classId } = req.body;

  try {
    const query = `
      INSERT INTO Rezervacija (ID_korisnik, ID_let, ID_klasa, datum_rezervacije, status)
      VALUES (?, ?, ?, NOW(), 'Na čekanju')
    `;
    const [result] = await db.execute(query, [userId, flightId, classId]);
    res.json({ success: true, message: "Rezervacija uspješno kreirana.", reservationId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Greška pri kreiranju rezervacije.", error });
  }
});

// Dohvat svih rezervacija korisnika
router.get("/", async (req, res) => {
  const userId = req.userId; // Pretpostavka: dodali smo userId middleware.

  try {
    const query = `
      SELECT
        Rezervacija.ID_rezervacija, Let.broj_leta, Let.vrijeme_polaska, Let.vrijeme_dolaska,
        Klasa.naziv AS klasa, Rezervacija.status, Rezervacija.ukupna_cijena
      FROM Rezervacija
      JOIN Let ON Rezervacija.ID_let = Let.ID_let
      JOIN Klasa ON Rezervacija.ID_klasa = Klasa.ID_klasa
      WHERE Rezervacija.ID_korisnik = ?
    `;
    const [reservations] = await db.execute(query, [userId]);
    res.json({ success: true, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Greška pri dohvaćanju rezervacija.", error });
  }
});

module.exports = router;