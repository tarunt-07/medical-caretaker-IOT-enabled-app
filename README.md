# PranTar.io

PranTar.io is a medical caretaker and IoT-enabled medicine management app built to help doctors, caretakers, and patients coordinate daily care more clearly.

It includes:
- role-based dashboards for doctor, caretaker, and patient views
- medicine schedule and monitoring flows
- reports, appointments, records, devices, and notifications pages
- a messenger-style care team chat
- IoT/dispenser-related server and hardware starter files

## Project Structure

- `client/` - React + Vite frontend
- `server/` - Express backend APIs and app logic
- `database/` - schema, seed, and policy SQL files
- `hardware/` - Arduino and Raspberry Pi integration starters
- `docs/` - UI, API, and deployment notes

## Tech Stack

- React 19
- Vite
- React Router
- Chart.js
- Express
- Socket.IO
- JSON server

## Local Setup

### 1. Install dependencies

From the project root:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Run the frontend

```bash
cd client
npm run dev
```

### 3. Run the backend

```bash
cd server
npm run dev
```

## Main Frontend Scripts

Inside `client/`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Main Backend Scripts

Inside `server/`:

```bash
npm run dev
npm start
```

## Current Product Areas

- landing, login, and signup flow
- role-based dashboard screens
- appointments and reports pages
- medicine schedule management
- patient medical record views
- profile and account pages
- care team chat with edit/delete support for sent messages
- branded loading screen and custom logo treatment

## Repository

GitHub:

`https://github.com/tarunt-07/medical-caretaker-IOT-enabled-app`

