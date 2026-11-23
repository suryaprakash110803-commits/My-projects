# HelpingHands Hub

A responsive volunteer matching and shift management demo built with React and Vite. Volunteers can find a local drive, choose an open shift, and track service hours after an organizer confirms attendance.

## Live website

https://magenta-kulfi-a9a3bf.netlify.app

After extracting the submission ZIP, double-click `OPEN-LIVE-WEBSITE.html` and click **Open the live website** to visit the published app.

## Standalone HTML version

`outputs/HelpingHands-Hub.html` is a single-file version that includes the page styling and browser-side interactions. Open it directly in a browser; it does not require React or a development server. Its demo data is saved in that browser only.

## Run the project

1. Install [Node.js](https://nodejs.org/) if it is not already installed.
2. Double-click `Open-HelpingHands.bat` in this folder. It installs dependencies the first time, starts the app, and opens it in your browser.

You can also run it manually from a terminal:

1. Open a terminal in this project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local address printed in the terminal, usually `http://localhost:5173`.

## Demo flow

- The volunteer is pre-filled as **Alex Morgan**.
- Open **Explore drives**, select **Environment**, and open **Urban Tree Plantation Drive**.
- Choose a shift and sign up. The open spot count decreases immediately and the shift appears in the organizer roster.
- Open **Organizer**, select the same drive, and mark Alex as attended.
- Open **My impact** to see verified hours and preview a printable service certificate.

The app starts with eight sample drives, four community organizations, 20 shifts, and 35 sample registrations. It also includes a previous four-hour service record so the impact view is populated on first launch.

## Features

- Search and filter drives by cause, name, organization, or location.
- Match opportunities to selected interests using Jaccard similarity.
- Show shift availability and prevent duplicate sign-ups or over-capacity sign-ups.
- View volunteer contact details and toggle attendance in the organizer roster.
- Count hours only after a volunteer's attendance is confirmed.
- Show impact badges and a printable certificate preview.
- Save demo sign-ups, interests, and attendance in browser `localStorage`.
- Adapt the interface for mobile screens and larger touch targets.

## Project structure

```text
index.html
src/
  App.jsx       Main screens, sample data, matching, and sign-up logic
  main.jsx      React entry point
  styles.css    Responsive interface styles
```

This is a browser-only hackathon demo. Its saved data belongs to the current browser and does not sync across devices or provide real user accounts. For a multi-user deployment, connect the interface to a server and database so capacity checks and attendance updates are shared across users.
