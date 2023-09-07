const Encore = require('@symfony/webpack-encore');

const WebpackBar = require('webpackbar');
const MediaQueryPlugin = require('@glitchr/media-query-plugin');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore.addPlugin(new WebpackBar())

    .setOutputPath('./src/Resources/public/')
    .setPublicPath('/bundles/base')
    .setManifestKeyPrefix('.')

    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())

    .copyFiles({from: './node_modules/@fortawesome/fontawesome-free/metadata/', pattern: /icons.yml$/, to: 'metadata/[name].[ext]'})
    .copyFiles({from: './node_modules/@fortawesome/fontawesome-free/webfonts/', to: 'fonts/[name].[hash].[ext]'})

    .copyFiles({from: './node_modules/bootstrap-icons/font/fonts', to: 'fonts/[name].[ext]'})
    .copyFiles({from: './node_modules/@fortawesome/fontawesome-free/webfonts/', to: 'fonts/[name].[hash].[ext]'})
    .copyFiles({from: './node_modules/country-flag-icons/3x2/', to: 'images/flags/[path][name].[ext]', pattern: /\.svg$/})

    .copyFiles({from: './assets/styles/images/flags/', to: 'images/flags/[path][name].[ext]', pattern: /\.svg$/})
    .copyFiles({from: './assets/styles/fonts', to: 'fonts/[path][name].[ext]'})
    .copyFiles({from: './assets/styles/images/bundles/', to: 'images/bundles/[path][name].[ext]'})
    .copyFiles({from: './assets/styles/images/', to: 'images/[path][name].[ext]', pattern: /\.(svg|webp|jpg|png|gif)$/})

    .disableSingleRuntimeChunk()

    // enables and configure @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })

    // uncomment if you're having problems with a jQuery plugin
    .autoProvidejQuery()

    .addEntry('base-async', './assets/base-async.js')
    .addEntry('base-defer', './assets/base-defer.js')
    .addEntry('easyadmin-async', './assets/easyadmin-async.js')

    .addEntry('form-defer', './assets/form-defer.js')
    .addEntry('form-defer.editor', './assets/form-defer.editor.js')
    .addEntry('form-defer.array', './assets/form-defer.array.js')
    .addEntry('form-defer.datetime', './assets/form-defer.datetime.js')
    .addEntry('form-defer.select2', './assets/form-defer.select2.js')
    .addEntry('form-defer.color', './assets/form-defer.color.js')
    .addEntry('form-defer.wysiwyg', './assets/form-defer.wysiwyg.js')
    .addEntry('form-defer.cropper', './assets/form-defer.cropper.js')
    .addEntry('form-defer.emoji', './assets/form-defer.emoji.js')
    .addEntry('form-defer.dropzone', './assets/form-defer.dropzone.js')

    .enableSassLoader()
    .enablePostCssLoader()

    .addLoader({
        test: /\.scss$/,
        use: [
            MediaQueryPlugin.loader,
            'postcss-loader'
        ]
    })

    .addPlugin(new MediaQueryPlugin({
        include: ["base-async", "easyadmin-async", "form-defer"],
        queries: {

          // Standard
          'all and (min-width: 1281px)': 'desktop',
          'all and (min-width: 1025px) and (max-width: 1280px)': 'laptop',
          'all and (min-width: 471px) and (max-width: 1024px)': 'tablet',
          'all and (min-width: 471px) and (max-width: 1024px) and (orientation: landscape)': 'tablet-landscape',
          'all and (max-width: 470px)': 'mobile',
          'all and (max-width: 470px) and (orientation: landscape)': 'mobile-landscape'
        }
    }))
;

module.exports = Encore.getWebpackConfig();
module.exports.watchOptions = { };
module.exports.snapshot = { managedPaths: [/^(.+?[\\/]node_modules)[\\/]((?!.*)).*[\\/]*/] };