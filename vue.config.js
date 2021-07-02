let target = 'http://climate.sublab.cn/api';
const webpack = require('webpack')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/', //根路径
  outputDir: 'dist',  //构建输出目录
  assetsDir: 'assets', //静态资源目录（js,css,img,fonts）
  lintOnSave: false,
  productionSourceMap: false,

  //是否开启eslint保存监测，有效值： true || false || 'error'
  devServer: {
    open: false,      //打开页面
   host: '10.1.1.101',   //域名   127.0.0.0本机    0.0.0.0真机测试
     //host: 'localhost',   //域名   127.0.0.0本机    0.0.0.0真机测试
    port: '8081',     //端口号
    https: false,    //是否使用https
    hotOnly: false,
      //热更新
    // proxy: {
    //   //配置跨域
    //   '/api': {
    //     //target: 'http://192.168.1.123:80/api',   //协议头、域名、端口号有一个不同就是跨域
    //     target: 'http://climatedemo.sublab.cn/api',   //协议头、域名、端口号有一个不同就是跨域
    //     ws: true,      //是否跨域
    //     changOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   },
    //   '/oauth': {
    //     //target: 'http://192.168.1.123:80/oauth',   //协议头、域名、端口号有一个不同就是跨域
    //     target: 'http://climatedemo.sublab.cn/oauth',   //协议头、域名、端口号有一个不同就是跨域
    //     ws: true,      //是否跨域
    //     changOrigin: true,
    //     pathRewrite: {
    //       '^/oauth': ''
    //     }
    //   }
    // }
  },
  configureWebpack: {
    // 把原本需要写在webpack.config.js中的配置代码 写在这里 会自动合并
    plugins: [
        new webpack.ProvidePlugin({
            'window.Quill': 'quill/dist/quill.js',
            'Quill': 'quill/dist/quill.js'
        })
    ]
},
pwa: { iconPaths: { favicon32: 'logo.png', favicon16: 'logo.png', appleTouchIcon: 'logo.png', maskIcon: 'logo.png', msTileImage: 'logo.png' } }

}
