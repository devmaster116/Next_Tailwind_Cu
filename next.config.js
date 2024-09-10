const path = require("path");
const { execSync } = require("child_process");

// Define the environment variable name you want to check
const variableName = "FIREBASE_CONFIG";

let projectId;
let localFirebaseConfig;
let updatedEnvVar;

// Check if the environment variable exists. Only in CI exists
if (process.env[variableName]) {
  // Get the update FIREBASE_CONFIG variable that includes the storageBucket
  updatedEnvVar = execSync("node get-projectId.js", { encoding: "utf-8" });
} else {
  console.log(`Environment variable ${variableName} does not exist.`);
  // Run the custom script to prepare the environment
  execSync("node prepare-env.js", { stdio: "inherit" });

  // Load the temporary environment file
  require("dotenv").config({ path: path.resolve(process.cwd(), ".env.temp") });

  projectId = process.env.projectId;

  localFirebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  };
}

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
    CI_FIREBASE_CONFIG: updatedEnvVar,
    LOCAL_FIREBASE_CONFIG: localFirebaseConfig,
    ENVIRONMENT: process.env.ENVIRONMENT,
  },
};

module.exports = nextConfig;
