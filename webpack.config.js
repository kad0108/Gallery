var webpack = require('webpack');
 
module.exports = {
    //页面入口文件配置
    entry: {
        index : './js/main.js'
    },
    //入口文件输出配置
    output: {
        path: 'dist/js/',
        filename: 'waterfall.js'
    },
    module: {
        //加载器配置
        loaders: [
        	{test: /\.css$/, exclude: /node_modules/, loader: 'style-loader!css-loader'}
        ]
    },
    //其它解决方案配置
    resolve: {
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['.js', '.json', '.css'],
        //模块别名定义，方便后续直接引用别名
        alias: {
        }
    }
};