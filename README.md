#  SIEM-Based Real Time API Security Monitoring System for a FinTech Application 
A SIEM-based real-time API monitoring system designed to detect and analyze security threats in fintech applications.

## Overview
This project implements a Security Information and Event Management (SIEM) system for monitoring API security in a fintech application. It logs API activity, detects malicious patterns, and provides real-time monitoring through a dashboard.

## Tech Stack
- Backend: Node.js, Express
- Frontend: React (Vite)
- ML Service: Python
- Database: PostgreSQL (pgAdmin 4 for management)

## Features
- API request logging
- Threat detection (Brute Force, Unauthorized Access, DDos)
- Real-time monitoring dashboard
- Alert generation system

## Current Progress (Mid-Sem)
- Backend APIs implemented
- Logging system completed
- Threat detection (basic) implemented
- Dashboard UI partially completed

## Project Structure

api_security_project/
│── backend/
│── frontend/
│── ml-service/
│── .gitignore
│── README.md

## How to Run the Project
To run the complete system, start all services in the correct order:

### Step 1: Start Database (PostgreSQL)
Ensure PostgreSQL is installed and running.

- Start PostgreSQL service  
- Make sure required database and tables are created  

### Step 2: Start Security Backend (FastAPI)
This service handles logging and threat detection.

cd backend
uvicorn backend.app.main:app --reload

### Step 3: Start Banking Backend (Node.js)
This service handles all banking APIs such as login, balance, and transactions.

cd backend
node server.js

### Step 4: Start Frontend (React)
This launches the user interface and dashboard.

cd frontend
npm install
npm run dev

## Future Scope
- Advanced SIEM correlation rules
- Real-time alert system
- Authentication & role-based access
- Cloud deployment

## Team Members 
- Ishita Bhatt 
- Kaustubh Sharma 
- Ashwini Nagar
