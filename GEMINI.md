# CodeGuru - Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

---

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**  
- Basically just SOPs written in Markdown, live in `directives/`  
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases  
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**  
- This is you. Your job: intelligent routing.  
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings  
- You're the glue between intent and execution. E.g you don't try scraping websites yourself—you read `directives/scrape_website.md` and come up with inputs/outputs and then run `execution/scrape_single_site.py`

**Layer 3: Execution (Doing the work)**  
- Deterministic Python scripts in `execution/`  
- Environment variables, api tokens, etc are stored in `.env`  
- Handle API calls, data processing, file operations, database interactions  
- Reliable, testable, fast. Use scripts instead of manual work. Commented well.

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. The solution is push complexity into deterministic code. That way you just focus on decision-making.

---

## Operating Principles

**1. Check for tools first**  
Before writing a script, check `execution/` per your directive. Only create new scripts if none exist.

**2. Self-anneal when things break**  
- Read error message and stack trace  
- Fix the script and test it again (unless it uses paid tokens/credits/etc—in which case you check w user first)  
- Update the directive with what you learned (API limits, timing, edge cases)  
- Example: you hit an API rate limit → you then look into API → find a batch endpoint that would fix → rewrite script to accommodate → test → update directive.

**3. Update directives as you learn**  
Directives are living documents. When you discover API constraints, better approaches, common errors, or timing expectations—update the directive. But don't create or overwrite directives without asking unless explicitly told to. Directives are your instruction set and must be preserved (and improved upon over time, not extemporaneously used and then discarded).

---

## Self-annealing Loop

Errors are learning opportunities. When something breaks:  
1. Fix it  
2. Update the tool  
3. Test tool, make sure it works  
4. Update directive to include new flow  
5. System is now stronger

---

## File Organization

**Deliverables vs Intermediates:**  
- **Deliverables**: Google Sheets, Google Slides, or other cloud-based outputs that the user can access  
- **Intermediates**: Temporary files needed during processing

**Directory structure:**  
- `.tmp/` - All intermediate files (dossiers, scraped data, temp exports). Never commit, always regenerated.  
- `execution/` - Python scripts (the deterministic tools)  
- `directives/` - SOPs in Markdown (the instruction set)  
- `.env` - Environment variables and API keys  
- `credentials.json`, `token.json` - Google OAuth credentials (required files, in `.gitignore`)

**Key principle:** Local files are only for processing. Deliverables live in cloud services (Google Sheets, Slides, etc.) where the user can access them. Everything in `.tmp/` can be deleted and regenerated.

---

## Project Overview

### Project
CodeGuru is a gamified coding and learning platform for college students.

### Team
Team Name: SparkCoders

Members:
- Sahil Kumar - Team Lead
- Robin Singh
- Gurjant Singh
- Rohit Kharnotia

### Project Goal
Build a game-like platform where college students can learn coding,
DSA and web development through missions, challenges and gamification.

### Planned Features
- User Authentication
- Google Authentication
- GitHub Authentication
- Language Selection
- Learning Map
- Missions
- Coding Challenges
- XP System
- Levels
- Achievements
- Leaderboard
- Daily Challenges
- Profile
- Coding Editor

### Technology
Frontend:
- React
- Vite
- JavaScript
- CSS

Backend:
- Python
- FastAPI

Database:
- SQLite

Version Control:
- Git
- GitHub

---

## AI Agent Rules

Before making any changes:

1. Read this instruction file.
2. Inspect the existing project structure.
3. Understand the existing code.
4. Do not immediately start coding.
5. First determine which files need to be created or modified.

### Coding Rules

- Reuse existing components whenever possible.
- Do not create duplicate components.
- Keep code modular and maintainable.
- Do not install unnecessary dependencies.
- Do not change the technology stack without approval.
- Do not delete working code without checking its dependencies.
- Do not make unnecessary changes outside the requested task.
- Keep frontend and backend responsibilities separate.
- Follow the existing project structure.

### Task Execution

For every task:

1. Understand the requirement.
2. Inspect relevant files.
3. Explain the implementation plan.
4. Implement the required changes.
5. Test the changes.
6. Check for errors.
7. Report all files changed.
8. Explain what was completed.

### Git Rules

Use feature branches for new features.

Examples:
- `feature/login`
- `feature/authentication`
- `feature/leaderboard`
- `feature/mission-system`

Use meaningful commit messages.

Examples:
- `feat: add login page`
- `feat: implement authentication`
- `fix: resolve login validation issue`

---

## Important

Never make major architectural changes without approval.

If requirements are unclear or conflict with existing project decisions,
stop and ask for clarification before making major changes.
