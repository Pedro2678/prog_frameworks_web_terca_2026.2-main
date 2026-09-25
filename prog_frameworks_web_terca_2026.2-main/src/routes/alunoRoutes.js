const express = require("express");
const alunoController = require("../controllers/AlunoController");
const validarAluno = require("../middlewares/validarAluno");



const router = express.Router();

router.get("/",(request, response, next)=>{
    console.log("Executando antes do findMany");
    next();
}, alunoController.findMany);
router.post("/", validarAluno, alunoController.create);
router.get("/:id", alunoController.findById);
router.put("/:id", alunoController.update);
router.delete("/:id", alunoController.delete);

module.exports = router;