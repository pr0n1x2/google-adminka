module.exports = {
    session: {
        name: 'sid',
        lifetime: 1000 * 60 * 60 * 2, // Two hours
        secret: 'G8:p5*:.t#$bY%LF',
        in_prod: false
    }
};