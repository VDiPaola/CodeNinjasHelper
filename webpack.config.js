const path = require('path');

module.exports = {
    entry: {
        'content-scripts/dom': './src/content-scripts/dom.js',
        'content-scripts/intellisense': './src/content-scripts/intellisense.js',
        'content-scripts/scene': './src/content-scripts/scenePage.js',

        'background': './src/background-scripts/main.js',

        'options-page/main': './src/options-page/main.js',
        
        
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'production',
};