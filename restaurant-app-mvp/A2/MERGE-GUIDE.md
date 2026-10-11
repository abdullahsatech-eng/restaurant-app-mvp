# Merge this ZIP into the existing GitHub repository safely

The public repository page currently describes the project as the Assignment 1 React Native frontend. The ZIP preserves `A1/SRS.pdf` and all five A1 UML diagrams byte-for-byte, while adding `A2/` and the server/API integration.

## Recommended safe workflow

1. Download this ZIP and extract it somewhere separate from your GitHub working copy.
2. Open your existing repository working copy and inspect its folders first. The public repository currently appears to have a nested `restaurant-app-mvp/` project folder; do not assume the repository root and project root are the same directory.
3. Copy the **contents** of the extracted project folder into the existing project folder that contains `App.js`, `package.json`, `src/`, and `A1/`. Merge files; do not create a second nested project directory.
4. Never copy a real `server/.env` into Git. Only `server/.env.example` should be committed.
5. Review every change before committing:

   ```bash
   git status --short
   git diff --stat
   git diff -- .gitignore server/.env.example src/api/client.js
   ```

6. Run the backend unit tests and syntax checks. Then configure MongoDB, run the seed script, start the server, and test the Postman collection.
7. Commit the work in meaningful Assignment 2 commits only after reviewing the diff. Do not force-push or replace the repository history.

This ZIP has **not** been pushed to GitHub. A live repository write should happen only after the exact current project tree has been reviewed and you approve the changes.
