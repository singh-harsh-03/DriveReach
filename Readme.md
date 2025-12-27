# DriveReach

DriveReach is a full-stack ride-hailing web application that connects car owners with nearby verified drivers in real time. It features map-based tracking, driver discovery, and planned integrations for SMS-based offline booking and payments.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Getting Started (Development)](#getting-started-development)
- [Running the Project](#running-the-project)

## Overview

DriveReach demonstrates a modular architecture using a React frontend and a Node.js/Express backend. It combines a centralized database (MongoDB) for persistence and a decentralized layer (GunDB) planned for real-time location sync.

## Features

- Real-time driver location display (map integration)
- Role-based UI for Car Owners and Drivers
- Signup / Login flows for users and drivers
- Server APIs for CRUD operations (users, drivers, bookings)
- Socket.io support for real-time updates
- Planned: SMS offline booking (Twilio), payment integration, driver license verification, and pathfinding (Dijkstra/A*)

## Architecture & Tech Stack

- Frontend: React, TailwindCSS, Google Maps / Leaflet, Axios, socket.io-client
- Backend: Node.js, Express, Socket.io
- Databases: MongoDB (persistent), GunDB (real-time / P2P)
- External services: Twilio (SMS), Razorpay/Stripe (payments, optional)

## Getting Started (Development)

Prerequisites

- Node.js (>= 18 recommended)
- npm or yarn

Install dependencies for backend and frontend:

```bash
# from repo root
cd Backend
npm install

# in a new terminal: frontend
cd ../Front_end
npm install
```

Environment

- Create a `.env` in `Backend/` with values for your MongoDB connection, JWT secret (if used), Twilio keys, etc. Example keys your app may expect:

- MONGO_URI
- JWT_SECRET
- TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE

Check `Backend/` and `Front_end/` package.json scripts for exact run commands.

## Running the Project

Start the backend server:

```bash
cd Backend
npm run start    # or `npm run dev` if there is a dev script
```

Start the frontend dev server:

```bash
cd Front_end
npm run dev
```

Open the frontend in your browser (usually http://localhost:5173 or the URL shown by Vite).
