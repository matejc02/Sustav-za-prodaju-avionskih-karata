const express = require("express");
const cors = require("cors");
const path = require ("path");
require("dotenv").config();

const ticketRouter = require("./routes/ticket");
const flightsRouter = require("./routes/flights");
const reservationsRouter = require("./routes/reservations")
// process.env('VARIJABLA')

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/", (req, res, next) => {
  req.userId = 1;
  next();
});


app.get("/",(req,res)=> {
res.send("Server radi!");

}

)

app.use("/tickets", ticketRouter);
app.use("/flights", flightsRouter);
app.use("/reservations", reservationsRouter);
app.use(express.static(path.join(__dirname, "../bp2-frontend")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../bp2-frontend", "index.html"));
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server je pokrenut na ${port}`);
});

