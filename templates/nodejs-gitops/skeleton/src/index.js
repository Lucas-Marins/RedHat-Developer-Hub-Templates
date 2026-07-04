const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Hello World
app.get('/', (req, res) => {
  res.json({ message: 'Hello from ${{ values.appName }}!' });
});

// Mock de usuários
const users = [
  { id: 1, name: 'Lucas Marins', email: 'lucas@example.com', role: 'developer' },
  { id: 2, name: 'Ana Silva', email: 'ana@example.com', role: 'admin' }
];

// Listar usuários
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Buscar usuário por ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not Found', message: 'Usuário não encontrado' });
  res.json(user);
});

// Criar usuário
app.post('/api/users', (req, res) => {
  const { name, email, role = 'developer' } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Bad Request', message: 'Nome e email são obrigatórios' });
  }
  const newUser = { id: users.length + 1, name, email, role };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});