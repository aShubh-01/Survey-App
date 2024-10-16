# Querious - Fullstack Google Forms Clone

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Setup](#setup)

## Features

- Create, Update, Delete Surveys, their Questions, Options, Attributes, etc.
- Publish Survey and Accep Responses
- Fill & Submit Surveys
- Analyse the Submission Data for a survey.

## Technologies Used

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
- **Containerization**: Docker

## Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Docker & Docker-Compose](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

### Setup

1. **Clone the repository**

   Open your terminal and run:

   - git clone https://github.com/ashubh-01/Survey-app.git
   - cd Survey-App

2. **Specify the environment variables**

   There are two directories in the project viz :- frontend & backend, add a .env file in each one, then add following variables in respective .env files
   
   Environment variables in frontend dir:-
     1. VITE_BACKEND_URL = http://localhost:3001 (If you want a differenet port, you can specify it in env var or in config.js in /backend directory)
   
   Environment variables in backend dir :-
     1. DATABASE_URL = "your_postgreSQL_datbase_url" (Get your own postgreSQL service on Aiven :- [Aiven](https://aiven.io/postgresql))
     2. JWT_SECRET_KEY = "your_secret_key"
     3. EMAIL_USER = "your_email_address_to_send_verification_codes_from"
     4. EMAIL_PASSWORD = "your_google_app_password" (Guide on how to get your app password :- [Google App Password](https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237))

3. **Run the project**

   To the run project, you can follow two approaches.
   
   1. Run locally by running some commands in each directory
      1. /frontend
         - npm install
         - npm run dev
      2. /backend
         - npm install
         - npm run dev
      3. /backend/database
         - npx prisma migrate --name "Bootstrap Schema" (Run this only once when you start your project for the very first time)
         - npx prisma generate
     
   2. Run in an containerised environment
      - docker-compose up --build
      - docker exec -it backend_container /bin/sh (Run this set of command only once)
         - cd database
         - npx prisma migrate dev --name "Bootstrap Schema"
         - npx prisma generate
      
      
      
   
