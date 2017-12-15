var path = require('path');
var webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

var DIST_DIR = path.join(__dirname, "dist");
var CLIENT_DIR = path.join(__dirname, "src");

module.exports = {
    context: CLIENT_DIR,
    entry: {
        path: path.join(CLIENT_DIR, "./web-app/web-app.jsx")
    },
    output: {
        filename: 'web-app.js',
        path: DIST_DIR
    },
    resolve: {
        extensions: ['.js', '.jsx', '.sass']
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$|\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.js$|\.jsx$/,
                use: [{loader: "source-map-loader"}],
                enforce: "pre"
            },
            {
                test: /\.sass$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "sass-loader",
                    ],
                }),
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
    ],
    externals: {
        "rect": "React"
    }
};
