// webpack.prod.ts

import webpack from "webpack";
import path from "path"
import { fileURLToPath } from "url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import CopyWebpackPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Config | Production
const configProduction: any = {

    // Set the mode to development or production
    mode: "production",

    // context: path.join(__dirname, "your-app"),

    entry: "./src/scss/index.scss",

    // output: {
    //     path: path.resolve(__dirname, "dist"),
    // },

    output: {
        library: "Stylescape",
        libraryTarget: "umd",
        libraryExport: "default",
        path: path.resolve(__dirname, "dist"),
        filename: "stylescape.js",
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // {
                    //     loader: "css-loader",
                    //     options: {
                    //         importLoaders: 2,
                    //         sourceMap: true,
                    //         modules: false,
                    //     },
                    // },
                    // "postcss-loader",
                    "css-loader",
                    "sass-loader"
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: "stylescape.css",
            }
        ),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        // from: "static"
                        from: "src/font"
                    }
                ]
            }
        ),
    ],

};

export default configProduction
