const express = require("express");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;
const app = express();

// In-memory data store with sample data (for demonstration purposes)
let dataStore = [
  { id: 1, name: "milk" },
  { id: 2, name: "eggs" },
];

// Helper function to generate a unique ID
let nextId = 3;
function generateId() {
  return nextId++;
}

app.use(bodyParser.json());

// Create operation
app.post("/api/todo", (req, res) => {
  const newItem = req.body;
  newItem.id = generateId(); // Assign a unique ID to the new item
  dataStore.push(newItem);
  res.json({ message: "Item created successfully!", item: newItem });
});

// Read operation
app.get("/api/todo", (req, res) => {
  res.json({ items: dataStore });
});

// Update operation
app.put("/api/todo/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;

  dataStore = dataStore.map((item) => {
    if (item.id === itemId) {
      return { ...item, ...updatedItem };
    }
    return item;
  });

  res.json({ message: "To-do updated successfully!" });
});

// Delete operation
app.delete("/api/todo/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  dataStore = dataStore.filter((item) => item.id !== itemId);
  res.json({ message: "To-do deleted successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



//npm start