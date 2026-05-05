Laravel Developer Technical Exam
Version112025.24
Overview
This technical assessment is designed to evaluate your practical development skills, problem solving approach, architectural decisions, and ability to deliver a working solution within a limited timeframe.
You will be provided with a mock project scenario and a set of detailed requirements. Your task is to design and implement the solution following industry standard best practices.
The exam duration is 5 hours. 
________________________________________
Project Scenario
You are tasked to build a simplified Student Services Management Module for a school system. The module will allow staff users to manage students, view service requests, and approve or reject them.
The features should focus on backend functionality using Laravel, while the frontend stack is flexible — you may use Vue, React, Blade, or any modern frontend framework.















Core Requirements
1. Authentication & Roles
•	Implement a basic login system.


•	Seed two roles:


o	Admin – full access


o	Staff – limited access


•	Use Laravel’s authorization features (policies, gates, or middleware) to protect routes.


2. Student Management
Create CRUD functionality for students:
•	Student Number


•	First Name


•	Last Name


•	Grade Level


•	Email


•	Status (Active / Inactive)


Validation rules should be applied.
3. 
Service Requests Module
A student can request services such as:
•	ID Replacement


•	Good Moral Certificate


•	Form 137


Staff users will manage these requests.
Each service request must include:
•	Request ID (auto-generated)


•	Student (relation)


•	Service Type


•	Date Requested


•	Status (Pending, Approved, Rejected)


•	Remarks (nullable)


Required Features
•	Staff can view, approve, or reject a request.


•	Admin can delete a request.


•	Request list must support filtering by date range and status.


4. API Endpoints
Provide JSON endpoints for:
•	Listing students


•	Listing service requests


•	Approving/rejecting requests


These should follow REST best practices.
5. Frontend Requirements
You are free to choose any frontend framework.
At minimum, implement:
•	Login page


•	Student management pages (list, add, edit)


•	Service request list with approval actions


UI does not need to be fully polished, but it must be clean and functional.

6. Complex Data Import & Processing (Required)
Implement a full Excel Import Module responsible for bulk creation of service requests with built-in data normalization, validation logic, and post-processing.
Excel Import Requirements
Admin users must be able to upload an Excel file (.xlsx) containing bulk service request entries. Each row in the file will include:
•	Student Number


•	Service Type


•	Requested Date


Validation & Processing Rules
•	Missing Student Number → skip the row and log the error.


•	Student does not exist → automatically create a new Student record and mark it with a dedicated is_imported field.


•	Student exists but is Inactive → skip the row and log the error.


•	Service Type normalization → the system must convert variations into valid types. Examples:


o	“goodmoral”, “good moral”, “Good Moral Cert” → Good Moral Certificate


o	“id”, “ID repl”, “ID replace” → ID Replacement


•	Duplicate detection → if a service request with the same Student + Service Type + Date exists, skip the row.


Database Logging
After processing the file, generate a detailed summary containing:
•	Total rows processed


•	Total successful service requests created


•	Total new students created


•	Total skipped rows with reasons


Save this summary into an import_logs table with the following fields:
•	id


•	filename


•	user_id


•	summary_json


•	created_at


Asynchronous Processing Requirement
Imports must be handled using queues/background jobs to prevent blocking the application during large file uploads.
Frontend Requirement for Imports
Provide at least:
•	An upload interface


•	A visible import status indicator (e.g., “Processing…”, “Completed”, or retrieval of summary logs)


•	A page/table listing past import logs






















Notes
•	You may use Laravel Breeze, Jetstream, or your preferred authentication starter.


•	Packages are allowed as long as they are declared in your README.


•	Internet usage is permitted for documentation lookup.

Technical Expectations
Your submission will be evaluated on:
Code Quality & Structure
•	Clean and organized folder structure


•	Use of Laravel best practices


•	Proper validation and error handling


•	Use of Eloquent relationships
•	Use of Form Requests, Policies, Services
•	Avoi N+1 problems
Database Design
•	Proper migrations


•	Logical table relationships


REST API Implementation
•	Consistent structure, naming, and response formats


Frontend Implementation
•	Functional UX


•	Proper API consumption


Git Usage
•	Create meaningful commits


•	Provide the final repository link



Submission Instructions
At the end of the exam, submit:
1.	GitHub/GitLab repository link containing:


o	Laravel backend code


o	Frontend code
o	Architecture explanation (Mandatory)
o	Explanation of concurrency handling and business rules.


2.	SQL file of your database schema


A short README.md with setup instructions


Thank you, and good luck!

