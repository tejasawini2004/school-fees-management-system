# Mini Project Report

## Chapter 1: Introduction

### 1.1 Project Title
School Fees Management System

### 1.2 Project Synopsis
The School Fees Management System is a web-based application designed to automate the process of collecting and managing student fees. It centralizes student records, fee details, payment history, and report generation to reduce manual work and improve accuracy.

### 1.3 Problem Statement
Many schools still use manual methods such as paper records or spreadsheets to manage fee payments and student information. These methods are prone to errors, delays, and difficulty in tracking pending fees. The system solves this problem by providing a digital platform to manage fees efficiently.

### 1.4 Objectives
- Record and manage student information accurately
- Maintain fee details and payment history for each student
- Track pending fees and generate reminders
- Produce reports for fees collected, pending fees, and class-wise summaries
- Provide an easy-to-use web interface for authorized users

### 1.5 Scope
- User types:
  - School Administrator
  - Accounts Staff
  - Management or Report Viewer
- Main features:
  - Student registration and profile management
  - Fee record entry and update
  - Payment recording and payment history
  - Search and view student fee details
  - Report generation for fee summaries and pending amounts

### 1.6 Technologies Used
- Java (Core Java and JDBC)
- MySQL database
- HTML, CSS, JavaScript
- Built-in Java HttpServer for backend services

## Chapter 2: System Design

### 2.1 System Overview
The system has three main layers:
- Frontend: HTML, CSS, JavaScript
- Backend: Core Java HttpServer (com.sun.net.httpserver)
- Database: MySQL

### 2.2 DFD 0: Context Diagram
DFD Level 0 shows the overall system at a high level. It includes the main users, primary processes, and the data store. In this project, the top-level flow describes how the user interacts with the browser, how the server processes requests, and how the database stores fee information.

- Users: School administrator, accounts staff, report viewer
- Main process: School Fees Management System
- Data store: MySQL database containing students, fees, and payment records

```
                +-------------------+
                |      Browser      |
                |  (HTML/CSS/JS)    |
                +---------+---------+
                          |
                          | HTTP/JSON requests and responses
                          |
                +---------v---------+
                |  School Fees      |
                |  Management       |
                |  System           |
                |  (Java Backend)   |
                +---------+---------+
                          |
                          | JDBC queries and updates
                          |
                +---------v---------+
                |      MySQL DB     |
                |  (students, fees, |
                |   payments tables)|
                +-------------------+
```

This diagram provides a simple view of the system boundaries and data movement. It is the highest level DFD and does not show internal sub-processes.

### 2.3 DFD 1: High-Level Process Flow
DFD Level 1 expands on the context diagram by showing the main sub-processes within the system. It breaks down the overall system into key functional areas: authentication, student management, fee management, and report generation. Each process interacts with the database through DBConnection.

- Processes: AuthHandler (login), StudentApiHandler (student CRUD), FeeApiHandler (fee and payment operations), ReportApiHandler (report generation)
- Data stores: MySQL database (students, fees, payments tables)
- Data flows: User inputs, API requests, database queries and responses

```
[User] --> (Login) --> [AuthHandler] --> [DBConnection] --> [MySQL DB]
[User] --> (Manage Students) --> [StudentApiHandler] --> [DBConnection] --> [MySQL DB]
[User] --> (Manage Fees) --> [FeeApiHandler] --> [DBConnection] --> [MySQL DB]
[User] --> (Generate Reports) --> [ReportApiHandler] --> [DBConnection] --> [MySQL DB]

[MySQL DB] --> (Response Data) --> [Handlers] --> (Display/Response) --> [User]
```

This level shows how the system is divided into major modules and their interactions with the database.

### 2.4 DFD 2: Detailed Data Flow for Fee Payment
```
[Student Payment Form]
         |
         v
[Frontend JS] -- POST /api/fees/payment --> [FeeApiHandler]
         |
         v
   [Database Update]
         |
         v
[Payment History Response] --> [Frontend Display]
```

### 2.5 System Overall Architecture with Modules
```
+--------------------------------------------------+
|                  Frontend Module                 |
|  - index.html                                    |
|  - app.js                                        |
|  - style.css                                     |
+--------------------------------------------------+
                       |
                       | HTTP/JSON
                       v
+--------------------------------------------------+
|                    Backend Module                |
|  - Main.java                                      |
|  - DBConnection.java                              |
|  - SimpleServer.java                              |
|  - StaticHandler.java                             |
|  - AuthHandler.java                               |
|  - StudentApiHandler.java                         |
|  - FeeApiHandler.java                             |
|  - ReportApiHandler.java                          |
|  - StudentService.java                            |
|  - FeeService.java                                |
|  - ReportService.java                             |
+--------------------------------------------------+
                       |
                       | JDBC
                       v
+--------------------------------------------------+
|                    Database Module               |
|  - MySQL Server                                   |
|  - school_fees_db schema                          |
|  - students table                                 |
|  - fees table                                     |
|  - payments table                                 |
+--------------------------------------------------+
```

### 2.6 Class Diagram
```
+-------------------+     +----------------+     +----------------+
|     Student       |     |      Fee       |     |    Payment     |
+-------------------+     +----------------+     +----------------+
| - id              |     | - id           |     | - id           |
| - name            |     | - studentId    |     | - studentId    |
| - rollNo          |     | - totalFees    |     | - amount       |
| - className       |     | - paidAmount   |     | - date         |
| - contact         |     | - dueAmount    |     | - paymentMode  |
+-------------------+     +----------------+     +----------------+
         |                          |                      |
         +-------------+------------+                      |
                       |                                   |
                +----------------+                          |
                |  DBConnection  |<-------------------------+
                +----------------+
                | + getConnection()|
                | + testConnection()|
                +----------------+
```

### 2.7 Object Diagram
```
[Student Object]
  id = 101
  name = "Rahul Patil"
  rollNo = "SF-2025-01"
  className = "FYBCOM"
  contact = "9876543210"

[Fee Object]
  id = 201
  studentId = 101
  totalFees = 50000
  paidAmount = 20000
  dueAmount = 30000

[Payment Object]
  id = 301
  studentId = 101
  amount = 5000
  date = "2026-05-05"
  paymentMode = "Online"
```

### 2.8 Use Case Diagram
```
Actors:
 - Admin
 - Accountant
 - Reporter

Use Cases:
 - Login
 - Add Student
 - View Student List
 - Edit Student
 - Delete Student
 - Search Student
 - Manage Fees
 - Record Payment
 - Generate Receipt
 - View Reports
```

### 2.9 Sequence Diagram
```
User -> Browser : Open application
Browser -> Server : GET /index.html
Server -> Browser : index.html + app.js + style.css
User -> Browser : Login credentials
Browser -> Server : POST /api/login
Server -> AuthHandler : validate credentials
Server -> DBConnection : query admin user
Server -> Browser : login success
User -> Browser : Click "Add Student"
Browser -> Server : POST /api/students
Server -> StudentApiHandler : create student record
Server -> DBConnection : insert student
Server -> Browser : student created response
```

### 2.10 Deployment Diagram
```
+----------------+      +----------------------+      +---------------+
|   Client       | ---> |  Java Application     | ---> |  MySQL DB     |
|  Web Browser   |      |  (HttpServer Port 8080)|      | school_fees_db|
+----------------+      +----------------------+      +---------------+
```

## Chapter 3: Implementation

### 3.1 Frontend Implementation
The frontend is built using HTML, CSS, and JavaScript to provide a user-friendly web interface. The `index.html` file contains the structure of the web pages, including forms for login, student management, fee entry, and reports. CSS (`style.css`) is used for styling to ensure the interface is responsive and visually appealing. JavaScript (`app.js`) handles user interactions, such as form submissions and API calls to the backend.

- **HTML Structure**: Defines the layout with sections for navigation, forms, and data display tables.
- **CSS Styling**: Applies responsive design principles to make the application accessible on different devices.
- **JavaScript Functionality**: Manages dynamic content updates, validates user inputs, and communicates with the backend via AJAX requests.

### 3.2 Backend Implementation
The backend is implemented using Core Java with the built-in HttpServer from `com.sun.net.httpserver`. The server listens on port 8080 and handles HTTP requests. The main components include:

- **Main.java**: The entry point that initializes the server and sets up context handlers for different API endpoints.
- **SimpleServer.java**: Configures the HTTP server, including CORS headers for cross-origin requests from the frontend.
- **StaticHandler.java**: Serves static files like HTML, CSS, and JS to the browser.
- **AuthHandler.java**: Processes login requests, validates user credentials against the database, and manages session authentication.
- **StudentApiHandler.java**: Handles CRUD operations for student records, including adding, updating, deleting, and retrieving student information.
- **FeeApiHandler.java**: Manages fee records and payments, allowing users to record payments and update fee statuses.
- **ReportApiHandler.java**: Generates reports by querying the database for fee summaries, pending fees, and class-wise data.

Each handler extends `HttpHandler` and processes requests by parsing JSON data, interacting with the database via JDBC, and returning JSON responses.

### 3.3 Database Implementation
The database layer uses MySQL to store all application data. The `school_fees_db` schema contains three main tables:

- **students table**: Stores student details such as id, name, rollNo, className, and contact.
- **fees table**: Links to students and tracks totalFees, paidAmount, and dueAmount for each student.
- **payments table**: Records individual payment transactions with studentId, amount, date, and paymentMode.

- **DBConnection.java**: Provides a utility class for establishing JDBC connections to the MySQL database. It includes methods like `getConnection()` to return a database connection and `testConnection()` to verify connectivity.

The implementation ensures data integrity through foreign key relationships and uses prepared statements to prevent SQL injection.

### 3.4 Integration and Workflow
The frontend communicates with the backend via RESTful API calls using JSON format. When a user submits a form, JavaScript sends a POST request to the appropriate handler (e.g., `/api/students` for student operations). The backend processes the request, interacts with the database, and returns a response. This separation of concerns ensures modularity and ease of maintenance.

## Chapter 4: Testing

### 4.1 Testing Strategy
The School Fees Management System was tested using a combination of unit testing, integration testing, and system testing to ensure reliability and functionality. Testing was performed manually due to the project's scope, focusing on key modules and user workflows.

### 4.2 Unit Testing
- **Backend Classes**: Individual Java classes like `DBConnection`, `StudentService`, and `FeeService` were tested for database connectivity and data manipulation. For example, `DBConnection.testConnection()` was verified to establish a successful MySQL connection.
- **Handlers**: Each API handler (e.g., `AuthHandler`, `StudentApiHandler`) was tested for correct request processing and response generation.
- **Frontend Components**: JavaScript functions in `app.js` were tested for form validation and API call handling.

### 4.3 Integration Testing
- **Database Integration**: Tested the interaction between backend handlers and the MySQL database. For instance, inserting a student record via `StudentApiHandler` and verifying it in the database.
- **Frontend-Backend Integration**: Verified that frontend forms send correct data to backend APIs and receive appropriate responses. Example: Submitting a login form and checking authentication.
- **Module Interactions**: Ensured that student management, fee recording, and report generation work together seamlessly.

### 4.4 System Testing
- **End-to-End Testing**: Simulated real user scenarios, such as adding a student, recording a fee payment, and generating a report. Verified the complete workflow from browser to database.
- **User Interface Testing**: Checked responsiveness, form validations, and error handling on different browsers.
- **Performance Testing**: Tested the application with sample data to ensure quick response times for queries and reports.

### 4.5 Test Cases
Some key test cases include:
- **Login Test**: Valid credentials should log in successfully; invalid ones should show error.
- **Student CRUD**: Add, edit, delete, and view student records without data loss.
- **Fee Payment**: Record payments and update due amounts accurately.
- **Report Generation**: Generate correct summaries for pending fees and class-wise data.
- **Error Handling**: Test invalid inputs, database connection failures, and network issues.

### 4.6 Test Results
All major functionalities passed testing. Minor issues like form validation messages were fixed. The system demonstrated stable performance with no critical bugs.

## Chapter 5: Results and Discussion

### 5.1 Results
- The web server started successfully and the application was accessible at `http://localhost:8080`.
- Student registration and fee management features worked as expected.
- Fee payment records were saved correctly, and due amounts were updated accurately.
- Reports for total fees collected, pending fees, and class-wise summaries generated the correct results.
- The user interface displayed information properly and responded to user actions.

### 5.2 Discussion
The implementation of the School Fees Management System demonstrated that a simple Java-based web application can effectively replace manual fee tracking methods. Key observations include:

- **Data accuracy**: The system reduced the chance of calculation errors by automatically updating payment totals and dues.
- **Time savings**: Administrators can manage student records and fees faster than with paper or spreadsheet methods.
- **Report usefulness**: Generated reports provide quick insight into fee collection status and pending payments, which supports decision-making.
- **Usability**: The web interface is easy to navigate for authorized users, with clear forms and feedback after each action.

### 5.3 Limitations
- The current implementation uses a single database and does not support distributed deployment.
- Role-based access control is basic and can be enhanced for stronger security.
- The interface is functional but can be improved with better styling and mobile responsiveness.

### 5.4 Future Improvements
- Add detailed user roles and permissions for administrators, accountants, and management.
- Implement notification features such as email or SMS reminders for pending fees.
- Add charts and graphical dashboards for better visualization of fee reports.
- Improve the UI with responsive design for mobile devices.

### 5.5 Screenshots
> The screenshots below should be captured from the actual application. Use image links in Markdown to add the images.

1. Login Screen
   - `![Login Screen](screenshots/login.png)`
2. Dashboard Screen
   - `![Dashboard](screenshots/dashboard.png)`
3. Add Student Screen
   - `![Add Student](screenshots/add_student.png)`
4. Student List Screen
   - `![Student List](screenshots/student_list.png)`
5. Fee Payment Screen
   - `![Fee Payment](screenshots/fee_payment.png)`
6. Payment History Screen
   - `![Payment History](screenshots/payment_history.png)`
7. Reports Screen
   - `![Reports](screenshots/reports.png)`

## Chapter 6: Conclusion

This project automates school fee management and simplifies administrative work. Users can access the system through a web browser, and all information is stored in the database.

## Chapter 7: Future Scope
- SMS / Email notifications for fee payments
- Multi-level login and role-based access
- Graphical reports and charts
- Mobile responsive user interface

## References
- Oracle. "Java SE Documentation." https://docs.oracle.com/javase/.
- Oracle. "Java Platform, Standard Edition (JDK) 8 API Specification." https://docs.oracle.com/javase/8/docs/api/.
- MySQL. "MySQL Reference Manual." https://dev.mysql.com/doc/.
- Java JDBC Tutorial. https://docs.oracle.com/javase/tutorial/jdbc/.
- Baeldung. "Java HttpServer Tutorial." https://www.baeldung.com/java-http-server.
- W3Schools. "HTML Tutorial." https://www.w3schools.com/html/.
- W3Schools. "CSS Tutorial." https://www.w3schools.com/css/.
- W3Schools. "JavaScript Tutorial." https://www.w3schools.com/js/.
- Project source code and README file in this repository.
