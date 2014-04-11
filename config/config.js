/**
 * Created by wcweb on 7/3/14.
 */

var path = require('path')
    , rootPath = path.normalize(__dirname + '/..')
    , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
    , notifier = {
        service: 'postmark',
        APN: false,
        email: false, // true
        actions: ['comment'],
        tplPath: templatePath,
        key: 'POSTMARK_KEY',
        parseAppId: 'PARSE_APP_ID',
        parseApiKey: 'PARSE_MASTER_KEY'
    }
    , app_static = {
        name: 'Chishiki ',
        title: 'Chishiki App'
    }

module.exports = {
    development: {
        db: 'mongodb://localhost/Chishiki_dev',
        root: rootPath,
        notifier: notifier,
        socketEnable: true,
        app: app_static
    },
    test: {
        db: 'mongodb://localhost/Chishiki_test',
        root: rootPath,
        notifier: notifier,
        socketEnable: true,
        app: app_static
    },
    production:{
        db: 'mongodb://localhost/Chishiki_pro',
        root: rootPath,
        notifier: notifier,
        socketEnable: true,
        app: app_static

    }
}
