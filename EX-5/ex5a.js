import express from "express";
import mongoose from "mongoose";
const app = express();
const port = 3000;
app.use(express.json());
const mongoUri = "mongodb://localhost:27017/crud_demo";
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no two users have the same email
  },
  age: {
    type: Number,
  },
});
const User = mongoose.model("User", userSchema);
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser); // Send back the newly created user with status 201 (Created)
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists." });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); // Send back all users
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user); // Send back the found user
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user); // Send back the updated user
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
