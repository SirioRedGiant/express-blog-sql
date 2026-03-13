//note --- Questo è un middleware standard. Serve a rispondere quando un utente cerca un URL non registrato
const notFound = (req, res, next) => {
  console.log("[ERROR]: La rotta cercata non esiste --> 404");

  res.status(404).json({
    error: "Not Found",
    message: "La rotta cercata non esiste.",
  });
};

module.exports = notFound;
