module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://121.4.78.225:8888/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
