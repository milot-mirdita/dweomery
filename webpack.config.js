const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostcssPresetEnvPlugin = require('postcss-preset-env');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isPageMeasure = typeof (env) != 'undefined' && env.PAGE_MEASURE === true;

    var exports = {
        entry: !isPageMeasure 
                ? path.resolve(__dirname, './src/main.js')
                : path.resolve(__dirname, './src/measure.js'),
        target: 'web',
        mode: argv.mode,
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
            filename: !isPageMeasure 
                        ? 'build.[hash:7].js'
                        : 'measure.[hash:7].js',
            crossOriginLoading: 'anonymous',
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
                    ]
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
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.(s(a|c)ss)$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', {
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
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/index.html')
            }),
            new FaviconsWebpackPlugin({
                logo: path.resolve(__dirname, './logo.svg')
            }),
            new MiniCssExtractPlugin({
                filename: 'style.[hash:7].css',
            }),
            new SriPlugin({
                enabled: isProduction,
                hashFuncNames: ['sha256', 'sha384']
            }),
            new CompressionPlugin({
                test: isProduction ? /\.(js|html|css|svg)(\?.*)?$/i : undefined,
                minRatio: 1
            })
        ],
        devtool: isProduction ? '#source-map' : '#eval-source-map'
    }

    return exports;
}
