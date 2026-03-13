//note ---- questo è un middleware speciale: Express lo riconosce perché ha 4 parametri anziché 3(err in più). Viene attivato ogni volta che nel codice avviene un errore imprevisto (come  una variabile non definita).

const errorsHandler = (err, req, res, next) => {
  console.log("[ERROR]: " + err.message);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
};

module.exports = errorsHandler;
