# Testing and Reporting Instructions

This document provides instructions for testing the application, running test cases, and generating reports.

## Table of Contents

- Essential Requirements
- Running Test Cases
    - Jest Tests
    - BDD Tests
- Generating Reports
    - Jest Coverage Report
    - CodeQL Report
- Deployment

## Essential Requirements

* **Node.js and npm:** Ensure Node.js and npm are installed. Verify by running `node -v` and `npm -v` in your terminal.

* **Project Dependencies:**
    - Navigate to the `server` directory: `cd server`
    - Run: `npm install`
    - Navigate to the `client` directory: `cd client`
    - Run: `npm install`

* **CodeQL CLI:** Download the CodeQL CLI from https://github.com/github/codeql-action/releases and extract it to the project root.

* **Environment Variables:**
    - Create a `.env` file in the `server` directory.
    - Generate a secret key: `node -e console.log(require('crypto').randomBytes(64).toString('hex'))`
    - Add to `.env`: `SECRET_KEY=<your_generated_key>`


## Running Test Cases

* **Jest Tests:**
    - Navigate to the `server` directory: `cd server`
    - Run: `npx jest --runInBand tests/`

* **BDD Tests:**
    - Start the application (both server and client using `npm start`).
    - In a new terminal, navigate to `client` and run: `npx cypress open`

    **Note:** To run `rateLimiter.feature`:
    1. In `server/server.ts`, change line 72 to `5`.
    2. Restart the server.
    3. Run the `rateLimiter.feature` file in Cypress.

## Generating Reports

* **Jest Coverage Report:**
    - Navigate to the `server` directory: `cd server`
    - Run: `npx jest --collectCoverage tests/`
    - A document explaining test coverage exclusions is available [here]. (Replace "[here]" with the actual link)

* **CodeQL Report:**
    - Create a `codeql-dbs` directory in the project root.
    - Generate a CodeQL database: `codeql/codeql database create codeql-dbs/final-project-shrusti-nihar-db --language=typescript -s server`
    - Analyze the database: `codeql/codeql database analyze codeql-dbs/final-project-shrusti-nihar-db --format=sarifv2.1.0 -o results.sarif --rerun`
    - View the `results.sarif` report using an online SARIF viewer.

## Deployment

The link to Render is: https://final-project-render-shrushti-nihar.onrender.com 
