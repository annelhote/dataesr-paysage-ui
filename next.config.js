const path = require('path');
const withTM = require('@vercel/edge-functions-ui/transpile')();
const withSass = require('@zeit/next-sass');

module.exports = withSass();
module.exports = withTM();
module.exports = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        secondSecret: process.env.SECOND_SECRET, // Pass through env variables
        dataesrApiUrl: 'https://api.paysage.staging.dataesr.ovh',
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        basePath: process.env.BASE_PATH,
        baseApiUrl: process.env.API_URL,
    },
    sassOptions: { includePaths: [path.join(__dirname, 'styles')] },
    reactStrictMode: true,
};
