const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostcssPresetEnvPlugin = require('postcss-preset-env');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const isDevServer = process.env.WEBPACK_DEV_SERVER;

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isPageMeasure = typeof (env) != 'undefined' && typeof (env.PAGE_MEASURE) != 'undefined';
    const measure2e = isPageMeasure && env.PAGE_MEASURE == "2E";
    var exports = {
        entry: isPageMeasure
            ? (measure2e
                ? path.resolve(__dirname, './src/measure2e.js')
                : path.resolve(__dirname, './src/measure1e.js'))
            : {
                pf1e: path.resolve(__dirname, './src/pf1e.js'),
                pf2e: path.resolve(__dirname, './src/pf2e.js'),
                landing: path.resolve(__dirname, './src/landing.js')
            },
        target: 'web',
        mode: argv.mode,
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
            filename: isPageMeasure ? 'measure.js' : '[name].[hash].bundle.js',
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
                        name: '[name].[contenthash].[ext]',
                        esModules: false
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
            extensions: ['.js', '.vue'],
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
                hashFuncNames: ['sha256']
            }),
            new CompressionPlugin({
                minRatio: 1
            }),
            ...(isPageMeasure
                ? [
                    new HtmlWebpackPlugin({
                        template: path.resolve(__dirname, './src/app.html'),
                        filename: 'measure.html'
                    }),
                ] 
                : [
                    new HtmlWebpackPlugin({
                        template: path.resolve(__dirname, './src/app.html'),
                        filename: 'pf1e.html',
                        excludeChunks: ['landing', 'pf2e'],
                    }),
                    new HtmlWebpackPlugin({
                        template: path.resolve(__dirname, './src/app.html'),
                        filename: 'pf2e.html',
                        excludeChunks: ['landing', 'pf1e'],
                    }),
                    new HtmlWebpackPlugin({
                        template: path.resolve(__dirname, './src/landing.html'),
                        filename: 'index.html',
                        excludeChunks: ['pf1e', 'pf2e'],
                    }),
                ]
            ),
            ...[
                new MiniCssExtractPlugin({
                    filename: 'style.[contenthash].css',
                }),
                new FaviconsWebpackPlugin({
                    logo: path.resolve(__dirname, './src/assets/logo.svg'),
                    prefix: 'fav.[hash]',
                    favicons: {
                        icons: {
                            coast: false,
                            windows: false,
                            yandex: false
                        }
                    }
                })
            ],
        ],
        devtool: isProduction ? '#source-map' : '#eval-source-map'
    }

    return exports;
}
