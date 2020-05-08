const path = require('path');

module.exports = {
    entry: './public/app.jsx',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'all.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]

    }
};