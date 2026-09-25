const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");

class AlunoService{

    async findMany(page, pageSize, orderBy, order){
    if(order !== "asc" && order !== "desc"){
        order = "asc";
    }

    const camposPermitidos = [
        "id",
        "nome",
        "email",
        "createdAt",
        "updatedAt"
    ];

    if(!camposPermitidos.includes(orderBy)){
        orderBy = "id";
    }

    const alunos = await prisma.aluno.findMany({
        skip: (page - 1) * pageSize,
        take: Number(pageSize),
        orderBy: {
            [orderBy]: order
        }
    });

    const total = await prisma.aluno.count();

    return {
        alunos,
        total
    };
}

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }
        //create = insert
        //update = update
        //delete = delete
        //findMany = select * from
        const novoAluno = await prisma.aluno.create({data:aluno});

        return novoAluno;
    }
    async findById(id){
    const aluno = await prisma.aluno.findUnique({
        where: {
            id: Number(id)
        }
    });

    if(!aluno){
        throw new AlunoNaoEncontradoError();
    }

    return aluno;
}
}

module.exports = new AlunoService();