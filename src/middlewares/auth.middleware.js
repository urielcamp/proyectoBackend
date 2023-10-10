export const privateRoutes = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login'); // Redirigir a /login si el usuario no está autenticado.
    next();
}

export const publicRoutes = (req, res, next) => {
    if (req.session.user) return res.redirect('/'); // Redirigir a la página de inicio si el usuario ya está autenticado.
    next();
}
