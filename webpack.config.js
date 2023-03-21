module.exports = {
  entry: './src/flight_plan_sheet.js',
  mode: 'production',
  output: {
    publicPath: '',
    path: `${__dirname}/dst`,
    filename: 'flight_plan_sheet.js'
  },
  performance: {
    maxAssetSize: 10_000_000,
    maxEntrypointSize: 10_000_000,
  },
  // ref: https://zenn.dev/sa2knight/articles/9b19ffd391bca87d7b8c
  devServer: {
    hot: true,
    static: {
      directory: `${__dirname}/src`,
    },
  },
};