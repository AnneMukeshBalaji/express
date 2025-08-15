import express from "express";
const app = express();
app.use(express.json());

let items = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
];
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});
app.get("/items", (req, res) => {
  res.json(items);
});
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id == req.params.id);
  if (!item) return res.status(404).send("Item not found");
  res.json(item);
});
app.post("/items", (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});
app.delete("/items/:id", (req, res) => {
  const itemIndex = items.findIndex((i) => i.id == req.params.id);
  if (itemIndex === -1) return res.status(404).send("Item not found");
  const deletedItem = items.splice(itemIndex, 1);
  res.json({ message: "Item deleted", item: deletedItem });
});
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});