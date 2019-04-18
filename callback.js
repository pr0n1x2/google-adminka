const checkTokenInUserCookies = async (req, res, next) => {
    const userId = 10;

    req.sessionStore.destroy(userId, async (err, sess) => {
        await Token.deleteMany({userId: userId});

        return res.render('login', { title: 'Login page' });
    });

    next();
};