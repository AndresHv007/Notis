# NOTIS - A Simple Note-Taking App

NOTIS is a simple and elegant note-taking application that allows you to create, manage, and organize your notes in a clean and intuitive interface.

## Features

- **User Authentication:** Secure registration and login functionality.
- **Note Management:** Create, edit, and delete notes.
- **Search:** Full-text search for notes by title, content, or tags.
- **Filtering:** Filter notes to see only the ones created today.
- **Pagination:** Notes are paginated for a clean and organized view.
- **Responsive Design:** The application is designed to work on both desktop and mobile devices.

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- [MongoDB](https://www.mongodb.com/) (local installation or a cloud-hosted instance like MongoDB Atlas)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/notis.git
    cd notis
    ```

2.  **Install backend dependencies:**
    Navigate to the `server` directory and install the dependencies.
    ```bash
    cd server
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `server` directory and add the following variables:
    ```
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

4.  **Seed the database (optional):**
    To populate the database with dummy data, run the following command in the `server` directory:
    ```bash
    npm run seed
    ```

5.  **Run the application:**
    In the `server` directory, run the following command to start the server:
    ```bash
    npm start
    ```
    The application will be available at [http://localhost:5000](http://localhost:5000).

## API Endpoints

The backend provides the following API endpoints:

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user and get a JWT.
- `GET /api/notes`: Get all notes for the logged-in user (paginated).
- `GET /api/notes/all`: Get all notes for the logged-in user (not paginated).
- `GET /api/notes/:id`: Get a specific note by its ID.
- `POST /api/notes`: Create a new note.
- `PUT /api/notes/:id`: Update a note.
- `DELETE /api/notes/:id`: Delete a note.
- `GET /api/notes/search`: Search for notes (paginated).
- `GET /api/notes/search/all`: Search for notes (not paginated).
- `GET /api/notes/today`: Get notes created today (paginated).
- `GET /api/notes/today/all`: Get notes created today (not paginated).
