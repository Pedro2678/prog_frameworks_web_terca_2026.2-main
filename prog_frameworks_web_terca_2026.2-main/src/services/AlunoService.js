const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");
const alunoSchema = require("../schemas/alunoSchema");


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
async update(id, dados){
    const aluno = await prisma.aluno.findUnique({
        where: {
            id: Number(id)
        }
    });

    if(!aluno){
        throw new AlunoNaoEncontradoError();
    }

    if(!dados || Object.keys(dados).length === 0){
        throw new AlunoInvalidoError(
            "Informe pelo menos nome ou email para atualizar"
        );
    }

    const dadosValidos = {};

    if(dados.nome !== undefined){
        dadosValidos.nome = dados.nome;
    }

    if(dados.email !== undefined){
        dadosValidos.email = dados.email;
    }

    if(Object.keys(dadosValidos).length === 0){
        throw new AlunoInvalidoError(
            "Informe pelo menos nome ou email para atualizar"
        );
    }

    const validacao = alunoSchema.partial().safeParse(dadosValidos);

    if(!validacao.success){
        throw new AlunoInvalidoError(
            validacao.error.issues[0].message
        );
    }

    try{
        const alunoAtualizado = await prisma.aluno.update({
            where: {
                id: Number(id)
            },
            data: dadosValidos
        });

        return alunoAtualizado;

    }catch(e){
        if(e.code === "P2002"){
            throw new AlunoInvalidoError(
                "E-mail já está cadastrado"
            );
        }

        throw e;
    }
}
}

module.exports = new AlunoService();