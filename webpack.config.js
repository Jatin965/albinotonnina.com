const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
const StringReplacePlugin = require("string-replace-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = function (env = {}) {

    const extractSass = new ExtractTextPlugin({
        filename: "styles.css"
    });

    const plugins = (() => {

        const pluginsArray = [
            extractSass,

            new CleanWebpackPlugin('build'),
            new HtmlWebpackPlugin({template: './src/index.hbs'}),
            new ModernizrWebpackPlugin({
                'feature-detects': [
                    'svg'
                ]
            }),
            new StringReplacePlugin()
        ];

        if (env.production) {
            pluginsArray.push(new webpack.optimize.UglifyJsPlugin());

        }

        return pluginsArray;

    })();

    return {
        devtool: 'source-map',
        entry: './src/scripts/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js'
        },
        plugins,
        devServer: {
            contentBase: path.join(__dirname, "build"),
            compress: true,
            port: 4000,
            host: '0.0.0.0',
            open: true,
            inline: true
        },
        module: {
            rules: [
                {
                    test: /\.hbs$/,
                    loader: 'handlebars-loader',
                    query: {
                        partialDirs: [
                            path.join(__dirname, 'src')
                        ],
                        inlineRequires: '/images/'
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: extractSass.extract({
                        use: [{
                            loader: "raw-loader"
                        }, {
                            loader: "sass-loader"
                        }]
                    })
                },

                {
                    test: /\.html$/,
                    use: ["html-loader"]
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader'
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader?classPrefix'
                },
                {
                    test: /\.svg$/,
                    loader: StringReplacePlugin.replace({
                        replacements: [
                            {
                                pattern: /font-family="'Roboto-Thin'"/ig,
                                replacement: () => 'font-weight="100"'
                            },
                            {
                                pattern: /font-family="'Roboto-Light'"/ig,
                                replacement: () => 'font-weight="300"'
                            },
                            {
                                pattern: /font-family="'Roboto-Regular'"/ig,
                                replacement: () => 'font-weight="400"'
                            },
                            {
                                pattern: /font-family="'Roboto-Black'"/ig,
                                replacement: () => 'font-weight="900"'
                            }
                        ]
                    })
                }
            ]
        }
    }
};
