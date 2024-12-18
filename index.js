const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware pour parser le body des requêtes en JSON
app.use(bodyParser.json());

// Configuration de la connexion à MySQL
const db = mysql.createConnection({
  host: 'renardserveur.freeboxos.fr', // Remplacez par l'IP de votre serveur MySQL
  user: 'iarenard',         // Nom d'utilisateur de la base de données
  password: 'c*KM8Q%4W1aRMW',     // Mot de passe de la base de données
  database: 'DBCoursAlexis'            // Nom de la base de données
});

// Connexion à MySQL
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});


//---- NATION ----//


// Endpoint pour récupérer toutes les nations
app.get('/nation', (req, res) => {
  const sql = 'SELECT * FROM nation';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Endpoint pour ajouter une nouvelle nation
app.post('/nation', (req, res) => {
  const { nom, continent } = req.body;
  const sql = 'INSERT INTO nation (nom, continent) VALUES (?, ?)';
  db.query(sql, [nom, continent], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id: result.insertId, nom, continent });
  });
});

app.get('/nation/:nom', (req, res) => {
    // Capture le paramètre 'nom' de l'URL
    const nom = '%'+req.params.nom+'%';
    // Crée la requête SQL avec un paramètre pour le nom
    const sql = 'SELECT * FROM nation WHERE nom LIKE ?';
    db.query(sql, [nom], (err, results) => {
    if (err) {
    return res.status(500).send(err);
    }
    if (results.length === 0) {
    // Si aucune nation n'est trouvée, renvoyer une erreur 404
    return res.status(404).json({ message: 'Nation not found' });
    }
    // Si des résultats sont trouvés, renvoyer les données
    res.json(results);
    });
});


//---- SPORT ----//


// Endpoint pour récupérer toutes les sports
app.get('/sport', (req, res) => {
    const sql = 'SELECT * FROM sport';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
  
  // Endpoint pour ajouter un nouveau sport
  app.post('/sport', (req, res) => {
    const { nom, continent } = req.body;
    const sql = 'INSERT INTO sport (nom) VALUES (?)';
    db.query(sql, [nom], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ id: result.insertId, nom });
    });
  });


//---- ATHLETE ----//


// Endpoint pour récupérer toutes les athletes
app.get('/athlete', (req, res) => {
    const sql = 'SELECT * FROM athlete';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});
  
  // Endpoint pour ajouter un nouveau athletes
  app.post('/athlete', (req, res) => {
    const { nom, continent } = req.body;
    const sql = 'INSERT INTO athlete (nom, prenom, idNation, idSport) VALUES (?)';
    db.query(sql, [nom, prenom, idNation, idSport], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ id: result.insertId, nom, prenom, idNation, idSport });
    });
  });

app.get('/athlete/:prenom', (req, res) => {
    // Capture le paramètre 'nom' de l'URL
    const prenom = '%'+req.params.prenom+'%';
    // Crée la requête SQL avec un paramètre pour le nom
    const sql = 'SELECT a.nom, a.prenom, s.nom as sport, n.nom as nation FROM athlete a JOIN sport s ON a.idSport = s.id JOIN nation n ON a.idNation = n.id WHERE a.prenom LIKE ? OR a.nom LIKE ?';
    db.query(sql, [prenom, prenom], (err, results) => {
    if (err) {
    return res.status(500).send(err);
    }
    if (results.length === 0) {
    // Si aucune nation n'est trouvée, renvoyer une erreur 404
    return res.status(404).json({ message: 'Athlete not found' });
    }
    // Si des résultats sont trouvés, renvoyer les données
    res.json(results);
    });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur API en écoute sur http://localhost:${port}`);
});