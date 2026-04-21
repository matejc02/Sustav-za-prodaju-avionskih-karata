onst Flight = require("../models/flight");

exports.getAllFlights = (req, res, next) => {
  Flight.fetchAll()
    .then(([flights]) => {
      res.status(200).json({ success: true, flights });
    })
    .catch((err) => {console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
      });
  };

  exports.getFlightById = (req, res, next) => {
    const flightId = req.params.id;
    Flight.findById(flightId)
      .then(([flight]) => {
        if (flight.length === 0) {
          return res.status(404).json({ success: false, message: "Flight not found" });
        }
        res.status(200).json({ success: true, flight: flight[0] });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
      });
  };