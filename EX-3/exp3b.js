import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
const upload = multer();  
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.none());

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/submit', (req, res) => {
  console.log('Received form data:', req.body);
  const { name, email } = req.body;
  res.render('result', { name, email });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
