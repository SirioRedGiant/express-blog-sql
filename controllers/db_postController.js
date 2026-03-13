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
  const sql = `SELECT * FROM posts WHERE id = ${id}`;

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
