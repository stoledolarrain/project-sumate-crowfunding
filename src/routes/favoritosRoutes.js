const express = require("express");
const router = express.Router();
const favoritosController = require("../controllers/favoritosController");

router.post("/toggle", favoritosController.toggleFavorito);

router.get(
  "/check/:usuario_id/:proyecto_id",
  favoritosController.verificarFavorito
);

router.get("/mis-favoritos/:usuario_id", favoritosController.misFavoritos);

module.exports = router;
