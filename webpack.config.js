const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('dotenv').config();

const ENV_HOST = process.env.ENV_HOST ? process.env.ENV_HOST : 'http://localhost:4000';
const PATH = process.env.PROXY_VM ? process.env.PROXY_VM : 'localhost';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    bootstrap: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/app/polyfill.js'),
      path.resolve(__dirname, 'src/bootstrap.jsx')
    ],
    main: [path.resolve(__dirname, 'src/initStore.js'), path.resolve(__dirname, 'src/index.jsx')]
  },
  output: {
    filename: '[name].js',
    publicPath: `http://${PATH}:8002/`
  },
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    modules: ['src', 'sass', 'public', 'node_modules'],
    // When requiring, you don't need to add these extensions
    extensions: ['.js', '.jsx'],
    enforceExtension: false,
    alias: {
      components: path.resolve(__dirname, 'src', 'app', 'components'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'react-redux': path.resolve('./node_modules/react-redux'),
      'react-router-dom': path.resolve('./node_modules/react-router-dom'),
      'edc-web-sdk': path.resolve('./node_modules/edc-web-sdk'),
      styles: path.resolve(__dirname, 'src', 'app', 'styles')
    }
  },
  stats: 'minimal',
  devServer: {
    proxy: {
      '/api/*': {
        logLevel: 'debug',
        target: ENV_HOST,
        secure: false,
        changeOrigin: true,
        xfwd: false,
        onProxyReq: function(proxyReq, req, res) {
          // TODO: Find a way to proxy based on login
          if (process.env.ENV_HOST) {
            // Not elegant, but copy your cookie here to proxy to another instance
            const sessionId = process.env.PROXY_SESSION_ID || 'a77ef7594ca14c9d641920d9304a5643';
            proxyReq.setHeader('cookie', '_edcast_session=' + sessionId);
          }
        },
        onProxyRes: function(proxyRes, req, res) {
          // Unsure what changed, but CF is now returning a specific set instead of honoring what was requested (line 73)
          proxyRes.headers['access-control-allow-methods'] =
            req.headers['access-control-request-method'];
          proxyRes.headers['access-control-allow-origin'] = req.headers['origin'];
          proxyRes.headers['access-control-allow-headers'] =
            req.headers['access-control-request-headers'];
          // console.log("PROXY RESPONSE");
          // console.log(proxyRes.headers);
        }
      },
      '/cms/*': 'http://localhost:4000',
      '/assets/*': 'http://localhost:4000',
      '/follows': 'http://localhost:4000',
      '/system/*': 'http://localhost:4000',
      '/auth/*': 'http://localhost:4000',
      '/posts/*': 'http://localhost:4000',
      '/comments/*': 'http://localhost:4000'
    },
    hot: true,
    client: {
      progress: true,
      overlay: false
    },
    historyApiFallback: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    },
    host: '0.0.0.0',
    port: 8002
  },
  module: {
    rules: [
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      //include update repos like edc-web-sdk later
      {
        test: /\.(ico|gif|png|jpg|jpeg|svg|webp)$|.js$|jsx/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          context: 'public',
          name: './images/[name].[ext]'
        }
      },
      {
        test: /\.(html|css)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      // adding svg to resolve icon module parser error
      {
        test: /\.(eot|ttf|woff|svg)$/,
        exclude: /node_modules.(?!centralized-design-system)/,
        loader: 'file-loader'
      },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [require('postcss-rtl')()]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      }
    }),
    new webpack.ProgressPlugin({
      entries: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      'process.env.WALLET_HOST': JSON.stringify(process.env.WALLET_HOST)
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: true
    })
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   openAnalyzer: true
    // })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/].*js/,
          name: 'common',
          chunks: 'initial'
        }
      }
    }
  },
  resolve: {
    fallback: {
      fs: false
    },
    modules: [__dirname, 'node_modules'],
    extensions: [".ts",".js"],
  }
};