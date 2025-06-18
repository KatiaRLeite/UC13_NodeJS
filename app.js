const express = require('express');
const app = express();
const { engine } = require('express-handlebars');

app.use(express.urlencoded({extended: true}));

const mysql = require('mysql2');

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));
app.use('/static', express.static(__dirname + '/static'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'senac',
  port: 3306,
  database: 'ecommerce_pc'
});

conexao.connect((erro) => {
  if (erro) {
    console.error('😫 Erro ao conectar ao banco de dados:', erro);
    return;
  }
  console.log('😁 Conexão com o banco de dados estabelecida com sucesso!');
});

app.get('/', (req, res) => {;
  let sql = 'SELECT * FROM produtos';
  conexao.query(sql, function (erro, produtos_qs) {
    if (erro) {
      console.error('😫 Erro ao consultar produtos:', erro);
      res.status(500).send('Erro ao consultar produtos');
      return;
    }
    res.render('index', { produtos: produtos_qs });
  });
}
);

app.get('/produtos/add', (req, res) => {
  let sql = 'SELECT id, nome FROM categorias';
  
  conexao.query(sql, function (erro, categorias_qs) {
    if (erro) {
      console.error('😫 Erro ao consultar categorias:', erro);
      res.status(500).send('Erro ao consultar categorias');
      return;
    }

    res.render('produto_form', { categorias: categorias_qs });
  });
});

app.get('/produto/:id', (req, res) => {
  const id = req.params.id;

  let sql = `SELECT produtos.*, categorias.nome as categoria_nome 
              FROM produtos 
              join categorias 
              on produtos.categoria_id = categorias.id 
              where produtos.id = ?`;
  
  conexao.query(sql,[id], function (erro, produto_qs) {
    if (erro) {
      console.error('😫 Erro ao consultar produtos:', erro);
      res.status(500).send('Erro ao consultar produtos');
      return;
    }

    res.render('produto', { produto: produto_qs[0] });
  });
});

app.get('/produtos/categorias/:id', (req, res) => {
  const id = req.params.id;
  
  let sql = `SELECT produtos.*, categorias.nome as categoria_nome 
              FROM produtos 
              join categorias 
              on produtos.categoria_id = categorias.id 
              where produtos.categoria_id = ?`;
  
  conexao.query(sql,[id], function (erro, produtos_qs) {
    if (erro) {
      console.error('😫 Erro ao consultar produtos:', erro);
      res.status(500).send('Erro ao consultar produtos');
      return;
    }

    res.render('index', { produtos: produtos_qs});
  });
});

app.post('/produtos/add', (req, res) => {
  const {nome, descricao, preco, estoque, categoria_id} = req.body;
  const sql=`
  INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id)
  VALUES (?,?,?,?,?)
  `;
  conexao.query(sql,[nome, descricao, preco, estoque, categoria_id], (erro,resultado) => {
    if(erro){
      console.error('Erro ao inserir produto:',erro);
      return res.status(500).send('Erro ao adicionar produto');
    }
    res.redirect('/');
  });
});

app.get('/clientes', (req, res) => {;
  let sql = 'SELECT * FROM clientes';
  conexao.query(sql, function (erro, clientes_qs) {
    if (erro) {
      console.error('😫 Erro ao consultar clientes:', erro);
      res.status(500).send('Erro ao consultar clientes');
      return;
    }
    res.render('clientes', { clientes: clientes_qs });
  });
});

app.get('/categorias', (req, res) => {;
  let sql = 'SELECT * FROM categorias';
  conexao.query(sql, function (erro, categorias_qs) {
    if (erro) {
      console.error('😫 Erro ao consultar categorias:', erro);
      res.status(500).send('Erro ao consultar categorias');
      return;
    }
    res.render('categorias', { categorias: categorias_qs });
  });
});

app.get('/categorias/upd/:id', (req, res) => {;
  const id = req.params.id;

  let sql = 'SELECT * FROM categorias';
  conexao.query(sql, function (erro, categorias_qs) {
    if (erro) {
      console.error('😫 Erro ao consultar categorias:', erro);
      res.status(500).send('Erro ao consultar categorias');
      return;
    }
    res.render('categorias', { categorias: categorias_qs });
  });
});

app.get('/categorias/add', (req, res) => {
  res.render('categoria_form');
});

app.post('/categorias/add', (req, res) => {
  const {nome, descricao} = req.body;
  const sql=`
  INSERT INTO categorias (nome, descricao)
  VALUES (?,?)
  `;
  conexao.query(sql,[nome, descricao], (erro,resultado) => {
    if(erro){
      console.error('Erro ao inserir categoria:',erro);
      return res.status(500).send('Erro ao adicionar categoria');
    }
    res.redirect('/');
  });
});

app.listen(8080);