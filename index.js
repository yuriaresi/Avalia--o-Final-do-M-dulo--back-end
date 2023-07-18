import express from "express";
/* lista de ususarios
   cada item é um objeto
   o objeto possui as seguintes propriedades
    - nome
    - identificador (unico para cada usuario)
    - email
    - senha
*/
const usuarios = [
  {
    nome: "Teste 1",
    identificador: 0,
    email: "teste1@teste.com",
    senha: "teste1",
  },
  {
    nome: "Teste 2",
    identificador: 1,
    email: "teste2@teste.com",
    senha: "teste2",
  },
];
let contador = 2;
const app = express();
let contadorRecados = 2;
const recados = [
  {
    usuarioID: 0,
    titulo: "titulo 1",
    recado: "alguma coisa aqui",
    contadorRecados: 0,
  },
  {
    usuarioID: 1,
    titulo: "titulo 2",
    recado: "alguma coisa aqui 2",
    contadorRecados: 1,
  }
];
app.use(express.json());

app.get("/", function (requisicao, resposta) {
  resposta.status(200);
  resposta.send("Bem vindo a API");
});


app.post("/login", function (requisicao, resposta) {
  const email = requisicao.body.email;
  const senha = requisicao.body.senha;
  //usando for of
  let existeUsuario = false;
  for (const usuario of usuarios) {
    if (usuario.email === email && usuario.senha === senha) {
      existeUsuario = true;
    }
  }

  // usando o some
  // const existeUsuario = usuarios.some(function (usuario) {
  //   if(usuario.email === email && usuario.senha === senha) {
  //     return true;
  //   }
  // });

  // usando o find
  // const usuario = usuarios.find(function (usuario) {
  //   if (usuario.email === email && usuario.senha === senha) {
  //     return true;
  //   }
  // });

  if (existeUsuario) {
    resposta.status(200);
    resposta.json("Login feito com sucesso");
  } else {
    resposta.status(400);
    resposta.send("usuário inválido");
  }

  // usando o filter
  // const usuariosEncontrados = usuarios.filter(function (usuario) {
  //   if (usuario.email === email && usuario.senha === senha) {
  //     return true;
  //   }
  // });

  // if (usuariosEncontrados.length > 0) {
  //   resposta.status(200);
  //   resposta.send("usuario existe");
  // } else {
  //   resposta.status(400);
  //   resposta.send("usuário inválido");
  // }
});

app.post("/criar-usuario", function (requisicao, resposta) {
  if (
    requisicao.body.nome === undefined ||
    requisicao.body.email === undefined ||
    requisicao.body.senha === undefined
  ) {
    resposta.status(400);
    resposta.send("Você deve enviar nome, email e senha");
    return;
  }
  const novoUsuario = {
    nome: requisicao.body.nome,
    email: requisicao.body.email,
    senha: requisicao.body.senha,
    identificador: contador,
  };

  let possuiMesmoEmail = false;
  for (const usuario of usuarios) {
    if (usuario.email === novoUsuario.email) {
      possuiMesmoEmail = true;
    }
  }

  if (possuiMesmoEmail) {
    resposta.status(400);
    resposta.send("Já existe um usário cadastrado com esse email");
  } else {
    resposta.send("Usuário cadastrado com sucesso");
    usuarios.push(novoUsuario);
  }

  console.log("possui mesmo", possuiMesmoEmail);
  console.log(usuarios);
  contador++;
});

app.get("/usuarios", function (requisicao, resposta) {
  resposta.json(usuarios);
});

app.get("/recados", function (requisicao, resposta) {
  resposta.json(recados);
});

app.post("/criar-recados", function (requisicao, resposta) {

  let usuarioExiste = false;
  let usuarioID = requisicao.body.usuarioID;
  for (const usuario of usuarios) {
    if (usuario.identificador === usuarioID) {
      usuarioExiste = true;
    }

  }

  if (!usuarioExiste) {
    resposta.status(400);
    resposta.send("Usuário não existe");
  }
  else {

    const novoRecado = {
      usuarioID: parseInt(requisicao.body.usuarioID),
      titulo: requisicao.body.titulo,
      recado: requisicao.body.recado,
      contadorRecados: contadorRecados
    };

    if (novoRecado.titulo === undefined || novoRecado.recado === undefined) {
      resposta.status(400);
      resposta.send("Vocé deve inserir um titulo e um recado");
    } else {
      resposta.status(200);
      resposta.send("Recado criado com sucesso");
      recados.push(novoRecado);
      contadorRecados++;
    }

  }
});

app.get("/recados/:id", function (requisicao, resposta) {
  let id = parseInt(requisicao.params.id);
  let recadoEncontrado = recados.find(recado => recado.contadorRecados === id);
  if (!recadoEncontrado) {
    resposta.status(400);
    resposta.send("Recado não encontrado");
  } else {
    resposta.status(200);
    resposta.send(recadoEncontrado);

  }
});

app.put("/recados/:id", function (requisicao, resposta) {
  let titulo = requisicao.body.titulo;
  let recado = requisicao.body.recado;
  let id = parseInt(requisicao.params.id);
  let recadoEncontrado = recados.find(recado => recado.contadorRecados === id);
  if (!recadoEncontrado){
    resposta.status(404);
    resposta.send("Recado não encontrado");
  }else{
    recadoEncontrado.titulo = titulo;
    recadoEncontrado.recado = recado;
    resposta.status(200);
    resposta.send("Recado atualizado com sucesso");
  }

});

app.delete("/recados/:id", function (requisicao, resposta) {
  let id = parseInt(requisicao.params.id);
  let recadoEncontrado = recados.findIndex(recado => recado.contadorRecados === id);
  if (!recadoEncontrado){
    resposta.status(404);
    resposta.send("Recado não encontrado");
  }else{
    recados.splice(recadoEncontrado, 1);
    resposta.status(200);
    resposta.send("Recado deletado com sucesso");
  }


});

app.listen(3000, function () {
  console.log("Aplicação está rodando na porta 3000: http://localhost:3000");
  console.log("ip local: http://:3000");
});
