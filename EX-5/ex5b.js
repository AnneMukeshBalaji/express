import express from "express";
import mongoose from "mongoose";
const app = express();
const port = 3000;
app.use(express.json());
const mongoUri = "mongodb://localhost:27017/spa_demo";
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
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
    unique: true,
  },
  age: {
    type: Number,
  },
});
const User = mongoose.model("User", userSchema);
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists." });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/users/:id", async (req, res) => {
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
const spaHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management SPA</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 2rem; background-color: #f4f7f9; color: #333; }
        .container { max-width: 800px; margin: auto; padding: 2rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        h1 { text-align: center; color: #2c3e50; }
        form { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        input[type="text"], input[type="number"], input[type="email"] { padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
        button { padding: 0.75rem; border: none; border-radius: 8px; background-color: #3498db; color: white; cursor: pointer; font-size: 1rem; transition: background-color 0.3s; }
        button:hover { background-color: #2980b9; }
        .user-list { display: flex; flex-direction: column; gap: 1rem; }
        .user-card { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background-color: #ecf0f1; border-radius: 8px; }
        .user-info { flex-grow: 1; }
        .user-info h3 { margin: 0 0 0.5rem; }
        .actions { display: flex; gap: 0.5rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>User Management</h1>
        <form id="userForm">
            <input type="hidden" id="userId">
            <input type="text" id="name" placeholder="Name" required>
            <input type="email" id="email" placeholder="Email" required>
            <input type="number" id="age" placeholder="Age" min="0">
            <button type="submit">Create User</button>
        </form>
        <div class="user-list" id="userList"></div>
    </div>

    <script>
        const form = document.getElementById('userForm');
        const userIdInput = document.getElementById('userId');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const ageInput = document.getElementById('age');
        const userList = document.getElementById('userList');

        // Function to fetch and display users
        async function fetchUsers() {
            try {
                const response = await fetch('/api/users');
                const users = await response.json();
                userList.innerHTML = ''; // Clear existing list
                users.forEach(user => {
                    const userCard = document.createElement('div');
                    userCard.className = 'user-card';
                    userCard.innerHTML = \`
                        <div class="user-info">
                            <h3>\${user.name}</h3>
                            <p>Email: \${user.email}</p>
                            <p>Age: \${user.age || 'N/A'}</p>
                        </div>
                        <div class="actions">
                            <button onclick="editUser('\${user._id}', '\${user.name}', '\${user.email}', \${user.age || null})">Edit</button>
                            <button onclick="deleteUser('\${user._id}')">Delete</button>
                        </div>
                    \`;
                    userList.appendChild(userCard);
                });
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        }

        // Handle form submission (Create or Update)
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = {
                name: nameInput.value,
                email: emailInput.value,
                age: ageInput.value ? parseInt(ageInput.value) : undefined
            };

            const userId = userIdInput.value;
            let response;

            if (userId) {
                // Update existing user
                response = await fetch(\`/api/users/\${userId}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                form.querySelector('button[type="submit"]').textContent = 'Create User';
            } else {
                // Create new user
                response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
            }

            if (response.ok) {
                form.reset();
                userIdInput.value = ''; // Reset hidden ID
                fetchUsers(); // Refresh the list
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        });

        // Function to populate form for editing
        function editUser(id, name, email, age) {
            userIdInput.value = id;
            nameInput.value = name;
            emailInput.value = email;
            ageInput.value = age;
            form.querySelector('button[type="submit"]').textContent = 'Update User';
        }

        // Function to delete a user
        async function deleteUser(id) {
            if (confirm('Are you sure you want to delete this user?')) {
                const response = await fetch(\`/api/users/\${id}\`, { method: 'DELETE' });
                if (response.ok) {
                    fetchUsers();
                } else {
                    const error = await response.json();
                    alert('Error: ' + error.error);
                }
            }
        }

        // Initial fetch to load existing users
        fetchUsers();
    </script>
</body>
</html>
`;
app.get("/", (req, res) => {
  res.status(200).send(spaHtml);
});
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log("Open your browser and navigate to the address above.");
  });
});
