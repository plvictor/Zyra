module.exports = {
  // Project settings
  name: "zyra-docs",
  version: "0.1.0",
  
  // Server configuration
  server: {
    port: 3000,
    host: "localhost"
  },
  
  // Build configuration
  build: {
    outDir: "dist",
    minify: true,
    sourcemap: true
  }
};