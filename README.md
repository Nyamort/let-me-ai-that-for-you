# Let me AI that for you

**Let me AI that for you** is a **prompt enhancer** designed to help users improve and refine their prompts for various AI models, ensuring better and more accurate responses.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Nyamort/let-me-ai-that-for-you.git
    cd let-me-ai-that-for-you
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Copy `.env.example` to `.env.local`
    - Fill in the required environment variables (see Environment Variables section below)

## Getting Started

First, run the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Gemini Integration

To integrate Google Gemini, follow these steps to obtain your API key and configure the necessary environment variables:

1. **Go to Google AI Studio**: Visit the [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key?hl=en) website.
2. **Sign in with your Google Account**: Log in using your Google account credentials.
3. **Create an API Key**: 
    - Look for and click the "Create API Key" button.
    - Follow the instructions to generate your key. This typically involves selecting or creating a project, then generating the key within that project's settings.
4. **Obtain your GEMINI_API_KEY**: After generating the API key, copy the key.

5. **Set the Environment Variables**:
    - In your `.env.local` file, add the following variable:
      ```env
      GEMINI_API_KEY=<your_gemini_api_key>
      ```

## Github OAuth Setup

To authenticate users via GitHub, follow these steps to register an OAuth application and obtain the necessary credentials:

1. **Go to GitHub**: Visit the [Register a new OAuth app](https://github.com/settings/applications/new) page.
2. **Fill out the OAuth App Form**:
    - **Application name**: Let me AI that for you
    - **Homepage URL**: http://localhost:3000
    - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
3. **Register the Application**: Click **Register Application** to create the OAuth app.
4. **Obtain the Credentials**:
    - Copy the **Client ID** and **Client Secret** from the application settings.
    - Click on **Generate a new client secret** if a new secret is needed.

5. **Set the Environment Variables**:
    - In your `.env.local` file, add the following variables:
      ```env
      AUTH_GITHUB_ID=<your_github_client_id>
      AUTH_GITHUB_SECRET=<your_github_client_secret>
      ```

## Influx (Not necessary, only for send web vital data)

To create a bucket in InfluxDB and obtain the necessary credentials, follow these steps:

1. **Create an InfluxDB Account**: Visit the [InfluxDB Cloud](https://cloud.influxdata.com/) website and sign up for an account or log in if you already have one.

2. **Create a Bucket**:
    - Once logged in, navigate to the **Buckets** section of your InfluxDB Cloud console.
    - Click on **Create Bucket**.
    - Enter a name for your bucket, then click on **Create**.

3. **Obtain the Required Credentials**:
    - **INFLUXDB_URL**: The URL of your InfluxDB instance (e.g., `https://us-west-2-1.aws.cloud2.influxdata.com`).
    - **INFLUXDB_TOKEN**: In the InfluxDB UI, go to **Data > Tokens**, then create a new token with the appropriate permissions and copy the token.
    - **INFLUXDB_ORG**: In the InfluxDB UI, navigate to **Settings > Organization**, and copy your organization name.
    - **INFLUXDB_BUCKET**: Copy the name of the bucket you created earlier.

4. **Set the Environment Variables**:
    - In your `.env.local` file, add the following variables with the corresponding values:
      ```env
      INFLUXDB_URL=<your_influxdb_url>
      INFLUXDB_TOKEN=<your_influxdb_token>
      INFLUXDB_ORG=<your_influxdb_org>
      INFLUXDB_BUCKET=<your_influxdb_bucket>
      ```

## Firebase Setup

To integrate Firebase into your project, follow these steps to obtain the required credentials:

1. **Create a Firebase Project**: 
    - Go to the [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
    - Create a new project or select an existing one.

2. **Generate a Firebase Service Account Private Key**:
    - In the Firebase Console, go to **Project Settings > Service Accounts**.
    - Click **Generate New Private Key** and download the JSON file.

3. **Obtain the Required Firebase Credentials**:
    - From the downloaded service account JSON file, extract the following values:
      - **FIREBASE_PRIVATE_KEY**: Find the `private_key` field in the JSON file.
      - **FIREBASE_CLIENT_EMAIL**: Find the `client_email` field in the JSON file.
      - **FIREBASE_PROJECT_ID**: Find the `project_id` field in the JSON file.

4. **Set the Environment Variables**:
    - In your `.env.local` file, add the following variables with the corresponding values:
      ```env
      FIREBASE_PRIVATE_KEY=<your_firebase_private_key>
      FIREBASE_CLIENT_EMAIL=<your_firebase_client_email>
      FIREBASE_PROJECT_ID=<your_firebase_project_id>
      ```

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.
