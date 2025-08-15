import express from 'express'
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  const user = {
    name: 'Ojas Gambeera',
    role: 'Developer',
    skills: ['Flutter', 'Python', 'ExpressJS', 'Deep Learning']
  };
  res.render('home', { user });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
