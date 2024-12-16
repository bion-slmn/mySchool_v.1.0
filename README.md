Here's the updated README with the **Payment app** included:

---

# School Finance Management System

## Overview

The **School Finance Management System** is a web-based application developed to streamline the management of school operations, including student enrollment, fee tracking, class assignments, and user management. This system helps educational institutions efficiently manage their finances and student-related processes while providing a user-friendly interface for administrators, teachers, and students.

The project uses modern technologies such as Django and Django Rest Framework (DRF) for the backend, React for the frontend, and Poetry for managing Python dependencies.

---

## Project Structure

The project is organized into several Django applications, each responsible for specific features of the system. Below is the folder structure:

```
school_finance_management/
├── manage.py                   # Django management script
├── config/                     # Project configuration and settings
│   ├── __init__.py
│   ├── settings.py             # Django project settings
│   ├── urls.py                 # Root URL configuration
│   ├── wsgi.py                 # WSGI application for deployment
│   └── asgi.py                 # ASGI application for deployment
├── apps/                       # Modular Django applications
│   ├── schools/                # School management app
│   ├── students/               # Student management app
│   ├── classes/                # Class and grade management app
│   ├── fees/                   # Fee management and transactions app
│   ├── payment/                # Payment processing and transaction management app
│   └── users/                  # User management and authentication app
└── tests/                      # Unit tests for each app
    ├── schools/
    ├── students/
    ├── classes/
    ├── fees/
    ├── payment/
    └── users/
```

---

## Key Features

### **Backend (Django & DRF)**

- **Schools Management**: Create and manage schools, assign administrators.
- **Students Management**: Register and manage students, track their progress.
- **Class Management**: Assign students to classes and track class data.
- **Fee Management**: Handle fee payments, including installments, and generate reports.
- **Payment Management**: Track and manage payments made by students for their fees, including installment handling, payment methods, and payment references.
- **User Management**: Role-based access control, including administrators, teachers, and students.

### **Frontend (React)**

- **Responsive UI**: A dynamic and interactive user interface for administrators, teachers, and students.
- **Data Visualization**: Display key metrics related to student performance, fee payments, and transactions.

### **Package Management**

- **Poetry**: Used to manage Python dependencies and virtual environments for reproducible builds.

---

## Technologies Used

- **Django**: Python web framework for building robust backend APIs and server-side logic.
- **Django Rest Framework (DRF)**: Provides tools for building RESTful APIs.
- **React**: JavaScript library for building modern user interfaces.
- **Poetry**: Dependency management tool for Python.
- **PostgreSQL** (or other RDBMS): Relational database for storing application data.

---

## Installation

### **Prerequisites**

- Python 3.9+
- Node.js 16+
- Poetry (Python dependency management)

### **Clone the Repository**

```bash
git clone https://github.com/your-repo/school_finance_management.git
cd school_finance_management
```

### **Backend Setup**

1. Install the Python dependencies using Poetry:

   ```bash
   poetry install
   ```

2. Activate the Poetry virtual environment:

   ```bash
   poetry shell
   ```

3. Run database migrations:

   ```bash
   python manage.py migrate
   ```

4. Create a superuser (optional, for accessing the Django admin):

   ```bash
   python manage.py createsuperuser
   ```

5. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

### **Frontend Setup**

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

---

## Running Tests

To run the unit tests for each app, use the following command:

```bash
python manage.py test
```

This will run all tests in the `tests/` directory for each application.

---

## Key Commands

- Install a new Python package using Poetry:

  ```bash
  poetry add <package-name>
  ```

- Remove a package:

  ```bash
  poetry remove <package-name>
  ```

- Run the Django development server:

  ```bash
  python manage.py runserver
  ```

- Run the React development server:
  ```bash
  npm start
  ```
