import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// MEMORY:
const credentials = { username: 'admin', password: 'admin12345' };

// MIDDLEWARE:
const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.user_auth) {
        next();
    } else {
        res.redirect('/login');
    }
};

// ROUTES:
app.get('/', (req: Request, res: Response) => {
    res.render('index', { user: req.cookies.user_auth });
});

app.get('/login', (req: Request, res: Response) => {
    res.render('login', { error: null });
});

app.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === credentials.username && password === credentials.password) {
        res.cookie('user_auth', username, { httpOnly: true });
        res.redirect('/profile');
    } else {
        res.render('login', { error: 'User/Password invalid!' });
    }
});

app.get('/profile', protectedRoute, (req: Request, res: Response) => {
    res.render('profile', { user: req.cookies.user_auth });
});

app.get('/logout', (req: Request, res: Response) => {
    res.clearCookie('user_auth');
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});