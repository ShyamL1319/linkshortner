# GCP Auto-Deployment Integration via GitHub Actions

This document provides a detailed, step-by-step guide to integrating auto-deployment with Google Cloud Platform (GCP) using **Google Cloud Run** (which provides a generous perpetual free tier) and GitHub Actions.

## Phase 1: GCP Setup & Prerequisites

### Step 1: Create a GCP Project and Enable APIs
1. Log in to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one. Note your **Project ID**.
3. Navigate to **APIs & Services > Library** and enable the following APIs:
   - **Cloud Run API**
   - **Artifact Registry API**
   - **IAM Service Account Credentials API**
   - **Cloud Resource Manager API**

### Step 2: Set Up Artifact Registry
Cloud Run requires a container image. Artifact Registry will store your Docker images securely.
1. Go to **Artifact Registry** in the GCP Console.
2. Click **+ CREATE REPOSITORY**.
3. Name the repository (e.g., `linkshortener-repo`).
4. Set the Format to **Docker**.
5. Choose a region (e.g., `us-central1`). 
6. Click **Create**.

### Step 3: Create a Service Account
1. Go to **IAM & Admin > Service Accounts**.
2. Click **+ CREATE SERVICE ACCOUNT**.
3. Name it (e.g., `github-actions-sa`) and click **Create and Continue**.
4. Grant the following roles:
   - **Cloud Run Admin** (to deploy services)
   - **Artifact Registry Writer** (to push Docker images)
   - **Service Account User** (to act as the compute service account)
5. Click **Done**. Note the email address of this service account.

### Step 4: Configure Workload Identity Federation (WIF)
WIF allows GitHub Actions to securely authenticate to GCP without exporting long-lived JSON keys.
1. Open the Cloud Shell in GCP.
2. Create a Workload Identity Pool:
   ```bash
   gcloud iam workload-identity-pools create "github-actions-pool" \
     --project="YOUR_PROJECT_ID" \
     --location="global" \
     --display-name="GitHub Actions Pool"
   ```
3. Create a Workload Identity Provider in that pool:
   ```bash
   gcloud iam workload-identity-pools providers create-oidc "github-provider" \
     --project="YOUR_PROJECT_ID" \
     --location="global" \
     --workload-identity-pool="github-actions-pool" \
     --display-name="GitHub Provider" \
     --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
     --issuer-uri="https://token.actions.githubusercontent.com"
   ```
4. Bind the Service Account to the Pool (replace placeholders with your actual values):
   ```bash
   gcloud iam service-accounts add-iam-policy-binding "github-actions-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --project="YOUR_PROJECT_ID" \
     --role="roles/iam.workloadIdentityUser" \
     --member="principalSet://iam.googleapis.com/projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository/YOUR_GITHUB_ORG/YOUR_REPO_NAME"
   ```
5. Get the Workload Identity Provider resource name:
   ```bash
   gcloud iam workload-identity-pools providers describe "github-provider" \
     --project="YOUR_PROJECT_ID" \
     --location="global" \
     --workload-identity-pool="github-actions-pool" \
     --format="value(name)"
   ```
   *Save this string; it looks like: `projects/123456789/locations/global/workloadIdentityPools/github-actions-pool/providers/github-provider`.*

## Phase 2: GitHub Repository Setup

### Step 5: Configure GitHub Secrets
1. Go to your GitHub repository.
2. Navigate to **Settings > Secrets and variables > Actions**.
3. Add the following **Repository Secrets**:
   - `GCP_PROJECT_ID`: Your GCP Project ID.
   - `GCP_SERVICE_ACCOUNT`: The email of the service account created in Step 3.
   - `GCP_WIF_PROVIDER`: The resource name string retrieved at the end of Step 4.

## Phase 3: Application Preparation

### Step 6: Dockerize the Application
Cloud Run deploys containerized applications.
1. Ensure a `Dockerfile` exists in the root of your repository.
2. If using Next.js, ensure `output: 'standalone'` is set in your `next.config.mjs` to drastically reduce the container image size.