// webpack.prod.ts

import path from 'path'
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// import paths from './webpack.paths';
// import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Config | Production
const configProduction: any = {

    // Set the mode to development or production
    mode: 'production',

    entry: './src/scss/index.scss',

    output: {
        path: path.resolve(__dirname, 'dist'),
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader'
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: 'index.css',
            }
        ),
    ],

};
