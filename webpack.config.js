const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostcssPresetEnvPlugin = require('postcss-preset-env');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

const isDevServer = process.env.WEBPACK_DEV_SERVER;
const serveLanding = process.env.SERVE_LANDING;

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isPageMeasure = typeof (env) != 'undefined' && env.PAGE_MEASURE === true;

    var exports = {
        entry: isPageMeasure
            ? path.resolve(__dirname, './src/measure.js')
            : serveLanding
                ? path.resolve(__dirname, './src/landing.js')
                : {
                    app: path.resolve(__dirname, './src/app.js'),
                    landing: path.resolve(__dirname, './src/landing.js')
                },
        target: 'web',
        mode: argv.mode,
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
            filename: !isPageMeasure 
                ? (isDevServer ? '[name].[hash].bundle.js' : '[name].[chunkhash].bundle.js')
                : 'measure.js',
            crossOriginLoading: 'anonymous',
        },
        optimization: {
            splitChunks: {
                chunks: "all"
            }
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        include: [
                            path.resolve(__dirname, './src'),
                        ]
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [
                        path.resolve(__dirname, './src'),
                    ],
                    options: {
                        plugins: [
                            "@babel/plugin-syntax-dynamic-import"
                        ]
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg|ttf|woff2?|eot)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.css$/,
                    use: [!isPageMeasure ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
                },
                {
                    test: /\.(s(a|c)ss)$/,
                    use: [!isPageMeasure ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', {
                        loader: 'postcss-loader', options: {
                            ident: 'postcss',
                            plugins: () => [
                                PostcssPresetEnvPlugin()
                            ]
                        }
                    }, 'sass-loader']
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: !isPageMeasure ? {
                'vue$': 'vue/dist/vue.runtime.esm.js',
            } : {}
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(argv.mode)
                }
            }),
            new VueLoaderPlugin(),
            new SriPlugin({
                enabled: isProduction,
                hashFuncNames: ['sha256', 'sha384']
            }),
            new CompressionPlugin({
                // test: isProduction ? /\.(js|html|css|svg|woff2?|eot)(\?.*)?$/i : undefined,
                minRatio: 1
            }),
            ...(isPageMeasure
                ? [
                    new HtmlWebpackPlugin({
                        template: path.resolve(__dirname, './src/app.html'),
                        filename: 'measure.html'
                    }),
                ] 
                : serveLanding
                    ? [
                        new HtmlWebpackPlugin({
                            template: path.resolve(__dirname, './src/landing.html'),
                            filename: 'index.html',
                        })
                    ]
                    : [
                        new HtmlWebpackPlugin({
                            template: path.resolve(__dirname, './src/app.html'),
                            filename: isDevServer ? 'index.html' : 'app.html',
                            excludeChunks: ['landing'],
                        }),
                        new HtmlWebpackPlugin({
                            template: path.resolve(__dirname, './src/landing.html'),
                            filename: 'landing.html',
                            excludeChunks: ['app'],
                        }),
                    ]
            ),
            ...[
                new MiniCssExtractPlugin({
                    filename: 'style.[chunkhash].css',
                }),
                new FaviconsWebpackPlugin({
                    logo: path.resolve(__dirname, './src/assets/logo.svg')
                })
            ],
            ...[
                new OfflinePlugin()
            ]
        ],
        devtool: isProduction ? '#source-map' : '#eval-source-map'
    }

    return exports;
}
