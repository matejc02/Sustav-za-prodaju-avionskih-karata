const Reservation = require("../models/reservations");

exports.createReservation = (req, res, next) => {
  const { userId, flightId, classId } = req.body;

  if (!userId || !flightId || !classId) {
    return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  const reservation = new Reservation(userId, flightId, classId);
  reservation.save()
    .then(([result]) => {
      res.status(201).json({ success: true, message: "Reservation created successfully", reservationId: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    });
};
exports.getReservationsByUserId = (req, res, next) => {
    const userId = req.params.userId;
  
    Reservation.fetchAllByUserId(userId)
      .then(([reservations]) => {
        res.status(200).json({ success: true, reservations });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
      });
  };