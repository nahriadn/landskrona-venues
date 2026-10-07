# Docker Deployment for Landskrona Venues

This repository is ready to be deployed as a containerized application.

## 1. Build the Docker Image

Run the following command from the root of the project to build the Next.js production image:

```bash
docker build -t landskrona-venues .
```

## 2. Run the Container

Once built, you can run the container on port 3000:

```bash
docker run -p 3000:3000 -v $(pwd)/src/data:/app/src/data -d landskrona-venues
```

*Note: We mount the `src/data` folder as a volume so that when the Admin edits venues in the CMS, the `venues.json` file is persisted on the host machine and not lost when the container restarts.*

## 3. Demo Credentials

To access the `/admin` portal (once integrated with a real auth provider in the future), you will use the municipality's single sign-on (SSO) or standard credentials. For this prototype, the `/admin` page is open for demonstration purposes, but in production, you can use these test accounts:

**Admin Account (Kulturförvaltningen)**
- **Username:** `admin@landskrona.se`
- **Password:** `KronaAdmin2026!`

**Test Booker Account (Föreningsliv)**
- **Username:** `test.forening@gmail.com`
- **Password:** `TestBoka123`
