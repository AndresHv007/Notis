# Notis - A Simple Note-Taking App

A full-stack Minimum Viable Product (MVP) of a note-taking application. It allows users to create, read, update, and delete notes, which can be organized with tags. The application features user authentication and a RESTful API.

## Tech Stack

*   **Backend:** Node.js, Express, MongoDB (with Mongoose), JWT for Authentication.
*   **Frontend:** HTML, CSS, JavaScript.
*   **Deployment:** Render.

## Database Structure

The application uses MongoDB and features three main collections:

*   `users`: Stores user credentials and information.
*   `notes`: Stores the content of notes, linked to a user and a tag.
*   `tags`: Stores user-created tags to organize notes.

## Key Features

*   **CRUD Operations:**
    *   Full CRUD functionality for notes.
    *   Create, Read, and Delete functionality for tags.
*   **Security:**
    *   User authentication with JSON Web Tokens (JWT).
    *   Password hashing using `bcryptjs`.
    *   Route protection using middleware to ensure only authenticated users can access certain endpoints.
*   **Frontend:**
    *   Separate pages for user registration, login, and displaying notes.
    *   Responsive design for use on different devices.
    *   A search interface for querying notes.

## API Documentation

### Auth

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Log in a user and receive a JWT.

### Notes

*   `GET /api/notes`: Get all notes for the authenticated user.
*   `POST /api/notes`: Create a new note.
*   `GET /api/notes/:id`: Get a specific note by ID.
*   `PUT /api/notes/:id`: Update a note.
*   `DELETE /api/notes/:id`: Delete a note.
*   `GET /api/notes/search`: Search for notes.

### Tags

*   `GET /api/tags`: Get all tags for the authenticated user.
*   `POST /api/tags`: Create a new tag.
*   `DELETE /api/tags/:id`: Delete a tag.

## Setup & Installation

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the `server` directory with a `MONGO_URI` and `JWT_SECRET`.
4.  Run the seed script to populate the database with initial data: `npm run seed`
5.  Start the server: `npm start`
6.  Open the `public/inicio.html` file in a web browser.

## Future Improvements

1.  **Rich Text Editor:** Implement a rich text editor (e.g., TinyMCE, Quill.js) on the frontend to allow for more complex formatting in notes, such as bold, italics, lists, and embedded images.
2.  **Advanced Tagging:** Allow for multiple tags per note. This would require a change in the `Note` model to have an array of tag references.
3.  **Sharing Notes:** Implement a feature to allow users to share notes with other users, with different permission levels (e.g., read-only, read-write).
