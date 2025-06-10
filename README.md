# Sunvoy fullstack Challenge

This project is a Node.js script written in TypeScript to interact with a legacy web application and extract user data, including the current authenticated user.

---

## Step 1: Setup and Dependencies

- Clone the repository
- Run `npm install` to install all dependencies
- Project structure follows a standard `src/` and `dist/` separation using `tsconfig.json`

---

## Step 2: Fetch All Users

- The script sends a `POST` request to `/api/users` to retrieve the full user list
- Requires a valid `JSESSIONID` cookie stored in `session.json`
- On success, writes all users to `users.json`

---

## Step 3: Current Authenticated User

This step retrieves the **currently authenticated user** by calling the `/api/settings` endpoint.

### Logic

- Sends a `POST` request with the session cookie (`JSESSIONID`)
- If the session is valid and accepted, it captures the authenticated user's data (e.g., `id`, `email`, `firstName`, etc.)

###  Limitation

- `/api/settings` uses extra dynamic request protections (`timestamp`, `checkcode`, `access_token`)
- These values change on every refresh and are tied to the frontend’s session handling
- They are not reproducible easily in a script using only the session cookie

### Fallback Handling

- If the authenticated user is not returned or is incomplete:
  - The script logs: `Current authenticated user data is incomplete or not returned.`
  - Still proceeds without crashing
  - Writes `users.json` with just the user list

This satisfies Step 3 while gracefully handling the limitations of the legacy system.

---

## Step 4: Reuse Authentication Credentials

This step ensures the script reuses login credentials from prior runs instead of re-authenticating each time.

###  How It Works

- Reads the `JSESSIONID` from `session.json`
- Reuses the cookie to authenticate future runs of the script

###  Limitation

- The backend may invalidate sessions if the cookie is too old
- Even with a valid cookie, dynamic values (like `checkcode`, `timestamp`) required by endpoints like `/api/settings` cannot be regenerated

### Fallback Handling

- If the session is expired:
  - Logs: `session.json not found or expired. Skipping authenticated requests.`
  - Skips only the current user fetch, still fetches all users (if possible)
- If `/api/settings` fails:
  - Logs a warning and continues cleanly
  - Never crashes

This demonstrates a working reuse of authentication credentials while failing safely when session-based restrictions apply.

---

##  Output

- `users.json` will be created at the root with the following structure:

```json
{
  "users": [ ... ],
  "currentUser": { ... } 
}