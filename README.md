# GitDiff Viewer

This is a web application built with React and Vite that allows users to view Git commit diffs and commit details. The application fetches and displays changes made in a specific commit with its previous commit, including file modifications and author details.

## Features
- View commit details such as author, commit message, and commit date.
- Display file changes with line-by-line diffs.

## Packages Used
- Axios (for API requests)
- React Router (for fetching params from url and routing)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/AathiEswar/Git-Commit-Diff-FE
   cd Git-Commit-Diff-FE
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the project root and add the backend API URL:
   ```sh
   REACT_BACK_END_API=http://your-backend-url
   ```

## Running the Application

Start the development server:
   ```sh
   npm run dev
   ```

The application will be available at `http://localhost:5173/` (default Vite port).

## Usage

Navigate to:
```
/repositories/:owner/:repo/commits/:commitOid
```
to view commit details and diffs.

For example:
```
http://localhost:5173/repositories/octocat/Hello-World/commits/1234567
```

## Deployment

To build the project for production:
   ```sh
   npm run build
   ```

To preview the production build locally:
   ```sh
   npm run preview
   ```
