var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];



module.exports = {
    variants: {
        course: {
            resize: {
                original: "100%",
                detail: "800x600"
            },
            crop: {
                thumb: "200x200"
            },
            resizeAndCrop: {
                mini: {resize: "200x150", crop: "100x100"}
            }
        },
        nodo: {
            resize: {
                original: "100%",
                detail: "800x600"
            },
            crop: {
                thumb: "200x200"
            },
            resizeAndCrop: {
                mini: {resize: "200x150", crop: "100x100"}
            }
        },

        gallery: {
            crop: {
                thumb: "100x100"
            }
        }
    },

    storage: {
        Local: {
            path: config.tempDirectory,
            mode: 0777
        },
//        ,
//        Rackspace: {
//            auth: {
//                username: "USERNAME",
//                apiKey: "API_KEY",
//                host: "lon.auth.api.rackspacecloud.com"
//            },
//            container: "CONTAINER_NAME"
//        },
//        S3: {
//            key: 'API_KEY',
//            secret: 'SECRET',
//            bucket: 'BUCKET_NAME',
//            region: 'REGION'
//        }
        uploadDirectory: config.tempDirectory+config.uploadImagesDirectory
    },

    debug: true
}
