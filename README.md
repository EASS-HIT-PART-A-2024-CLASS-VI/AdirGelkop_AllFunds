# AdirGelkop_AllFunds

**Study Funds Tracker**

**Overview**
This project is a full-stack application that scrapes, processes, and displays investment fund data from the website mygemel.net.
The backend uses FastAPI for serving scraped data as a RESTful API, while the frontend is built with React for an interactive user interface.

**Table of Contents**
1. Technologies Used
2. Project Features
3. Project Structure
4. Endpoints (Backend)
5. How to Run the Project
6. Future Work

**Technologies Used**
- Backend:
Python 3.9+
FastAPI – A modern and fast web framework.
BeautifulSoup – HTML parsing and web scraping.
Requests – HTTP requests to external websites.
CORS Middleware – Allows frontend-backend communication.
- Frontend:
React – Component-based UI framework.
Axios – HTTP client for API calls.
- Containerization:
Docker – Backend and frontend are containerized for easy deployment.
Docker Compose – Simplifies multi-container management.

**Project Features**
Backend:
- Scraping Real-Time Data
- RESTful API Endpoints
- Dynamic Month Calculation
Frontend:
- Landing Page
- Search Functionality
- Investment Plan Filtering
- Navigation

**Project Structure**
Directory Layout:
AdirGelkop_AllFunds/
├── backend/
│   ├── main.py          # FastAPI backend with scraping logic and endpoints
│   ├── requirements.txt # Python dependencies
│   └── Dockerfile       # Backend container configuration
│
├── frontend/
│   ├── src/
│   │   ├── App.js       # React frontend logic and components
│   │   └── index.js     # React entry point
│   ├── package.json     # React project dependencies
│   └── Dockerfile       # Frontend container configuration
│
├── docker-compose.yml   # Multi-container management
└── README.md            # Project documentation

**Endpoints (Backend)**
1. GET /funds/
Description: Returns a list of all scraped funds.
2. GET /funds/plan/{plan_name}
Description: Returns a list of funds belonging to the specified investment plan.

**How to Run the Project**
Prerequisites:
- Docker and Docker Compose installed.

Step 1: Clone the Repository
git clone https://github.com/your-repo-link.git
cd AdirGelkop_AllFunds

Step 2: Build and Run Containers
docker-compose up --build

- The backend will be available at: http://localhost:8000
- The frontend will be available at: http://localhost:3000

Step 3: Use the Application
- Open http://localhost:3000 in your browser.
- Use the search bar to filter funds by name.
- Click "View Plan" to view all funds belonging to a specific investment plan.
- Use the "Back to All Funds" button to reset the view.

**Future Work**
PLENTY

**Contact Info**
Project Author: Adir Gelkop
Email: adirgelkop@gmail.com
GitHub: https://github.com/AdirGelkop
