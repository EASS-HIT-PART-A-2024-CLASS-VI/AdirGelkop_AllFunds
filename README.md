# AdirGelkop_AllFunds

**Study Funds Tracker**

## **Overview**
This project is a full-stack application that scrapes, processes, and displays investment fund data from the website **mygemel.net**.  
The backend uses **FastAPI** for serving scraped data as a RESTful API, while the frontend is built with **React** for an interactive user interface. Both components are containerized with **Docker**.

## **Table of Contents**
1. [Technologies Used](#technologies-used)
2. [Project Features](#project-features)
3. [Project Structure](#project-structure)
4. [Endpoints (Backend)](#endpoints-backend)
5. [How to Run the Project](#how-to-run-the-project)
6. [Future Work](#future-work)
7. [Contact Info](#contact-info)

## **Technologies Used**

### **Backend:**
- **Python 3.9+**
- **FastAPI** – A modern and fast web framework for building APIs.
- **BeautifulSoup** – For HTML parsing and web scraping.
- **Requests** – To handle HTTP requests.
- **CORS Middleware** – To allow frontend-backend communication.

### **Frontend:**
- **React** – A component-based UI framework.
- **Axios** – HTTP client for API calls.

### **Containerization:**
- **Docker** – Backend and frontend are fully containerized for simplified deployment.
- **Docker Compose** – Orchestrates multi-container services.


## **Project Features**

### **Backend:**
- Real-time scraping from **mygemel.net**.
- Exposes a RESTful API to serve scraped data.
- Dynamic calculation of the current month for performance data.
### **Frontend:**
- Displays investment funds in a clean, user-friendly table.
- **Search functionality:** Allows users to search for funds by name.
- **Dynamic filtering:** 
  - By **investment company name**.
  - By **investment type**.
- **Navigation:**
  - Buttons for viewing individual plans.
  - Reset view functionality.


## **Project Structure**

```plaintext
AdirGelkop_AllFunds/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI backend with scraping logic and endpoints
│   │   └── routes.py        # Modular API routes
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container configuration
│
├── frontend/
│   ├── public/
│   │   └── index.html       # React root HTML file
│   ├── src/
│   │   ├── services/
│   │   │   └── backend.js   # Handles API requests
│   │   ├── App.js           # Main React component
│   │   └── index.js         # React entry point
│   ├── package.json         # React project dependencies
│   ├── package-lock.json    # Dependency tree lock
│   └── Dockerfile           # Frontend container configuration
│
├── docker-compose.yml       # Multi-container management
└── README.md                # Project documentation

**Endpoints (Backend)**
1. GET /funds/
Description: Returns a list of all scraped funds.
2. GET /funds/{index}
Description: Fetches the details of a specific fund by its ID.
2. GET /funds/plan/{plan_name}
Description: Returns a list of funds belonging to the specified investment plan.

**How to Run the Project**
Prerequisites:
- Docker and Docker Compose installed.

Step 1: Clone the Repository
git clone https://github.com/your-repo-link.git
cd AdirGelkop_AllFunds

Step 2: Build and Run Containers
docker compose up --build

- The backend will be available at: http://localhost:8000
- The frontend will be available at: http://localhost:3000

Step 3: Use the Application
- Open http://localhost:3000 in your browser.
- Search Funds: Use the search bar to filter by fund name.
- View Fund Details: Click "View Fund" to display detailed information about a specific fund.
- Reset View: Use the "Back to All Funds" button to return to the full list.


**Future Work**
PLENTY

**Contact Info**
Project Author: Adir Gelkop
Email: adirgelkop@gmail.com
GitHub: https://github.com/AdirGelkop
