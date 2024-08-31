const gcpMetadata = require("gcp-metadata");

const variableName = "FIREBASE_CONFIG";

const getProjectId = async () => {
  // check to see if this code can access a metadata server
  const isAvailable = await gcpMetadata.isAvailable();

  if (isAvailable) {
    const projectId = await gcpMetadata.project("project-id");
    return projectId;
  }

  return null;
};

getProjectId().then((currentProjectId) => {
  // Original environment variable as a string
  let envVar = process.env[variableName];

  // Convert the object back to a string
  updatedEnvVar = envVar.replace(
    "}",
    `,storageBucket:${currentProjectId}.appspot.com`
  );

  console.log(updatedEnvVar)
//   console.log(
//     `Environment variable ${variableName} exists with value: ${updatedEnvVar}`
//   );
  return updatedEnvVar;
});