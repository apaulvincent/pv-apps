module.exports = (phase, { defaultConfig }) => {
    return {
        env: {
            PORT: process.env.PORT || 9000,
            IOPATH: process.env.NODE_ENV !== 'production' ? `http://localhost:${process.env.PORT}` : "https://pv-poker.herokuapp.com"
        },
    }
}