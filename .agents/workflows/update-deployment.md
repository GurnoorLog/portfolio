---
description: How to update the Let's Cook deployment on Cloud Run
---

To update your deployment with the latest local changes, you have two main options:

### Option 1: Using the `gcloud` CLI (Recommended)

This is the fastest way if you have the Google Cloud SDK installed.

1.  Open your terminal in the project directory (`c:\Users\tambe\Desktop\let'scook`).
2.  Run the following command:
    ```powershell
    gcloud run deploy lets-cook --source . --region us-west1
    ```
    *Note: Replace `lets-cook` with your actual service name if it's different.*

3.  Wait for the build and deployment to complete.

### Option 2: Using the Google Cloud Console (ZIP Upload)

If you prefer using the browser:

1.  Zip your local files (excluding `node_modules` and `dist`).
2.  Go to the [Cloud Run Console](https://console.cloud.google.com/run).
3.  Select your service (`lets-cook`).
4.  Click **EDIT & DEPLOY NEW REVISION**.
5.  In the "Container, Networking, Security" section (or "Deployment" tab depending on UI version), look for the option to upload source code or a zip.
6.  Upload your zip and click **DEPLOY**.

### Option 3: Let Me Try (Authentication Required)

If you can grant me access or run a command to authenticate me, I can attempt to deploy directly using the `mcp_cloudrun_deploy_local_folder` tool. However, based on our previous attempt, I currently lack the necessary credentials.
