const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

const buildPath = "build";
//TODO NODE_ENV check to propd
const isProd = process.env.npm_lifecycle_event === 'prod';
const cssDev = ['style-loader','css-loader','sass-loader'];
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader','sass-loader'],
    publicPath: buildPath
});
const cssConfig = isProd  ? cssProd : cssDev;

console.log(isProd ? "production build" : "development build");
console.log(process.argv);
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, buildPath),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.sass$/,
                use: cssConfig
            },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            //TODO static dir check in regexp
            //TODO prod build with build dir
            {test: /\.(jpe?g|png|gif|svg)$/,
                use: ['file-loader?name=/images/[hash].[ext]',
                      'image-webpack-loader'
                ]}
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Stiv",
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true
            },
            hash: true
        }),
        new ExtractTextPlugin({
            filename: "style.css",
            allChunks: true,
            disable: !isProd
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, buildPath),
        compress: true,
        stats: "errors-only",
        open: true,
        hot: true
    },

};
