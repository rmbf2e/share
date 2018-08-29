// const alias = require('./build/alias')

const styleLoader = {
  loader: 'style-loader',
  options: {
    sourceMap: true,
  },
}

const config = {
  // entry: {
  //   index: [resolvePath('./app/index.js')],
  // },
  // output: {
  //   publicPath: '/',
  //   filename: 'asset/[name]-[hash:5].js',
  //   chunkFilename: 'asset/[name]-chunk-[chunkhash:5].js',
  // },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.less'],
    alias: {
      share: './src/',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              compact: false,
              babelrc: false,
              presets: ['@babel/preset-react', '@babel/preset-env'],
              plugins: [
                [
                  'import',
                  {
                    libraryName: 'lodash',
                    libraryDirectory: '',
                    camel2DashComponentName: false,
                  },
                  'lodash',
                ],
                [
                  'import',
                  {
                    libraryName: 'antd',
                    style: true,
                  },
                  'antd',
                ],
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-jsx',
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    legacy: true,
                  },
                ],
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    loose: true,
                  },
                ],
              ],
              env: {
                production: {
                  plugins: ['transform-react-remove-prop-types'],
                },
              },
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              enforce: 'pre',
              exclude: /node_modules/,
            },
          },
        ],
        // include: [
        //   resolvePath('./app'),
        //   resolvePath('./node_modules/lodash-es'),
        // ],
      },
      {
        test: /\.m\.less$/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              localIdentName: '[name]__[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              javascriptEnabled: true,
              // modifyVars: theme,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              localIdentName: '[name]__[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              javascriptEnabled: true,
              // modifyVars: theme,
            },
          },
        ],
        exclude: /\.m\.less$/,
      },
      {
        test: /\.css$/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '/images/[hash:8][name].[ext]',
            },
          },
        ],
      },
      // {
      //   test: /\.(svg)$/i,
      //   loader: 'svg-sprite-loader',
      //   include: [
      //     require.resolve('antd-mobile').replace(/warn\.js$/, ''),
      //     path.resolve(__dirname, 'app/images'),
      //   ],
      // },
      // {
      //   test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
      //   exclude: [
      //     require.resolve('antd-mobile').replace(/warn\.js$/, ''),
      //     path.resolve(__dirname, 'app/images'),
      //   ],
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //     name: '/fonts/[name].[hash:8].[ext]',
      //   },
      // },
    ],
  },
}

module.exports = config
