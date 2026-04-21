const Ticket = require("../models/ticket");

exports.getTicketsByUserId = (req, res, next) => {
  Ticket.fetchAllByUserId(req.userId)
    .then(([tickets]) => {
      res.status(200).json({ tickets });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    });
};
