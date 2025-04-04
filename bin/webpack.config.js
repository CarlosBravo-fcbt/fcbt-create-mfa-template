const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const dotenv = require('dotenv');
const webpack = require("webpack");
const deps = require("./package.json").dependencies;

// Helper function to resolve environment variables with placeholders
function resolveEnv(rawEnv) {
  const resolved = {};
  for (const [key, value] of Object.entries(rawEnv)) {
    resolved[key] = value.replace(/\${(.*?)}/g, (_, varName) => process.env[varName] || '');
  }
  return resolved;
}

// Function to prepare environment variables for DefinePlugin
function prepareEnvVariables(rawEnv, isProduction) {
  const resolvedEnv = resolveEnv(rawEnv);
  return Object.keys(resolvedEnv).reduce((acc, key) => {
    acc[`process.env.${key}`] = JSON.stringify(
      isProduction ? rawEnv[key] || `\${${key}}` : resolvedEnv[key]
    ); // Preserve placeholders in production
    return acc;
  }, {});
}

// Function to determine publicPath based on mode
function determinePublicPath(mode, host) {
  return mode === 'production'
    ? '${{{appName_upper}}_HOST}/' // Placeholder for production
    : `${host || ''}/`; // Resolved value for development
}


module.exports = (env, argv) => {
  const mode = argv.mode || 'development'; // Determine mode (default: development)

  // Determine .env file path based on mode and environment
  let envFilePath = mode === 'production' ? '.env' : `.env.${mode}`;
  if (mode === 'development' && process.env.NODE_ENV === 'sandbox') {
    envFilePath = '.env.sandbox';
  }

  // Load and resolve environment variables
  const rawEnv = dotenv.config({ path: envFilePath }).parsed || {};
  const isProduction = mode === 'production';
  const envVariables = prepareEnvVariables(rawEnv, isProduction);

  // Determine public path
  const publicPath = determinePublicPath(mode, process.env.{{appName_upper}}_HOST);

  return {
    mode,
  devServer: {
    port: `${process.env.DEVSERVER_PORT}`,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  externals: { "react:": "React" },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.module\.(css|s[ac]ss)$/i, // Match *.module.css, *.module.scss, *.module.sass
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true, // Enable CSS Modules
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        exclude: /\.module\.(css|s[ac]ss)$/i, // Exclude module files
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
        resolve: {
          extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
      },
      
    ],
  },
  output: {
    publicPath,    
    filename: '[name].[contenthash].js',
    chunkFilename: '[id].[contenthash].js',
    clean: true
  },
  plugins: [
    // Define environment variables
    new webpack.DefinePlugin(envVariables),
    new ModuleFederationPlugin({
      name: "{{appName}}",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {},
      shared: {
        // ...deps,
        react: {
          singleton: true,
          requiredVersion: false,
          eager: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
          eager: false,
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html', // Path to your HTML file
      filename: 'index.html',
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    fallback: {
      fs: false,
      os: false,
      path: false,
    },
  },
  target: "web",
}
};
