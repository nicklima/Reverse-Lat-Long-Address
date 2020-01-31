const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.min.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }]
    }
}