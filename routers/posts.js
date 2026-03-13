const express = require("express");
const router = express.Router(); // crea un server per i post

//! importazione delle funzione del controller
const postController = require("../controllers/db_postController");

//^ ROTTE --> Funzioni del controller
router.get("/", postController.index);

router.get("/:id", postController.show);

router.post("/", postController.store);

router.put("/:id", postController.update);

router.patch("/:id", postController.modify);

router.delete("/:id", postController.destroy);

//^ Esportazione del router
module.exports = router;
