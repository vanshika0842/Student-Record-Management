# 🎓 StudentHub — Student Record Management System

A simple, web-based student record management application built with **FastAPI, SQLite, HTML, CSS, and JavaScript**. StudentHub provides an interface for managing student information and demonstrates how a Python backend can interact with a database and a frontend.

## 📌 Overview

StudentHub is designed to make student record management easier through a web interface. It connects a FastAPI backend to an SQLite database, allowing the application to store and manage student data.

The project was developed as an opportunity to practice backend development, REST API design, database operations, and frontend–backend integration.

## ✨ Features

- **Student Record Management** — Manage student information through the web application.
- **FastAPI Backend** — Build and serve backend endpoints using FastAPI.
- **SQLite Database** — Store student records in a lightweight relational database.
- **Web Interface** — Interact with the application through HTML, CSS, and JavaScript.
- **Data Persistence** — Keep records stored in the database between application restarts.
- **API Documentation** — Explore available API endpoints through FastAPI's interactive documentation.

> Update this list to reflect the exact operations implemented in your current version, such as adding, viewing, editing, or deleting student records.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | Web framework and API development |
| SQLite | Database |
| HTML5 | Page structure |
| CSS3 | Styling and layout |
| JavaScript | Frontend interactions |
| Uvicorn | ASGI server |
| Git & GitHub | Version control and source code hosting |

## 📂 Project Structure

```text
Student-Record-Management/
│
├── main.py              # FastAPI application and routes
├── database.py          # Database connection and operations
├── schemas.py           # Request/response validation schemas
├── requirements.txt     # Python dependencies
├── README.md            # Project documentation
│
├── templates/
│   └── index.html       # Main web page
│
├── static/
│   ├── style.css        # Application styles
│   └── app.js           # Frontend JavaScript
│
├── .gitignore           # Files excluded from Git
└── venv/                # Local virtual environment (not committed)
```

*The structure above is illustrative. Adjust filenames and folders to match your actual repository.*

## ⚙️ Getting Started

Follow these steps to run StudentHub locally.

### 1. Prerequisites

Install the following:

- Python 3.10 or newer
- pip
- Git (optional, for cloning the repository)

### 2. Clone the Repository

```bash
git clone https://github.com/vanshika0842/Student-Record-Management.git
cd Student-Record-Management
```

Alternatively, download the repository as a ZIP file and extract it.

### 3. Create a Virtual Environment

**Windows — PowerShell**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, you can use Command Prompt instead:

```bat
venv\Scripts\activate.bat
```

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Start the Application

```bash
uvicorn main:app --reload
```

If the application starts successfully, open:

- **Web Application:** http://127.0.0.1:8000
- **Interactive API Documentation:** http://127.0.0.1:8000/docs
- **Alternative API Documentation:** http://127.0.0.1:8000/redoc

The web interface requires the corresponding frontend routes and template configuration to be implemented in the application.

Press `Ctrl + C` in the terminal to stop the development server.

## 🔌 API Documentation

FastAPI automatically generates interactive API documentation for registered endpoints.

Open `http://127.0.0.1:8000/docs` after starting the application to inspect the available routes, review request parameters, and test supported operations.

The actual endpoints and request formats depend on the implementation in `main.py`.

## 🗄️ Database

StudentHub uses SQLite to store student information. SQLite is file-based and does not require a separate database server.

The database connection and database operations are configured in `database.py`.

The database file may be created automatically by the application, depending on its initialization logic. Do not upload a database containing real or sensitive student information to a public repository.

## 🧪 Testing

Before using the application, verify that:

- The server starts without errors.
- The homepage loads correctly.
- Available API endpoints respond as expected.
- Student records are stored and retrieved correctly.
- Input validation handles invalid data appropriately.
- Data remains available after restarting the application.

These are recommended checks; actual test coverage depends on the tests included in the repository.

## 🔒 Security & Best Practices

- Validate incoming data before processing it.
- Keep private credentials and environment variables out of source control.
- Avoid committing virtual environments, cache files, or sensitive database contents.
- Use a production ASGI server configuration before deploying the application publicly.
- Add authentication and authorization if the application will manage protected student information.

## 🚀 Future Improvements

Possible enhancements include:

- Search and filter student records.
- Pagination for larger datasets.
- Improved form validation and error messages.
- Automated unit and API tests.
- Authentication and role-based access control.
- Deployment to a cloud hosting platform.
- A more responsive and accessible user interface.

These are potential enhancements, not claims about currently implemented functionality.

## 🎯 Learning Outcomes

This project provides practical experience with:

- Developing APIs using FastAPI.
- Connecting a Python application to SQLite.
- Organizing backend code into separate modules.
- Validating request data with schemas.
- Connecting frontend interactions to backend endpoints.
- Running and debugging a Python web application.
- Managing source code with Git and GitHub.

## 👩‍💻 Author

**Vanshika**

GitHub: [@vanshika0842](https://github.com/vanshika0842)

## 📄 License

This project is available under the MIT License only if you choose to distribute it under that license. Add a `LICENSE` file to the repository before claiming that the project is MIT-licensed.

---


⭐ If you find this project useful, consider starring the repository.

