const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const upload = require("../utils/multerConfig");

router.post("/", upload.array("imagenes", 4), projectController.crearProyecto);
router.get("/", projectController.listarProyectos);
router.get("/:id", projectController.obtenerProyecto);
router.get("/admin/todos", projectController.listarTodosLosProyectos);
router.put("/admin/estado/:id", projectController.cambiarEstado);
router.get("/usuario/:usuario_id", projectController.misProyectos);
router.delete("/:id", projectController.eliminarProyecto);
router.put("/campana/:id", projectController.cambiarEstadoCampana);
router.put("/:id", projectController.editarProyecto);
module.exports = router;
