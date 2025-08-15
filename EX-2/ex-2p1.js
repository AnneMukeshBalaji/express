import express from 'express' 
const app = express()
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the Express.js Routing Example!');
});
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID from route parameter is: ${userId}`);
});
app.get('/product/:category/:id', (req, res) => {
  const { category, id } = req.params;
  res.send(`Product category: ${category}, Product ID: ${id}`);
});

app.get('/search', (req, res) => {
  const { keyword, page } = req.query;
  res.send(`Search results for keyword = ${keyword}, Page = ${page}`);
});
app.get('/build-url', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  const productUrl = baseUrl + '/product/electronics/123?ref=homepage';
  res.send(`Built URL: ${productUrl}`);
});
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
