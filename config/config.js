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

module.exports = {
    development: {
        db: 'mongodb://localhost/brutus',
        root: rootPath,
        notifier: notifier,
        app: {
            name: 'Nodejs Express Mongoose Demo'
        }
    },
    test: {
        db: 'mongodb://localhost/brutus_test',
        root: rootPath,
        notifier: notifier,
        app: {
            name: 'Nodejs Express Mongoose Demo'
        }
    },
    production:{}
}