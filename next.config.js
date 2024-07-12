const path = require("path");
const { execSync } = require('child_process');



// Run the custom script to prepare the environment
execSync('node prepare-env.js', { stdio: 'inherit' });

// Load the temporary environment file
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.temp') });

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
