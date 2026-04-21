-- Kreiranje baze podataka
CREATE DATABASE AvionskeKarte;
USE AvionskeKarte;

-- Tablica: Korisnik
CREATE TABLE Korisnik (
    ID_korisnik INT AUTO_INCREMENT PRIMARY KEY,
    ime VARCHAR(50),
    prezime VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    lozinka VARCHAR(50),
    telefon VARCHAR(20)
);

-- Tablica: Destinacija
CREATE TABLE Destinacija (
    ID_destinacija INT AUTO_INCREMENT PRIMARY KEY,
    naziv VARCHAR(50),
    drzava VARCHAR(50),
    opis TEXT
);

-- Tablica: Aerodrom
CREATE TABLE Aerodrom (
    ID_aerodrom INT AUTO_INCREMENT PRIMARY KEY,
    naziv VARCHAR(50),
    lokacija VARCHAR(50),
    drzava VARCHAR(50),
    IATA_kod CHAR(3),
    ID_destinacija INT,
    FOREIGN KEY (ID_destinacija) REFERENCES Destinacija(ID_destinacija)
);

-- Tablica: Avion
CREATE TABLE Avion (
    ID_avion INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50),
    kapacitet INT,
    status VARCHAR(50)
);

-- Tablica: Let
CREATE TABLE Let (
    ID_let INT AUTO_INCREMENT PRIMARY KEY,
    broj_leta VARCHAR(20),
    vrijeme_polaska DATETIME,
    vrijeme_dolaska DATETIME,
    ID_aerodrom_polazak INT,
    ID_aerodrom_odrediste INT,
    osnovna_cijena DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'Aktivno',
    ID_avion INT,
    FOREIGN KEY (ID_aerodrom_polazak) REFERENCES Aerodrom(ID_aerodrom),
    FOREIGN KEY (ID_aerodrom_odrediste) REFERENCES Aerodrom(ID_aerodrom),
    FOREIGN KEY (ID_avion) REFERENCES Avion(ID_avion)
);

-- Tablica: Klasa
CREATE TABLE Klasa (
    ID_klasa INT AUTO_INCREMENT PRIMARY KEY,
    naziv VARCHAR(50),
    opis TEXT,
    dodatak_cijeni DECIMAL(10, 2)
);

-- Tablica: LetKlasa
CREATE TABLE LetKlasa (
    ID_let_klasa INT AUTO_INCREMENT PRIMARY KEY,
    ID_let INT,
    ID_klasa INT,
    dodatna_cijena DECIMAL(10, 2),
    FOREIGN KEY (ID_let) REFERENCES Let(ID_let),
    FOREIGN KEY (ID_klasa) REFERENCES Klasa(ID_klasa)
);

-- Tablica: Rezervacija
CREATE TABLE Rezervacija (
    ID_rezervacija INT AUTO_INCREMENT PRIMARY KEY,
    ID_korisnik INT,
    ID_let INT,
    ID_klasa INT,
    datum_rezervacije DATETIME,
    status VARCHAR(50) DEFAULT 'Na čekanju',
    ukupna_cijena DECIMAL(10, 2) DEFAULT NULL,
    FOREIGN KEY (ID_korisnik) REFERENCES Korisnik(ID_korisnik),
    FOREIGN KEY (ID_let) REFERENCES Let(ID_let),
    FOREIGN KEY (ID_klasa) REFERENCES Klasa(ID_klasa)
);

-- Unos podataka

-- Unos u tablicu Korisnik
INSERT INTO Korisnik (ime, prezime, email, lozinka, telefon) VALUES
('Marko', 'Marković', 'marko@gmail.com', 'lozinka1', '+385912345678'),
('Ivana', 'Horvat', 'ivana@gmail.com', 'lozinka2', '+385987654321'),
('Petra', 'Novak', 'petra@gmail.com', 'lozinka3', '+385912345679');

-- Unos u tablicu Destinacija
INSERT INTO Destinacija (naziv, drzava, opis) VALUES
('Zagreb', 'Hrvatska', 'Glavni grad Hrvatske.'),
('Pariz', 'Francuska', 'Grad ljubavi.'),
('London', 'UK', 'Povijesni grad.'),
('New York', 'SAD', 'Grad koji nikad ne spava.');

-- Unos u tablicu Aerodrom
INSERT INTO Aerodrom (naziv, lokacija, drzava, IATA_kod, ID_destinacija) VALUES
('Franjo Tuđman', 'Zagreb', 'Hrvatska', 'ZAG', 1),
('Charles De Gaulle', 'Pariz', 'Francuska', 'CDG', 2),
('Heathrow', 'London', 'UK', 'LHR', 3),
('JFK', 'New York', 'SAD', 'JFK', 4);

-- Unos u tablicu Avion
INSERT INTO Avion (model, kapacitet, status) VALUES
('Airbus A320', 180, 'U funkciji'),
('Boeing 737', 160, 'Na održavanju'),
('Boeing 787', 250, 'U funkciji');

-- Unos u tablicu Let
INSERT INTO Let (broj_leta, vrijeme_polaska, vrijeme_dolaska, ID_aerodrom_polazak, ID_aerodrom_odrediste, osnovna_cijena, ID_avion) VALUES
('12345', '2024-12-25 10:00:00', '2024-12-25 13:00:00', 1, 2, 150.00, 1),
('67890', '2024-12-26 08:00:00', '2024-12-26 11:30:00', 1, 3, 200.00, 2),
('54321', '2024-12-27 14:00:00', '2024-12-27 22:00:00', 3, 4, 800.00, 3);

-- Unos u tablicu Klasa
INSERT INTO Klasa (naziv, opis, dodatak_cijeni) VALUES
('Ekonomska', 'Osnovna klasa putovanja.', 0.00),
('Poslovna', 'Više pogodnosti i komfor.', 50.00),
('Prva', 'Najluksuznija klasa.', 200.00);

-- Unos u tablicu LetKlasa
INSERT INTO LetKlasa (ID_let, ID_klasa, dodatna_cijena) VALUES
(1, 1, 0.00),
(1, 2, 50.00),
(1, 3, 200.00),
(2, 1, 0.00),
(2, 2, 70.00),
(2, 3, 250.00);

-- Unos u tablicu Rezervacija
INSERT INTO Rezervacija (ID_korisnik, ID_let, ID_klasa, datum_rezervacije, status)
VALUES (1, 1, 2, '2024-12-20 10:30:00', 'Na čekanju'),
       (2, 2, 1, '2024-12-21 09:00:00', 'Na čekanju'),
       (3, 3, 3, '2024-12-22 12:15:00', 'Na čekanju');

-- TRIGGER 1: Automatski izračun ukupne cijene rezervacije
-- Ostatak ERA modela ovdje...

-- Trigger za izračun ukupne cijene rezervacije
DELIMITER $$

CREATE TRIGGER trg_calculate_total_price
AFTER INSERT ON Rezervacija
FOR EACH ROW
BEGIN
  DECLARE osnovna_cijena DECIMAL(10, 2);
  DECLARE dodatna_cijena DECIMAL(10, 2);

  SELECT osnovna_cijena INTO osnovna_cijena
  FROM Let
  WHERE ID_let = NEW.ID_let;

  SELECT dodatna_cijena INTO dodatna_cijena
  FROM LetKlasa
  WHERE ID_let = NEW.ID_let AND ID_klasa = NEW.ID_klasa;

  UPDATE Rezervacija
  SET ukupna_cijena = osnovna_cijena + dodatna_cijena
  WHERE ID_rezervacija = NEW.ID_rezervacija;
END$$

DELIMITER ;

-- Trigger za ažuriranje statusa rezervacija
DELIMITER $$

CREATE TRIGGER trg_cancel_reservations
AFTER UPDATE ON Let
FOR EACH ROW
BEGIN
  IF NEW.status = 'Otkazano' THEN
    UPDATE Rezervacija
    SET status = 'Otkazano'
    WHERE ID_let = NEW.ID_let;
  END IF;
END$$

DELIMITER ;
