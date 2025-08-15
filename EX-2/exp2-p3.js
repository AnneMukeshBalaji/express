import express from 'express'
const app = express();
app.use(express.json());
const logger = (req, res, next) => {
  console.log(`[LOG] ${new Date().toLocaleString()} | ${req.method} ${req.url}`);
  next(); 
};
app.use(logger); 
const authCheck = (req, res, next) => {
  const isAuthenticated = true;
  if (isAuthenticated) {
    next(); 
  } else {
    res.status(401).send('Unauthorized');
  }
};
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
app.get('/users', authCheck, (req, res) => {
  res.json(users);
});
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(newUser);
  res.status(201).json(newUser);
});
app.use((req, res) => {
  res.status(404).send('Route Not Found');
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
