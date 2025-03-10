module.exports = {
    // Project settings
    name: "Zyra Chat App",
    version: "1.0.0",
    
    // Server configuration
    server: {
        port: 3000,
        host: "localhost",
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    },

    // WebSocket configuration
    socket: {
        path: "/ws",
        transports: ["websocket", "polling"]
    },

    // Build configuration
    build: {
        outDir: "dist",
        minify: true,
        sourcemap: true,
        assets: ["public"]
    },

    // Development configuration
    dev: {
        port: 3001,
        hot: true,
        open: true
    },

    // Compiler options
    compiler: {
        target: "es2020",
        module: "esm",
        jsx: "automatic",
        typescript: true,
        decorators: true
    },

    // Dependencies to be included
    dependencies: {
        "socket.io-client": "^4.7.0",
        "marked": "^9.0.0",
        "date-fns": "^2.30.0"
    }
}; 