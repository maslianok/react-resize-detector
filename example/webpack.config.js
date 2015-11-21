var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: { 
    alias: {'react-resize-detector': path.join(__dirname, '..', 'src', 'index.js')},
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
    }]
  }
}


// When inside repo, prefer src to compiled version.
// You can safely delete these lines in your project.
// var src = path.join(__dirname, '..', 'src')
// var fs = require('fs')
// if (fs.existsSync(src)) {
//   // Resolve to source
//   module.exports.resolve = { alias: { 'react-responsive-tabs': src } }
//   // Compile from source
//   // module.exports.module.loaders.push({
//   //   test: /\.js$/,
//   //   loaders: ['babel'],
//   //   include: src
//   // })
// }






