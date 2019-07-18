module.exports = {
  // 基本路径
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // 打包后资源文件的目录，相对outputDir下
  assetsDir: "static",
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      "/ctm014ks/service/rs/ui/v1": {
        target: "https://10.19.132.32",
        changeOrigin: true,
        ws: false,
        secure: false
      },
      "^/hmap-server": {
        target: "https://10.19.132.32",
        changeOrigin: true,
        ws: false,
        secure: false
      }
    }
  },
  // 第三方插件配置
  pluginOptions: {
    pwa: {
      iconPaths: {
        favicon32: "./public/favicon.ico",
        favicon16: "./public/favicon.ico",
        appleTouchIcon: "./public/favicon.ico",
        maskIcon: "./public/favicon.ico",
        msTileImage: "./public/favicon.ico"
      }
    }
  },
  configureWebpack: config => {
    config.externals = {
      // hmap: "hmap"
    };
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
  }
};
