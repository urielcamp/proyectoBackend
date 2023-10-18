export const privateRoutes = (req, res, next) => {
    if (req.session.user) return res.redirect('/products');
    next();
}

export const publicRoutes = (req, res, next) => {
    if (!req.session.user) return res.redirect('/');
    next()
}

