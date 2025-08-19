const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

module.exports = {
  mode: 'production',
  entry: './src/widget/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist/widget'),
    filename: 'etic-ai-widget.js',
    library: 'EticAIWidget',
    libraryTarget: 'umd',
    globalObject: 'this',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.widget.json',
          },
        },
        exclude: [
          /node_modules/,
          /\.test\./,
          /\.spec\./,
          /__tests__/,
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.widget.config.js'),
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // Copy additional widget files
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('CopyWidgetFiles', () => {
          const srcDir = path.resolve(__dirname, 'src/widget');
          const distDir = path.resolve(__dirname, 'dist/widget');
          
          // Files to copy
          const filesToCopy = [
            'loader.js',
            'integration-snippet.js',
            'iframe.html',
            'demo.html',
            'test-integration.html',
            'README.md',
            'INTEGRATION_GUIDE.md'
          ];
          
          filesToCopy.forEach(file => {
            const srcPath = path.join(srcDir, file);
            const distPath = path.join(distDir, file);
            
            if (fs.existsSync(srcPath)) {
              fs.copyFileSync(srcPath, distPath);
              console.log(`Copied ${file} to dist/widget/`);
            }
          });
        });
      }
    }
  ],
  externals: {
    // Don't bundle React if it's available globally
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
    },
  },
  optimization: {
    minimize: true,
  },
};