
# CRUD Platform - NPM Library and Todo Web App

This repository contains an NPM library (crublibrarydhruv) that interacts with a CRUD platform, and a Todo Web App frontend that uses this library.


## Features

### 1. NPM Library - crublibrarydhruv
A publicly available NPM package that interacts with the CRUD platform’s API using simple one-liner methods.

## Installation


```bash
npm install crublibrarydhruv

```

## Environment Variables:

- CRUD_API_URL=http://your-api-url.com

- CRUD_API_KEY=your-unique-api-key

### Methods:

- create(): Create a new item.

- get(): Get an item by its ID.

- update(): Update an item by ID.

- delete(): Delete an item by ID.

## 2. Todo Web App (Web App #2)
A simple hosted Todo frontend app that allows users to interact with the CRUD platform through the crublibrarydhruv package

- API Configuration: In the .env file of the frontend, you need to configure the following environment variables:


```bash
    CRUD_API_URL=http://your-api-url.com

    CRUD_API_KEY=your-unique-api-key

```

- Functionality: Users can create, update, delete, and view todos using the crublibrarydhruv methods. When the request limit is reached (4 requests), a UI notification prompts the user to recharge by sending an email to the support addres

## Frontend Setup Instructions

- Clone the frontend repository:
```bash
   git clone https://github.com/yourusername/your-frontend-repo.git
   cd your-frontend-repo
```

- Install dependencies:

- Clone the frontend repository:
```bash
   npm install
```

- Create a .env file in the root of the frontend project and add the following:

```bash
  CRUD_API_URL=http://your-api-url.com
  CRUD_API_KEY=your-unique-api-key
```

- Start the Frontend App

```bash
  npm run dev
```











