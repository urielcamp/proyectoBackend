import dotenv from 'dotenv'
dotenv.config()

export default{
    mongo: {
        uri: process.env.MONGO_URI,
        dbname: process.env.MONGO_DB_NAME,
        url: process.env.MONGO_URL
    },
    github: {
        id: process.env.CLIENT_ID_GITHUB,
        secret: process.env.CLIENT_SECRET_GITHUB,
        url: process.env.CALLBACK_URL_GITHUB
    },
    admin: {
        email: process.env.EMAIL_ADMIN,
        pass: process.env.PASSWORD_ADMIN
    }
}