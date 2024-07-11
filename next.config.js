const path = require("path");
const dotenv = require('dotenv');


// Get the current branch name
const branch = require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString().trim();

// Map branches to environment files
const envFileMap = {
  main: '.env.production',
  release: '.env.staging',
};

const envFile = envFileMap[branch] || '.env.staging';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/business-login",
        permanent: true,
      },
    ];
  },
  env: {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  },
};

module.exports = nextConfig;
