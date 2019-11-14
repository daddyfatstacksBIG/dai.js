const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/bundle/index.js'],
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].[hash].js',
    sourceMapFilename: '[name].[hash].js.map',
    library: '@makerdao/dai',
    libraryTarget: 'umd'
  },
  resolve: { extensions: ['.js', '.json'] },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Maker.js demo',
      template: 'src/bundle/index.html',
      inject: 'head'
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        beautify: false,
        mangle: { keep_fnames: true },
        comments: false
      }
    })
  ],
  externals: ['child_process']
};

if (process.env.ANALYZE_BUNDLE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  module.exports.plugins.push(new BundleAnalyzerPlugin());
}
