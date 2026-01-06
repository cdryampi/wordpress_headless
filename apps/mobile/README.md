# WP Headless App

Mobile application for WP Headless using Expo, React Native, and Supabase.

> **Platform:** Windows development environment

## Setup

1. **Install dependencies:**

```powershell
npm install
```

2. **Environment Variables:**

Copy `.env.example` to `.env` and fill in your Supabase and WordPress credentials:

```powershell
Copy-Item .env.example .env
```

3. **Run the app:**

```powershell
npm start
```

## Development URLs

| Platform | WordPress GraphQL URL |
|----------|----------------------|
| Android Emulator | `http://10.0.2.2:8080/graphql` |
| iOS Simulator | `http://localhost:8080/graphql` |
| Physical Device | `http://<YOUR_PC_IP>:8080/graphql` |

> **Note:** For physical devices, ensure your PC and device are on the same network.

## Architecture

| Component | Technology |
|-----------|------------|
| Routing | **Expo Router** (file-based in `app/`) |
| Styling | **NativeWind** (Tailwind CSS) |
| Data Fetching | **TanStack Query** |
| Auth/DB | **Supabase JS** |
| Forms | **React Hook Form + Zod** |

## Project Structure

```
app/           → Routes (Expo Router file-based)
src/
  ├── features/  → Logic separated by feature
  ├── lib/       → Utilities and services
  └── ui/        → Reusable UI components
```

## Common Commands (PowerShell)

```powershell
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (requires macOS)
npm run ios

# Run on web
npm run web

# Clear cache and restart
npx expo start --clear
```

## Troubleshooting (Windows)

| Issue | Solution |
|-------|----------|
| Metro bundler slow | Run `npx expo start --clear` |
| Android emulator not found | Add Android SDK to PATH |
| Network request failed | Check firewall settings for port 8081 |
| Expo Go connection issues | Use `npx expo start --tunnel` |
