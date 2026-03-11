"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static('public'));
// MEMORY:
const credentials = { username: 'admin', password: 'admin12345' };
// MIDDLEWARE:
const protectedRoute = (req, res, next) => {
    if (req.cookies.user_auth) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
// ROUTES:
app.get('/', (req, res) => {
    res.render('index', { user: req.cookies.user_auth });
});
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === credentials.username && password === credentials.password) {
        res.cookie('user_auth', username, { httpOnly: true });
        res.redirect('/profile');
    }
    else {
        res.render('login', { error: 'User/Password invalid!' });
    }
});
app.get('/profile', protectedRoute, (req, res) => {
    res.render('profile', { user: req.cookies.user_auth });
});
app.get('/logout', (req, res) => {
    res.clearCookie('user_auth');
    res.redirect('/login');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
