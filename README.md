# Task Ledger — Week 4 Project

**Intern:** Hamna Asif
**Domain:** Full-Stack Web Development
**Week:** Week 4 — JavaScript Fundamentals, DOM Manipulation, Events, Forms & localStorage

**Live Deployment Link:** _add your GitHub Pages / Vercel link here after deploying_

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript (DOM APIs, Events, localStorage)
- No frameworks or libraries (React not used, per task requirement)

## Features Implemented
- Add a new task with title and priority
- Edit a task's title in place
- Delete a task
- Mark a task as complete / incomplete
- Filter tasks: All / Active / Completed
- Form input validation (empty and overly long titles rejected)
- Tasks saved to `localStorage` and restored after page refresh
- Update and remove stored tasks (persisted automatically on every change)
- Responsive layout for mobile and desktop

## Challenges Faced & What Was Learned
- Rebuilding the task list from the `tasks` array on every change (instead of
  patching individual DOM nodes) turned out to be the simplest way to keep the
  UI and `localStorage` in sync — this reinforced how "the array is the source
  of truth, the DOM is just a reflection of it" works in practice.
- Using `contenteditable` for inline editing required manually placing the
  cursor at the end of the text and re-validating on save, which was a good
  hands-on look at how much form validation normally does for free.
- Event delegation (one listener on the list, not one per task) was needed
  since tasks are created and destroyed dynamically.

## Completed JavaScript Exercises
- Variables: `let` and `const`
- Data types & operators
- Conditional logic (`if` / `else`)
- Loops (`for`, iterating over arrays)
- Functions: declarations, parameters, return values
- Arrays: `push`, `filter`, `find`
- Objects: creating and updating task objects
- ES6+: arrow-free and arrow function mixes, template-literal-free string
  building, `const`/`let` throughout

## Folder Structure
```
aurex-web-internship-hamna/
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   └── main.js
└── README.md
```
