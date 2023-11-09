export const createCountController = async (req, res) => {
    res.redirect('/');
}

export const createSessionController = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
    }    
    req.session.user = {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        password: req.user.password,
        cart: req.user.cart,
        role: req.user.role,
        __v: req.user.__v
    }
    res.redirect('/products');
}

export const getSessionController = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar la sesión:', err);
                res.status(500).render('errors/base', { error: err });
            } else {
                // Redireccionar a la página de inicio después de cerrar la sesión
                res.redirect('/');
            }
        });
    } catch (error) {
        console.error('Error al cerrar la sesión:', error);
        res.status(500).render('errors/base', { error });
    }
}

export const getGithubSessionController = async(req, res) =>{
    console.log('Callback: ', req.user)
    req.session.user = req.user
    res.redirect('/products')
}