const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/scripts/settings.js'),
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
            favicon: path.resolve(__dirname, './src/puzzle.svg'),
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader',
            },
            {
                test: /\.jpg$/,
                include: path.resolve(__dirname, 'src/assets/images/'),  
                use: [{
                    loader: 'url-loader',

                    options: { 
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'assets/images/[name].[ext]'
                    } 
                }]
            }
        ]
    }
}