const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = 'TP DevOps - To-Do App by <YOUR NAME>';

app.use(express.json());
app.use(express.static('public')); // serves public/index.html on "/"

let todos = [];
let nextId = 1;

// Health check (used later by Docker/Kubernetes probes)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: APP_NAME,
    hostname: os.hostname(),
    uptime: Math.round(process.uptime())
  });
});

// Info for the frontend
app.get('/api/info', (req, res) => {
  res.json({ app: APP_NAME, hostname: os.hostname(), port: PORT });
});

app.get('/api/todos', (req, res) => res.json(todos));

app.post('/api/todos', (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) return res.status(400).json({ error: 'title is required' });
  const todo = { id: nextId++, title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'not found' });
  todo.done = !todo.done;
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== Number(req.params.id));
  res.status(204).end();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`${APP_NAME} listening on port ${PORT}`);
});
