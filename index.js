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
    recado: "alguma coisa aqui 1",
    contadorRecados: 0,
  },
  {
    usuarioID: 1,
    titulo: "titulo 2",
    recado: "alguma coisa aqui 2",
    contadorRecados: 1,
  },
  {
    usuarioID: 1,
    titulo: "titulo 3",
    recado: "alguma coisa aqui 3",
    contadorRecados: 2,
  },
  {
    usuarioID: 1,
    titulo: "titulo 4",
    recado: "alguma coisa aqui 4",
    contadorRecados: 3,
  },
  {
    usuarioID: 1,
    titulo: "titulo 5",
    recado: "alguma coisa aqui 5",
    contadorRecados: 4,
  },
  {
    usuarioID: 1,
    titulo: "titulo 6",
    recado: "alguma coisa aqui 6",
    contadorRecados: 5,
  }
];
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // Ou defina o domínio do seu site, caso específico.
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

app.get("/", function (requisicao, resposta) {
  resposta.status(200);
  resposta.send("Bem vindo a API");
});


app.post("/login", function (requisicao, resposta) {
  const email = requisicao.body.email;
  const senha = requisicao.body.senha;

  let existeUsuario = false;
  let nomeUsuario = "";

  for (const usuario of usuarios) {
    if (usuario.email === email && usuario.senha === senha) {
      existeUsuario = true;
      nomeUsuario = usuario.nome;
      break; // Encontramos o usuário, então podemos sair do loop
    }
  }

  if (existeUsuario) {
    
      resposta.status(200);
      resposta.json({
        mensagem: "Login feito com sucesso",
        nome: nomeUsuario,
      });
  } else {
    resposta.status(400);
    resposta.send("Usuário inválido");
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
    resposta.json({
      mensagem: "Usuário criado com sucesso",
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      id: novoUsuario.identificador,
    });
    usuarios.push(novoUsuario);
  }

  console.log("possui mesmo", possuiMesmoEmail);
  // console.log(usuarios);
  contador++;

  setTimeout(() => {
    console.log("Timeout de 5 segundos concluído.");
    // Coloque qualquer ação que você deseja executar após o timeout aqui
  }, 5000); // 5000 milissegundos = 5 segundos

});

app.get("/usuarios", function (requisicao, resposta) {
  resposta.json(usuarios);
});

app.get("/recados", function (requisicao, resposta) {
  const pagina = parseInt(requisicao.query.pagina) || 1;
  const tamanhoPagina = 3;

  const startIndex = (pagina - 1) * tamanhoPagina;
  const endIndex = startIndex + tamanhoPagina;

  const recadosPaginados = recados.slice(startIndex, endIndex);

  resposta.json(recadosPaginados);
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
  if (!recadoEncontrado) {
    resposta.status(404);
    resposta.send("Recado não encontrado");
  } else {
    recadoEncontrado.titulo = titulo;
    recadoEncontrado.recado = recado;
    resposta.status(200);
    resposta.send("Recado atualizado com sucesso");
  }

});

app.delete("/recados/:id", function (requisicao, resposta) {
  let id = parseInt(requisicao.params.id);
  let recadoEncontrado = recados.findIndex(recado => recado.contadorRecados === id);
  if (!recadoEncontrado) {
    resposta.status(404);
    resposta.send("Recado não encontrado");
  } else {
    recados.splice(recadoEncontrado, 1);
    resposta.status(200);
    resposta.send("Recado deletado com sucesso");
  }


});

app.listen(3000, function () {
  console.log("Aplicação está rodando na porta 3000: http://localhost:3000");
  console.log("ip local: http://:3000");
});
