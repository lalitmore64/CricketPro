# Cricket Live Scoring Platform

A fullstack cricket live scoring and analytics platform built with Java 21, Spring Boot 3.3, Spring Data JPA, and a React + Vite frontend. Includes a match summary engine powered by AI or rule-based fallback.

---

## Features

- Team and player management with role-based classification (Batsman, Bowler, All-Rounder, Wicket Keeper)
- Match lifecycle management with status transitions (Upcoming → Live → Completed)
- Ball-by-ball scoring engine with support for runs, boundaries, extras (Wide, No Ball, Bye, Leg Bye), wickets, and automatic strike rotation
- Over tracking with legal ball counting, overs format conversion, and consecutive bowler restrictions
- Dismissal types: Bowled, Caught, LBW, Run Out, Stumped, Hit Wicket, Retired Hurt
- Live scorecards with strike rates, economy rates, and bowling figures
- Post-match AI summary with highlights, turning points, and player insights
- Clean responsive UI with light/dark theme support

---

## Tech Stack

### Backend
- Java 21 LTS
- Spring Boot 3.3.4 (Spring Web, Spring Data JPA, Jakarta Validation)
- H2 (in-memory default) / MySQL 8.x
- Maven

### Frontend
- React 19 + Vite
- React Router DOM v7
- Axios
- Lucide React (icons)

---

## Project Structure

```
CricketPro/
├── backend/                        # Spring Boot Backend
│   ├── src/main/java/com/cricket/scoring
│   │   ├── config/                 # CORS configuration
│   │   ├── controller/             # REST controllers
│   │   ├── dto/                    # Request and response DTOs
│   │   ├── entity/                 # JPA entities
│   │   ├── enums/                  # Domain enums
│   │   ├── exception/              # Exception handling
│   │   ├── mapper/                 # Entity-DTO mappers
│   │   ├── repository/             # Spring Data JPA repositories
│   │   ├── service/                # Business logic
│   │   └── util/                   # Utility classes
│   ├── src/main/resources/         # Application config
│   ├── src/test/                   # Unit tests
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                       # React + Vite Frontend
│   └── src/
│       ├── api/                    # Axios API services
│       ├── components/             # UI components
│       ├── hooks/                  # Custom React hooks
│       └── pages/                  # Page components
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Java 21
- Maven
- Node.js 18+

### Run the Backend
```bash
cd backend
mvn spring-boot:run
```
Backend starts at `http://localhost:8080`

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend starts at `http://localhost:5173`

### Environment Variables

**Frontend** (`frontend/.env`):
```
VITE_API_BASE_URL=http://localhost:8080/api
```

**Backend** (`backend/src/main/resources/application.properties`):
```
DB_URL          - JDBC database URL (defaults to H2 in-memory)
DB_USERNAME     - Database username
DB_PASSWORD     - Database password
AI_API_KEY      - OpenAI API key (optional, falls back to rule-based summary)
```
