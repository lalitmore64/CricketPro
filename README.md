# 🏏 Cricket Live Scoring & Analytics Platform

A complete, production-grade fullstack **Cricket Live Scoring and Analytics Platform** built with **Java 21**, **Spring Boot 3.3**, **Spring Data JPA**, **REST APIs**, and a **React 18 + Vite** dashboard with an **AI-powered match summary engine**.

---

## 🌟 Features

- **Team & Player Management**: Complete CRUD operations for teams and player roles (`BATSMAN`, `BOWLER`, `ALL_ROUNDER`, `WICKET_KEEPER`).
- **Match Lifecycle Control**: Fixture scheduling, starting matches, innings setup, and status transitions (`UPCOMING`, `LIVE`, `COMPLETED`).
- **Real-Time Cricket Scoring Engine**:
  - **Runs & Boundaries**: `0, 1, 2, 3, 4` (Fours), `6` (Sixes).
  - **Extras Calculation**: `WIDE`, `NO_BALL`, `BYE`, `LEG_BYE` with penalty and boundary calculations.
  - **Automatic Strike Rotation**: Mid-over rotation on odd completed runs and automatic end-of-over strike swap.
  - **Over Calculations**: Internal legal ball tracking, exact `"X.Y"` overs format conversion, and consecutive bowler restrictions.
  - **Wicket Dismissals**: `BOWLED`, `CAUGHT`, `LBW`, `RUN_OUT`, `STUMPED`, `HIT_WICKET`, `RETIRED_HURT`.
  - **Live Scorecards**: Auto-calculates strike rates, economy rates, fours/sixes, balls faced, and bowling figures.
- **AI Match Analytics Summary**: Post-match analysis service generating match summaries, key highlights, turning points, and top performer insights.
- **Modern Clean UI**: High-contrast, crisp dashboard design with light/dark theme support.

---

## 🛠️ Technology Stack

### Backend
- **Java**: 21 LTS
- **Framework**: Spring Boot 3.3.4 (Spring Web, Spring Data JPA, Jakarta Validation)
- **Database**: H2 (In-memory default) / MySQL 8.x
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

---

## 📁 Project Structure

```text
Cricket App/
├── src/                          # Spring Boot Backend (Java 21)
│   └── main/java/com/cricket/scoring
│       ├── config/               # CorsConfig & RestClient configs
│       ├── controller/           # REST Controllers
│       ├── dto/                  # Request & Response DTOs
│       ├── entity/               # JPA Entities
│       ├── enums/                # Domain Enums
│       ├── exception/            # Global Exception Handler
│       ├── repository/           # Spring Data JPA Repositories
│       └── service/              # Transactional Scoring Logic
├── frontend/                     # React 18 + Vite Frontend
│   └── src/
│       ├── api/                  # Axios Services
│       ├── components/           # UI Components & Live Controls
│       ├── hooks/                # Custom React Hooks
│       └── pages/                # Dashboard, Match, Live Scoring & Scorecard Pages
├── pom.xml                       # Maven Configuration
├── README.md                     # Project Documentation
└── .gitignore                    # Git Exclusion Rules
