const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware de Request Logging — registra todas as requisições no stdout
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Hook no finish da resposta para capturar status e tempo
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLine = `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    console.log(logLine);
  });

  next();
});

// Health Check
app.get('/health', (req, res) => {
  console.log(`[HEALTH CHECK] Requisição recebida de ${req.ip || req.socket.remoteAddress}`);
  res.status(200).json({ status: 'UP' });
});

// Hello World
app.get('/', (req, res) => {
  console.log(`[ROOT] Hello endpoint acessado por ${req.ip || req.socket.remoteAddress}`);
  res.json({ message: 'Hello from ${{ values.appName }}!' });
});

// Mock de usuários
const users = [
  { id: 1, name: 'Lucas Marins', email: 'lucas@example.com', role: 'developer' },
  { id: 2, name: 'Ana Silva', email: 'ana@example.com', role: 'admin' }
];

// Listar usuários
app.get('/api/users', (req, res) => {
  console.log(`[USERS] Listando todos os usuários. Total atual: ${users.length}`);
  res.json(users);
});

// Buscar usuário por ID
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  console.log(`[USERS] Buscando usuário ID: ${userId}`);
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    console.error(`[USERS] Usuário não encontrado: ID ${userId}`);
    return res.status(404).json({ error: 'Not Found', message: 'Usuário não encontrado' });
  }
  
  console.log(`[USERS] Usuário encontrado: ${user.name} (ID: ${user.id})`);
  res.json(user);
});

// Criar usuário
app.post('/api/users', (req, res) => {
  console.log(`[USERS] Requisição de criação recebida: ${JSON.stringify(req.body)}`);
  
  const { name, email, role = 'developer' } = req.body;
  if (!name || !email) {
    console.error(`[USERS] Falha na criação: campos obrigatórios ausentes (name=${name}, email=${email})`);
    return res.status(400).json({ error: 'Bad Request', message: 'Nome e email são obrigatórios' });
  }
  
  const newUser = { id: users.length + 1, name, email, role };
  users.push(newUser);
  
  console.log(`[USERS] Novo usuário criado: ${newUser.name} (ID: ${newUser.id}, Role: ${newUser.role})`);
  res.status(201).json(newUser);
});

// Middleware de erro global — captura exceções não tratadas
app.use((err, req, res, next) => {
  console.error(`[ERROR] Exceção não tratada em ${req.method} ${req.originalUrl}:`, err.stack || err.message);
  res.status(500).json({ error: 'Internal Server Error', message: 'Erro interno do servidor' });
});

app.listen(port, () => {
  console.log(`[SERVER] App iniciado e ouvindo na porta ${port}`);
  console.log(`[SERVER] Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[SERVER] Data de inicialização: ${new Date().toISOString()}`);
});