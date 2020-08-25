const webpack = require("webpack");
const path = require("path");

const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // https://github.com/webpack-contrib/mini-css-extract-plugin#advanced-configuration-example
const UglifyJS = require("uglify-js");
const OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin");

const devMode = process.env.NODE_ENV !== 'production';

/**
 * Rules
 */
let Rules = [];

Rules.push({
  test: /\.(js?|jsx?)$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', "@babel/preset-react"],
      plugins: ['@babel/plugin-proposal-class-properties']
    }
  }
});

Rules.push({
	test: /\.(sa|sc|c)ss$/,
	use: [{
      loader: MiniCssExtractPlugin.loader,
      options: {
				hmr: process.env.NODE_ENV === 'development' // Hot Module Reloading
      },
    },
		'css-loader',
    'postcss-loader',
    'sass-loader'
  ],
});

Rules.push({
	test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/'
      }
    }
  ]
});

/**
 * Extensions
 */
const Extensions = [];

Extensions.push('*');
Extensions.push('.js');
Extensions.push('.jsx');

/**
 * plugins
 */

 const Plugins = [];

 Plugins.push(
   new MiniCssExtractPlugin({
     filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
     chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
   })
 );

/**
 * Configuration
 */

let config = {
  entry: "./src/js/index.js",

	output: {
    path: path.resolve(__dirname, "./public"),
    filename: "./js/bundle.js"
	},

	mode: process.env.NODE_ENV || 'development',

	module: { rules: Rules},

  resolve: { extensions: Extensions },

	plugins: Plugins,
}

module.exports = (env, argv) => {

  if (argv.mode === 'development') {
		config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    argv.plugins.push(
			new UglifyJS(),
			new OptimizeCSSAssets()
		);
  }

  return config;
};
