# Cloud Resume Challenge

## Visit [ofsener.com](https://ofsener.com)

## Introduction

**Cloud Resume Challenge** is a hands-on project designed to showcase your cloud skills by building a modern, serverless resume website using AWS services. This project leverages AWS Lambda, API Gateway, DynamoDB, S3, CloudFront, and CloudFormation (via SAM) to create a fully automated, scalable, and secure solution. Whether you're looking to demonstrate your technical expertise or learn cutting-edge cloud deployment techniques, this challenge is a great way to enhance your portfolio.

## Table of Contents

- [Installation Guide](#installation-guide)
- [Usage Instructions](#usage-instructions)
- [Features](#features)
- [Configuration & Customization](#configuration--customization)
- [Contribution Guidelines](#contribution-guidelines)
- [Roadmap](#roadmap)
- [Troubleshooting & FAQs](#troubleshooting--faqs)
- [License](#license)
- [Credits & Acknowledgments](#credits--acknowledgments)
- [Contact Information](#contact-information)

## Installation Guide

### Prerequisites

- **AWS Account**: An active AWS account with the necessary permissions.
- **Git**: Installed on your local machine.
- **AWS CLI & SAM CLI**: Installed and configured.
- **Python 3.9+**: For backend (Lambda) development.
- **Node.js** (optional): For additional tooling if needed.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/cloud-resume-challenge.git
   cd cloud-resume-challenge
   ```

2. **Set Up Environment Variables & GitHub Secrets**

   In your GitHub repository settings, create the following secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `DEPLOYMENT_ARTIFACTS_BUCKET` (a unique S3 bucket for SAM artifacts)
   - `S3_BUCKET_NAME` (for your static website files)
   - `CF_DISTRIBUTION_ID` (CloudFront Distribution ID for your website)
   - `CERTIFICATE_ARN` (ACM certificate ARN in us-east-1)
   - `HOSTED_ZONE_ID` (for your custom domain)

3. **Project Structure**

   ```plaintext
   cloud-resume-challenge/
   ├─ backend/
   │   ├─ lambda_function.py
   │   ├─ requirements.txt
   │   └─ test_lambda_function.py
   ├─ website/
   │   ├─ index.html
   │   └─ (other static assets)
   ├─ iac/
   │   └─ template.yaml         # Backend SAM template
   └─ .github/
       └─ workflows/
           ├─ backend-deploy.yml
           └─ website-deploy.yml
   ```

4. **Deploy the Backend**

   ```bash
   cd iac
   sam package --template-file template.yaml --s3-bucket $DEPLOYMENT_ARTIFACTS_BUCKET --output-template-file packaged.yaml
   sam deploy --template-file packaged.yaml --stack-name cloud-resume-backend-stack --capabilities CAPABILITY_NAMED_IAM --parameter-overrides TableName="ZiyaretciSayaci" AllowedOrigin="https://yourdomain.com"
   ```

   Alternatively, push your changes and let the GitHub Actions workflow (`backend-deploy.yml`) handle the deployment.

5. **Deploy the Website**

   ```bash
   aws s3 sync website/ s3://$S3_BUCKET_NAME --delete
   aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID --paths "/*"
   ```

   Or use the GitHub Actions workflow (`website-deploy.yml`) for automated deployment.

## Usage Instructions

- **Accessing the API**:  
  After a successful backend deployment, retrieve your API endpoint from the CloudFormation stack outputs. For example:
  
  ```bash
  curl https://your-api-id.execute-api.region.amazonaws.com/Prod/visitorcount
  ```

- **Viewing Your Resume Website**:  
  Visit your custom domain or the CloudFront distribution URL to see your resume website.

- **Updating the Website**:  
  Any changes pushed to the `website/` folder will trigger the website deployment workflow, automatically updating your S3 bucket and invalidating the CloudFront cache.

## Features

- **Serverless Architecture**:  
  Leverages AWS Lambda, API Gateway, and DynamoDB for a robust backend.
- **Automated Deployment**:  
  Continuous integration and deployment via GitHub Actions.
- **Infrastructure as Code**:  
  Manage AWS resources with a SAM template.
- **Custom Domain & SSL**:  
  Secure your site with ACM certificates and Route53 integration.
- **Scalability**:  
  Built on AWS’s scalable, pay-as-you-go infrastructure.

## Configuration & Customization

- **Backend**:  
  - Modify `TABLE_NAME` and `ALLOWED_ORIGIN` in the SAM template or during deployment.
  - Update `lambda_function.py` in the `backend/` directory to change API logic.
- **Website**:  
  - Update your static assets in the `website/` folder.
  - Customize CloudFront and S3 settings via the AWS console if needed.
- **Environment Variables**:  
  Use GitHub Secrets and deployment parameters to configure your project securely.

## Contribution Guidelines

Contributions are welcome! Please follow these guidelines:
- **Fork the Repository** and create a feature branch.
- **Coding Standards**: Adhere to PEP8 for Python code.
- **Pull Requests**: Provide clear descriptions and reference related issues.
- **Issue Reporting**: Use GitHub Issues to report bugs or suggest features.
- **Documentation**: Update this README and code comments as needed.

## Roadmap

- **Backend Enhancements**:  
  - Add additional API endpoints for enhanced interactivity.
  - Optimize Lambda performance and integrate monitoring.
- **Frontend Improvements**:  
  - Enhance the UI/UX with dynamic content and responsive design.
- **Security**:  
  - Strengthen authentication and authorization for API endpoints.
- **CI/CD**:  
  - Improve deployment automation and add more comprehensive tests.

## License

This project is licensed under the [MIT License](LICENSE).

