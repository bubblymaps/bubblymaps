export default class helpers {

    static async fetchVersion() {
        return {
            version: process.env.APP_VERSION || 'dev',
            api: process.env.API_VERSION || 'dev'
        }
    }

}