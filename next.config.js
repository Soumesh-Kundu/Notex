/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'t4.ftcdn.net'
            }
        ]
    }
}

module.exports = nextConfig
