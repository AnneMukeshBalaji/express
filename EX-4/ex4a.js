import express from "express";
import session from "express-session";
const app = express();
const PORT = 3000;

app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } 
}));

app.get("/", (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`<h2>Welcome back!</h2>
                  <p>You have visited this page ${req.session.views} times.</p>`);
    } else {
        req.session.views = 1;
        res.send("<h2>Welcome! This is your first visit.</h2>");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send("Error clearing session");
        res.clearCookie("connect.sid");
        res.send("Session ended. <a href='/'>Start again</a>");
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});