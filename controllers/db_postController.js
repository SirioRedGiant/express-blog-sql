//! collego al database
const connection = require("../data/db_blog");

//^^ Index - Recupera tutti i post (eventualmente filtrati per tag)
const index = (req, res) => {
  const sql = "SELECT * FROM posts";

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database query failed",
      });
    }
    res.json({
      success: true,
      message: "Prodotti & Descrizione",
      result: results,
    });
  });
};

//^ Show - Recupera un singolo post tramite ID
const show = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM posts WHERE id = ?`;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database query failed",
      });
    }
    if (results.length === 0)
      return res.status(404).json({
        success: false,
        mesage: "Post not found",
      });

    res.json({
      success: true,
      message: `Dettaglio del post ${id}; ${results[0].title}`,
      result: results[0],
      //? versione 1(corretta) --> message: `Dettaglio del post ${results[0].id}; ${results[0].title}`
      //! versione 2(sbagliata) --> message: `Dettaglio del post ${id}; ${results[0].title}`

      /** //note
       * QUALE VERSIONE ⬇️
        //? versione 1(corretta) --> message: `Dettaglio del post ${results[0].id}; ${results[0].title}`

        //! versione 2(sbagliata) --> message: `Dettaglio del post ${id}; ${results[0].title}`
       * Nella pratica, non cambia nulla ai fini del funzionamento dell'app. Tuttavia, la Versione 1 è considerata leggermente più solida in informatica ("Data Driven") perché i dati che mostri all'utente provengono direttamente dalla "fonte della verità" (il database) e non dai parametri dell'URL che potrebbero contenere caratteri strani o formati non corretti.
       * 
       //todo Perchè? --> connection.query restituisce sempre un array, anche se la query trova un solo elemento. Se inviassi results intero, l'utente riceverebbe un post dentro le parentesi quadre [{...}]. Usando l'indice 0, si invia l'oggetto pulito {...}.
       */
    });
  });
};

//^ Store - Crea un nuovo post
const store = (req, res) => {
  // Qui useremo: INSERT INTO posts (title, content, image) VALUES (?, ?, ?)
  res.send("Post creato (logica da implementare)");
};

//^ Update - Modifica interamente un post
const update = (req, res) => {
  const id = req.params.id;
  // Qui useremo: UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?
  res.send(`Post ${id} aggiornato (logica da implementare)`);
};

//^ Modify - Modifica parzialmente un post
const modify = (req, res) => {
  const id = req.params.id;
  res.send(`Post ${id} modificato parzialmente (logica da implementare)`);
};

//^ Destroy - Elimina un post
const destroy = (req, res) => {
  const id = req.params.id;
  const sql = "";

  connection.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: "Errore del database" });
    res.sendStatus(204);
  });
};

module.exports = { index, show, store, update, modify, destroy };
