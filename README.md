# customer-admin-webapp

## Branches and target deployments

### Main Branch
Linked to the **PROD** environment currently hosted in Firebase 

- Service: [App Hosting](https://console.firebase.google.com/u/0/project/swifti-prod/apphosting/backends/projects~2Fswifti-prod~2Flocations~2Fus-central1~2Fbackends~2Fadmin-webapp-prod)

- Domain: [admin.swifti.com](https://admin.swifti.com)

Anything merged to Main branch will trigger the deployment to Prod automatically.

### Release Branch
Linked to the staging environment currently hosted in Firebase 

- Service: [App Hosting](https://console.firebase.google.com/u/0/project/homebite-practice-v2/apphosting/backends/projects~2Fhomebite-practice-v2~2Flocations~2Fus-central1~2Fbackends~2Fadmin-webapp-staging)

- Domain: [dev.admin.swifti.com](https://dev.admin.swifti.com)

Anything merged to Release branch will trigger the deployment to Staging automatically.

## Branching Strategy
1. New feature branches created off the `relase` branch.
2. Test locally using `npm dev`
3. PR created against `release`
4. Review and merge
5. Wait for deployment to complete sucessfully.
6. Test changes in staging environment
7. Create PR to merge `release` -> `main`
8. Review and merge
9. Confirm deployment completed successfully
10. Check changes in `Prod`