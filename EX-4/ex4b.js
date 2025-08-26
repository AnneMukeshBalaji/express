import express from "express";
import session from "express-session";  
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } 
}));
const USER = { username: "admin", password: "12345" };

app.get('/', (req, res) => {
    res.send(`
        <h2>Login</h2>
        <form method="post" action="/login">
            <input type="text" name="username" placeholder="Username" required/><br>
            <input type="password" name="password" placeholder="Password" required/><br>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USER.username && password === USER.password) {
        req.session.user = username; // Store username in session
        res.send(`Welcome ${username}! <br><a href="/dashboard">Go to Dashboard</a>`);
    } else {
        res.send("Invalid username or password. <a href='/'>Try again</a>");
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send(`
            <h2>Hello ${req.session.user}, you are logged in!</h2>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send("Unauthorized access. <a href='/'>Login first</a>");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send("Error logging out");
        res.clearCookie('connect.sid');
        res.send("You have been logged out. <a href='/'>Login again</a>");
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
