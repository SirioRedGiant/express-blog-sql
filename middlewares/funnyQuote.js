const quotes = require("../data/quotes");

const funnyQuote = (req, res, next) => {
  const indexRandom = Math.floor(Math.random() * quotes.length);

  //note  [res.locals] è un oggetto che vive solo per la durata di questa richiesta. È il posto standard dove mettere dati che servono alla risposta finale.
  res.locals.funnyQuote = quotes[indexRandom];
  next();
};

module.exports = funnyQuote;

/** //!  TEORIA
 * 
//!      Perché usare res.locals invece di req?

// *     Pulizia: req dovrebbe contenere solo dati che arrivano dal cliente (parametri, body, header). res contiene i dati che il server sta preparando per il cliente.

// *     Integrazione con i Template: Se un domani usassi un motore di template (come EJS), tutto quello che metti in res.locals diventa automaticamente disponibile nella pagina
// *     HTML senza doverlo passare a mano. Express Template Engines

// *     Best Practice: È lo standard raccomandato per passare dati tra middleware che devono finire nella risposta finale.


//note   RIASSUNTO:
//**     req: Cosa mi chiede l'utente.
//**     res: Cosa rispondo io.
//**     res.locals: Il mio "blocco appunti" interno per preparare la risposta.

 */
