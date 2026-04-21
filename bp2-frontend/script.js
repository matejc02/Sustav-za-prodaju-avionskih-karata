
const API_BASE_URL = "http://localhost:3000";

// Pretraga letova
document.getElementById("search-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const departure = document.getElementById("departure").value;
  const destination = document.getElementById("destination").value;
  const date = document.getElementById("date").value;
  try {
    const response = await fetch(
      `http://localhost:3000/flights?departure=${departure}&destination=${destination}&date=${date}`
    );
    const data = await response.json();
    console.log("Odgovor od backend-a:", data);

    if (data.success) {
      displayResults(data.data);
    } else {
      alert("Nema dostupnih letova za unesene parametre.");
    }
  } catch (error) {
    console.error("Greška prilikom pretrage letova:", error);
  }
});

function displayResults(flights) {
  const resultsTable = document.querySelector("#results-table tbody");
  const resultsSection = document.getElementById("results-section");

  // Očisti prethodne rezultate
  resultsTable.innerHTML = "";
  resultsSection.style.display = "block";
  flights.forEach((flight, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${flight.broj_leta}</td>
      <td>${flight.polazni_aerodrom}</td>
      <td>${flight.odredisni_aerodrom}</td>
      <td>${new Date(flight.vrijeme_polaska).toLocaleString()}</td>
      <td>${new Date(flight.vrijeme_dolaska).toLocaleString()}</td>
      <td>${flight.vrijeme_polaska}</td>
      <td>${flight.vrijeme_dolaska}</td>
      <td>${flight.osnovna_cijena.toFixed(2)} €</td>
      <td><button class="reserve-btn" data-flight-id="${flight.ID_let}">Rezerviraj</button></td>
    `;
    resultsTable.appendChild(row);
  });// Dodaje event listenere za sve gumbe "Rezerviraj"
  document.querySelectorAll(".reserve-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const flightId = e.target.dataset.flightId;
      prepareReservation(flightId);
    });
  });
}