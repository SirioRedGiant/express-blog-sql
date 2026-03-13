//note array dei post importati dalla cartella --> data
const posts = require("../data_a_mano/posts");

// Aggiunto path assoluto direttamente all'array originale. Perchè sarà sempre utile
posts.forEach(
  (post, i) => (posts[i].image = "http://localhost:3000" + posts[i].image),
);

//^ Index
const index = (req, res) => {
  console.log("dove sei finito?", res.locals);
  let filteredPosts = posts;

  if (req.query.tag !== undefined) {
    const tagCercato = req.query.tag.trim().toLowerCase();
    filteredPosts = posts.filter((post) => {
      const tagsMinSanitized = post.tags.map((tag) =>
        tag.trim().toLocaleLowerCase(),
      );
      return tagsMinSanitized.includes(tagCercato);
    });
  }
  res.json({
    list: filteredPosts,
    quote: res.locals.funnyQuote,
  });
};

/*
//^ Index
const index = (req, res) => {
  let filteredPosts = posts;

  if (req.query.tag !== undefined) {
    const tagCercato = req.query.tag.trim().toLowerCase();

    filteredPosts = posts.filter((post) => {
      const post_tags = post.tags.map((pt) => pt.toLowerCase());
      console.log(post_tags);
      if (post_tags.includes(tagCercato)) {
        return true;
      }
      return false;
    });
  }
  res.json({
    list: filteredPosts,
  });
};
*/

//^ Show
const show = (req, res) => {
  const id = parseInt(req.params.id); // l'ID  dei parametri arriva come stringa e lo trasformo in numero
  const responseData = {
    message: `Dettaglio del post ${id} non trovato`,
    success: false,
  };

  const post = posts.find((post) => post.id === id); // trovo il post con lo stesso ID

  if (post) {
    return res.json({
      post,
      quote: res.locals.funnyQuote,
    });
  }
  res.status(404).json(responseData);
};

//^ Store
const store = (req, res) => {
  console.log("verifica dei dati ricevuti da Postman:", req.body);

  const newId = posts[posts.length - 1].id + 1; // prendo l'ultimo e aggiungo 1

  //* il nuovo oggetto post unendo ID e dati in arrivo

  const newPost = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    tags: req.body.tags,
  };
  /*  id: newId,
    ...req.body, // prende title, content, image, tags dal body di Postman.... Stefano's version
  };
*/
  // aggiungo il post all'array originale
  posts.push(newPost);

  // Status 201 (Created) nuovo post creato
  res.status(201).json({
    newPost,
    quote: res.locals.funnyQuote,
  });
};

//^ Update
const update = (req, res) => {
  //note serve a --> identificazione del bersaglio. Su Postman PUT http://localhost:3000/posts/3, il numero 3 arriva al server come una stringa ("3"). quindi lo converto in numero con parseInt
  const id = parseInt(req.params.id);

  //note serve a --> creare un collegamento (riferimento) all'oggetto originale. VERIFICA L'ESISTENZA --> se l'ID non esiste restituisce undefined e attiva errore 404 ed evita che crashi il server modificando qualcosa che non esiste.
  /*
   * //! Riferimento di Memoria:
   * //?  In JavaScript, quando assegni un oggetto di un array a una costante (come const post), non stai creando una copia, ma un puntatore all'originale che sta dentro l'array posts.
   * //? --> È come se posts fosse un condominio e post fosse la chiave di un appartamento specifico. Se usi la chiave per dipingere le pareti (es. post.title = ...), stai cambiando le pareti dell'appartamento dentro il condominio, non di una casa giocattolo. MDN: Array.find
   */
  const post = posts.find((post) => post.id === id);

  // Se non c'è
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post non trovato",
    });
  }

  // update dei dati dell'oggetto trovato con quelli nuovi di req.body
  post.title = req.body.title;
  post.content = req.body.content;
  post.image = req.body.image;
  post.tags = req.body.tags;

  res.json({
    post,
    quote: res.locals.funnyQuote,
  });
  console.log(posts);
};

//^ Modify
const modify = (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);

  //todo --> ripensa a come poterlo scrivere diversamente
  // se il campo(body) è presente --> modifica altrimenti rimane uguale... avrei potuto farlo con || o con un ternario(RICORDA)
  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.image) post.image = req.body.image;
  if (req.body.tags) post.tags = req.body.tags;

  res.json({
    post,
    quote: res.locals.funnyQuote,
  });
  console.log(posts);
};

//^ Destroy
const destroy = (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === id);

  //note Se l'indice è diverso da -1, il post è stato trovato
  if (postIndex !== -1) {
    posts.splice(postIndex, 1); // Rimuove 1 elemento alla posizione postIndex
    console.log(`Post ${id} eliminato. Lista aggiornata:`);
    res.sendStatus(204); // successo (status 204 significa "No Content", operazione riuscita)
  } else {
    //note Se non lo trova, errore 404
    res.status(404).json({
      error: "Post non trovato",
      message: `Impossibile da eliminare, il post ${id} non esiste.`,
    });
  }
};

module.exports = { index, show, store, update, modify, destroy };
// esportazione delle funzione singolarmente( sono in un oggetto... quindi "chiave : valore" omesso perchè identico)
