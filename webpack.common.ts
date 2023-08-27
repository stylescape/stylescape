// webpack.common.ts

// import webpack from 'webpack';
import paths from './webpack.paths';
// import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import { CleanWebpackPlugin } from 'clean-webpack-plugin';


// Config | Common
const configCommon: any = {

    // mode: '',

    target: 'web',

    // Where webpack looks to start building the bundle
    entry: [
        paths.src + '/index.ts'
        // Widget: paths.src + '/index.ts'
    ],


    // Determine how modules within the project are treated
    module: {
        rules: [

            // TypeScript
            {
                test: /\.ts$/,
                use: [{ loader: 'ts-loader' }],
                // test: /\.tsx?$/,
                // use: 'ts-loader',
                exclude: /node_modules/,
            },

            // JavaScript // remove babel from packages?
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: ['babel-loader'],
            // },

            // Fonts and SVGs
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },

            // CSS, PostCSS, and Sass
            // {
            //     test: /\.(scss|css)$/,
            //     use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            // },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    'sass-to-string',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['css-loader'],
            },

            // Images
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg|gif)$/i,
                type: 'asset/resource',
            },

            // Nunjucks
            {
                test: /\.(njk|nunjucks|jinja)$/,
                loader: 'nunjucks-loader',
                // query: {
                    // config: __dirname + '/src/nunjucks.config.js',
                    // jinjaCompat: true,
                    // root: __dirname + '/path/to/templates',
                    // quiet: true // Don't show the 'Cannot configure nunjucks environment before precompile' warning

                // }
            }
        ],
    },


    resolve: {
        modules: [paths.src, 'node_modules'],
        extensions: [
            '.ts', '.tsx',
            '.js', '.jsx',
            '.json',
            '.scss'
        ],
        alias: {
            '@': paths.src,
            assets: paths.public,
        },
    },

    // Where webpack outputs the assets and bundles
    // output: {
    //     path: paths.build,
    //     filename: '[name].bundle.js',
    // },
    output: {
        library: 'WidgetDeckGL',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: paths.build,
        filename: 'widget.js',
    },

    // Customize the webpack build process
    plugins: [

        // Removes/cleans build folders and unused assets when rebuilding
        // new CleanWebpackPlugin(
        // ),

        // Copies files from target to destination folder
        // new CopyWebpackPlugin(
        //     {
        //         patterns: [
        //             {
        //                 from: paths.public,
        //                 to: 'assets',
        //                 globOptions: {
        //                     ignore: ['*.DS_Store'],
        //                 },
        //                 noErrorOnMissing: true,
        //             },
        //         ],
        //     }
        // ),

        // Generates an HTML file from a template
        new HtmlWebpackPlugin(
            {
                title: 'NIJI',
                // template: paths.src + '/template.html',
                template: paths.src + '/index.html',
                filename: 'index.html',
            }
        ),


    ],
};

// Config | Export
export default configCommon
