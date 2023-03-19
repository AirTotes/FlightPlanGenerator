module.exports = {
  entry: './src/flight_plan_sheet.js',
  mode: 'production',
  output: {
    publicPath: '',
    path: `${__dirname}/dst`,
    filename: 'flight_plan_sheet.js'
  },
  performance: {
    maxAssetSize: 1_000_000,
    maxEntrypointSize: 1_000_000,
  },
};