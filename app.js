const express = require("express");
const app = express();
const port = 3000;

const funnyQuote = require("./middlewares/funnyQuote");
const notFound = require("./middlewares/notFound"); // 404
const errorsHandler = require("./middlewares/errorsHandler"); // 500

app.use(express.json()); // middleware "body-parser" per tradurre i dati grezzi che arrivano da Postman in formato json
app.use(funnyQuote);
app.use(express.static("public")); // middleware per poter accedere alla cartella public(accedere alle immagini)

//^ Import del router dei post
const postsRouter = require("./routers/posts");

app.get("/", (req, res) => {
  res.send("Server homepage");
});

//^ le rotte dei post con il prefisso /posts
app.use("/posts", postsRouter);

app.use(notFound);
//! errorsHandler deve essere sempre l'ULTIMO
app.use(errorsHandler);

/**
 * La Cascata: Se errorsHandler fosse sopra notFound, quando un utente cerca una rotta inesistente, Express passerebbe sopra l'errorHandler (perché non c'è un errore di
 * codice, solo una rotta mancante) e si ferma al notFound.
 * La Rete di Sicurezza: Se invece avviene un errore nel tuo codice (un 500), Express "salta" tutto quello che incontra (compreso il 404) per precipitare nell'unico middleware
 * che ha 4 parametri: l'errorsHandler. Express Error Handling
 */

/** //! --- ORDINE DEI MIDDLEWARE (Fondamentale) --- 

 * 1. Rotte --> Express cerca un match dall'alto verso il basso.

 * 2. 404 notFound: Se nessuna rotta che è sopra risponde, la richiesta "si ferma" qui. Gestisce le richieste che si sono perse.

 * 3. 500 errorHandler: Deve essere l'ULTIMO in assoluto. Express lo attiva solo se un middleware precedente "crasha" o chiama next(err). 
 *    Essendo l'unico con 4 parametri (err, req, res, next), funge da rete di sicurezza finale.

 */

app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});
