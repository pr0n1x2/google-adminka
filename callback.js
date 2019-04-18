const checkTokenInUserCookies = (req, res, next) => {
    const userId = 10;

    if (req.session.userId) {
        req.sessionStore.destroy(userId, async (err, sess) => {
            await Token.deleteMany({userId: userId});

            return res.render('login', {title: 'Login page'});
        });
    }

    next();
};