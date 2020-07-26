const VueLoaderPlugin      = require('vue-loader/lib/plugin');
const UglifyJSPlugin       = require('uglifyjs-webpack-plugin');
const helpers              = require('./helpers');
const isDev                = process.env.NODE_ENV !== 'production';
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const webpackConfig = (rt) => {
  const root = `${rt}/vue`;
  return {
    mode: isDev ? 'development' : 'production',
    entry: {
      main: helpers.root(root, 'main.js')
    },
    output: {
        path: helpers.root(rt),
        publicPath: '',
        filename: 'js/[name].js',
    },
    resolve: {
      extensions: [ '.js', '.vue' ],
      alias: {
        'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
        '@': helpers.root(root)
      }
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          include: [ helpers.root(root) ]
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [ helpers.root(root) ]
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            { loader: 'css-loader' },
          ]
        },
        {
          test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
          loader: 'ignore-loader',
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: 'ignore-loader',
        },
        {
          test: /\.sass$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: { url: false }
            },
            {
              loader: 'sass-loader',
              options: {
                indentedSyntax: true,
                sassOptions: {
                  indentedSyntax: true
                }
              }
            }
          ]
        }
      ]
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                sourceMap: isDev
            })
        ],
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name (module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `npm.${packageName.replace('@', '')}`;
                    }
                }
            }
        }
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        // inject: false,
        // chunks: ['main'],
        filename: 'Main.html',
        // template: `${rt}/wp_template.html`
        template: 'dashboard/wp_template.html'
      }),
      new BundleAnalyzerPlugin({analyzerMode: 'static', reportFilename: `../analys/${rt}.html`, openAnalyzer: false})
    ],
    watch: isDev
  }
};

if (isDev) {
    webpackConfig.devtool = 'source-map';
    webpackConfig.devtool = 'cheap-module-eval-source-map';
}

module.exports = webpackConfig;