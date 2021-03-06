var path = require('path');
module.exports = {
    entry: ['./js/entry.js'],//定义要引入的js文件
    output: {
        path: __dirname,
        filename: './js/bundle.js' //定义要输出的js文件
    },
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015','react']
            }
        }, {
            test: /\.css$/,
            loader: 'style!css'
        }, {
           test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
           loader: 'url-loader?name=[path][name].[ext]'
         }]
    }
};
