# Back-end Server for Efrei Movie

This is the back-end server for the Efrei Movie project, built using NestJS and MySQL.

## Introduction

This is a NestJS server used for managing movie data. It provides a RESTful API and uses MySQL as the database.

##  Installation
1. Clone the repository:
    git clone https://github.com/EliseLabarrere/efrei-movie.git
    cd efrei-movie/back

2. Install the dependencies:
    npm install

## Running the Server
1. Create a .env file in the back directory and add your environment variables:

    PORT=3000
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
    DATABASE_USER=root
    DATABASE_PASSWORD=yourpassword
    DATABASE_NAME=efrei_movie


2. Start the server:

    npm run start

The server will run on http://localhost:3000.
Swagger documentation will be available at http://localhost:3000/api.

## Connecting to the MySQL Database

Make sure your MySQL server is running and the credentials in the .env file match your MySQL configuration.