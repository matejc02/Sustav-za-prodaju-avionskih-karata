const express = require("express");

const ticketController = require("../controller/ticket");

const router = express.Router();

router.get("/", ticketController.getTicketsByUserId);

router.post("/", (req, res, next) => {
  
});

module.exports = router;
