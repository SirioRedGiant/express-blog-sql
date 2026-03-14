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
  const sql = `
SELECT 
posts.*,
tags.label AS category
FROM posts
INNER JOIN post_tag
ON posts.id = post_tag.post_id

INNER JOIN tags
ON tags.id = post_tag.tag_id 
WHERE posts.id = ?

  `;

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

    // array che contiene le stringhe delle categorie e ritorna la colonna category da ogni riga del database
    const categoriesArray = results.map((row) => {
      return row.category;
    });

    // quello che voglio mostrare --> l'oggetto
    const addedCategoryOnPost = {
      id: results[0].id,
      title: results[0].title,
      content: results[0].content,
      image: results[0].image,
      categories: categoriesArray,
    };

    res.json({
      success: true,
      message: `Dettaglio del post ${id}; ${results[0].title}`,
      result: addedCategoryOnPost,

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

/**
//? INSERT INTO posts (title, content,image)
//? VALUES ( `Muffin ai mirtilli`, `Ricetta gustosa e soffice per la colazione da mangiare con o senza latte o in compagnia di una spremuta o di uno yogurt gustoso`, `muffin.jpeg`) 
--------------------------------------------------------------------------------------------------------------------------
//? INSERT INTO post_tag (post_id, tag_id) 
//? VALUES (6, 1), (6, 4);

 */

//^ Store - Crea un nuovo post
const store = (req, res) => {
  // i dati inviati da Postman
  const { title, content, image, tags } = req.body;

  // Prima query INSERT INTO --> il post nella tabella 'posts'
  const sql = "INSERT INTO posts (title, content, image) VALUES (?, ?, ?)";

  connection.query(sql, [title, content, image], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database insertion failed",
      });
    }

    // l'ID appena creato --> fondamentale per i tag
    const newPostId = results.insertId; //note --> Con una INSERT, MySQL non ridà i dati del post, ma dà questo numero che rappresenta l'ID autoincrementale appena generato. Verrà usato per dire alla tabella post_tag: "Collega questi tag a questo nuovo post".

    // se l'utente ha inviato dei tag (un array di ID), allora vanno collegati nella tabella ponte
    if (tags && Array.isArray(tags) && tags.length > 0) {
      // i dati per un INSERT multiplo: (post_id, tag_id), (post_id, tag_id)
      const tagValue = tags.map((tagId) => [newPostId, tagId]);
      const sqlTags = "INSERT INTO post_tag (post_id, tag_id) VALUES ?";

      connection.query(sqlTags, [tagValue], (errTags) => {
        if (errTags) {
          return res.status(500).json({
            success: false,
            message: "Failed to associate tags to the post",
          });
        }

        // MasterPlan A --> Post creato con successo e tag collegati
        res.status(201).json({
          success: true,
          message: `Post with ID ${newPostId} succesfully created with its relative tags`,
          result: { id: newPostId, title, content, image, tags },
        });
      });
    } else {
      // MasterPlan B --> Post creato con successo ma senza tag
      res.status(201).json({
        success: true,
        message: `Post with ID ${newPostId} succesfully created but without associated tags)`,
        result: { id: newPostId, title, content, image, tags: [] },
      });
    }
  });
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
  const sql = "DELETE FROM posts WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete post",
      });
    }
    if (results.affectedRows === 0) {
      return res.sendStatus(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //note problema del res.sendStatus(204) --> Il codice 204 No Content significa "successo, ma non c'è nulla da inviare nel corpo della risposta". Se si usa res.sendStatus(204), Express chiude immediatamente la connessione. Non si può aggiungere un .json() dopo un 204, perché il protocollo HTTP non lo permette. Se si vuole inviare un messaggio di conferma, si può usare lo stato 200.

    res.sendStatus(200).json({
      success: true,
      message: `Delete operation by id --> ${id} succesful`, //fixed results[0].id è undefined. Quando si esegue una query di tipo DELETE, l'oggetto results restituito da MySQL non contiene le righe eliminate. Quindi darà errore
    });
  });
};

module.exports = { index, show, store, update, modify, destroy };
