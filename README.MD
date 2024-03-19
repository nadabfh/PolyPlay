# PolyRate

## Introduction

PolyRate is an interactive web application designed for providing ratings and feedback on lab partners. It serves as a practical tool to simulate a rating and feedback system for lab partners within various student communities worldwide. The application is built using Node.js and Express, focusing on HTTP communication principles to offer a dynamic server-side experience.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)

## Features

- User feedback submission: Allows users to submit comments and ratings for their lab partners.
- Partner management: Enables the addition of new partners for evaluation.
- Logging system: Implements a basic logging system to record all server access.
- Data persistence: Utilizes JSON files (`logs.json`, `partners.json`, and `reviews.json`) for data storage, familiarizing users with file system access via the `fs` module.

## Installation

To install necessary dependencies, navigate to both the `site-web` and `server` directories and run: **npm ci**

This installs all the libraries defined in `package.json` with the exact versions specified in `package-lock.json`.

## Usage

### Deploying Locally

- For the static web server, run `npm start` in the `site-web` directory. Access the site at `localhost:3000` or `<your-IP-address>:3000`.
- For the dynamic Node.js server, run `npm start` in the `server` directory. The server will be accessible at `localhost:5020` or `<your-IP-address>:5020`.

## File Structure

- `data/`: Contains `partners.json` and `reviews.json` for data structure examples.
- `server/`: Holds the server application, including `server.js`, and route handlers.
- `site-web/`: Contains the static website files and scripts for client-side operations.

## Dependencies

- Node.js and Express for server-side logic.
- `fs` module for file system operations.

## Configuration

Before running the application, ensure that the `server` and `site-web` directories are properly set up according to the installation instructions.
