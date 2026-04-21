const express = require("express");
const router = express.Router();
const db = require("../utils/db");

// Pretraga letova
router.get("/", async (req, res) => {
  const { departure, destination, date } = req.query;
  
  if (!departure || !destination || !date) {
    return res.status(400).json({ success: false, message: "Nedostaju parametri pretrage." });
  }

  try {
    const query = `
      SELECT
        Let.ID_let, Let.broj_leta, Let.vrijeme_polaska, Let.vrijeme_dolaska,
        Let.osnovna_cijena, AerodromPolazak.naziv AS polazni_aerodrom,
        AerodromOdrediste.naziv AS odredisni_aerodrom
      FROM Let
      JOIN Aerodrom AS AerodromPolazak ON Let.ID_aerodrom_polazak = AerodromPolazak.ID_aerodrom
      JOIN Aerodrom AS AerodromOdrediste ON Let.ID_aerodrom_odrediste = AerodromOdrediste.ID_aerodrom
      WHERE AerodromPolazak.IATA_kod = ? AND AerodromOdrediste.IATA_kod = ? AND DATE(Let.vrijeme_polaska) = ?
    `;

    const [flights] = await db.execute(query, [departure, destination, date]);
    res.json({ success: true, data: flights });
  } catch (error) {
    res.status(500).json({ success: false, message: "Greška u pretrazi letova.", error });
  }
});

module.exports = router;