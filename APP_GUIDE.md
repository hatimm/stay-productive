# 🚀 VibeCode OS: The Ultimate App Guide

Welcome to your personal productivity command center. This document explains everything your application can do, the data structures it uses, and the built-in resources available to you.

---

## 📖 Overview
**VibeCode OS** (formerly Stay Productive) is a high-performance workspace designed for developers, freelancers, and creators. It combines task management, continuous learning (DevOps), AI intelligence gathering, and freelance pipeline tracking into a single, cohesive dashboard.

**Identity & Access**: The app is secured via a dedicated **Login Page** that features a modern, theme-aware design (Black/White responsive logo) ensuring a premium entry point.

---

## 🛠️ Core Capabilities

### 1. **Executive Dashboard (The Hub)**
- **Bento Grid Layout**: A modular interface that organizes your day into high-value zones.
- **Overall Progress**: A real-time visual tracker of your daily completion rate.
- **Routine & Focus**: Your primary tasks for the day, loaded automatically from your weekly template.
- **Expansion Tasks**: A "bonus" section for sub-tasks that unlocks only after you master your daily routine.

### 2. **Growth Calendar** 📅
- **Project Intelligence**: High-level metrics showing Total Objectives, Achievements, and your Efficiency Factor.
- **Future Planning**: See exactly what's coming up. The calendar pulls from your template to show planned tasks for any future date.
- **Detailed Day View**: Click any day to open a deep-dive modal of all tasks, categories, and status badges.
- **Month Navigation**: Track your progress across months to see your long-term growth.

### 3. **Notes System** 📝
- **Smart Reflections**: Attach notes to any task. Ideal for capturing lesson snippets, technical challenges, or meeting bullets.
- **Categorized Thoughts**: Use specialized types like `AI Automation`, `DevOps`, `App Idea`, and `Social Media`.
- **Video-Specific Note Taking**: When taking notes on DevOps videos, the system automatically captures the **Source Video Name**, allowing you to build a structured knowledge base without manual tagging.
- **Visual Backlog**: Reflections are date-stamped and categorized with icons for easy scanning.

### 4. **Modern Design System** ✨
- **Premium Aesthetic**: A "Glassmorphism" inspired design with subtle translucency, deep shadows, and crisp typography.
- **Theme Engine**: A robust **Light/Dark Mode** switcher.
    - **Light Mode**: Professional, high-contrast, paper-white aesthetic with true black text.
    - **Dark Mode**: Deep midnight blues (`slate-950`) for focus and reduced eye strain.
- **Responsive Sidebar**: Quick-access navigation to Hub, Calendar, Notes, AI Tracker, Accounts, Documents, Task Chains, and Tutorial from any page.

### 5. **Freelance Client Mode** 🤝
- **Client Active Toggle**: A dedicated switch in the header for when you have an active contract.
- **Focus Shift**: When active, all `Freelancing` and `Lead` tasks are prioritized.
- **Pipeline Management**: Track leads, proposals, and active projects in a dedicated view.

---

### 6. **AI Tracker** 🧠

A dedicated command center for staying ahead of the AI curve.

#### **Resources to Check** (Horizontal Ticker)
- **Purpose**: Your weekly "check-in" list for high-value intelligence (Newsletters, X Accounts, YouTube Channels).
- **Horizontal Ticker**: Resources are displayed as scrollable cards at the top of the page for quick access.
- **Weekly Reset**: Toggle items as you check them. They automatically uncheck next week.
- **Add New Resource**: Click the **`+`** button to open a modal and add a resource (Name, URL, Type).
- **Edit Resource**: Hover over any card and click the **pencil icon (✏️)** to update its name, URL, or type.
- **Delete Resource**: Hover over any card and click the **trash icon** to permanently remove it (with confirmation).

#### **Quick Tool Capture** ⚡
- **Purpose**: Instantly save a new AI tool you discover without breaking flow.
- **Structured Data**: Record the **Tool Name**, **Official URL**, and **Notes** on what it does.
- **Auto-Integration**: Saving a tool automatically adds it to your **Discovery Log** and your **AI Toolbox** database.

#### **Note News Item** 📰
- **Purpose**: Quickly paste important news snippets or thoughts.
- **Actionable**: Saving a news note automatically creates a **Task** in your dashboard to "Check News," ensuring you never lose track of a lead.

#### **Recent History**
- A chronological feed of everything you've captured (Tools & News), with clear icons and links.

---

### 7. **Project Command Center** 🚀
- **Execution Engine**: A dedicated space to manage your shipping velocity.
- **Commit Streak Tracking**: Automatically tracks your GitHub activity streaks to build momentum.
- **Lifecycle Management**: Move projects from `Idea` -> `In Progress` -> `Deployment Ready` -> `Published`.
- **Flight Checks**: Automatic "Pre-Flight Checklists" appear when you mark a project as Ready, ensuring you never ship broken code.

### 8. **My Documents Vault** 📁
- **Secure Storage**: Keep your essential career documents in one place.
- **Multilingual Support**: Specialized slots for **English** and **French** CVs and Cover Letters.
- **Credentials**: Store Diplomas and Vendor Certifications (AWS, Docker, etc.).
- **Interactive Management**: Upload, download, and delete files instantly.

### 9. **Accounts Manager** 🔑
- **Purpose**: Centralize all your platform credentials and social accounts in one secure place.
- **Three Sections**: Accounts are organized into **Social Media**, **Professional** (freelance platforms), and **Opportunities & Portals** (job boards).
- **Credential Storage**: Store username, email, password, and a credential hint for each account.
- **Edit Credentials**: Click the **pencil icon (✏️)** on any account card to update all fields in an edit modal pre-filled with existing data.
- **Delete Account**: Click the **×** button (visible on hover) to remove an account after confirmation.
- **Activity Counters**: Increment/decrement post counts, proposal counts, and application counts directly from each card.
- **Credential Reveal**: Click the 👁️ icon to temporarily show a hidden password.

### 10. **Task Chains** ⛓️ *(New)*
- **Purpose**: A strategic reference page that documents your three core operating systems.
- **Three Master Chains**:
    - 🟣 **Authority Engine** — How you build online visibility through testing tools and posting insights.
    - 🟢 **Asset Engine** — How you build deep DevOps skills through structured learning (private, no posting).
    - 🟡 **Revenue Engine** — How you turn skills into freelance income through leads and proposals.
- **Interactive Execution Tracker**: Click **"Track Today →"** to access a live dashboard at `/task-chains/tracking` that:
    - Automatically calculates your progress based on completed tasks and notes.
    - Tracks Authority (AINews/Social), Asset (DevOps notes/tasks), and Revenue (Leads/Proposals).
    - Visualizes your last 7 days of strategic alignment.
    - Shows a "Full Strategic Day" 🔥 achievement when all 3 engines hit 100%.
- **Step-by-Step Workflows**: Each chain is broken into numbered step blocks with short, practical descriptions.
- **Strategic Connection**: A section showing how all 3 chains feed each other (Authority → Revenue → Asset → Authority).
- **Weekly Alignment Table**: Maps each day of the week to the chains it activates, with color-coded indicators.

---

## ⚙️ Data & Architecture

### **Cloud-Native Backend (Supabase)** ☁️
Unlike the previous local-only version, **VibeCode OS** is now fully cloud-enabled.
- **Database**: All data (Tasks, Notes, Tools, Resources, Accounts) is stored in a secure Postgres database via Supabase.
- **Real-Time Sync**: Changes to tasks or notes are saved instantly to the cloud.
- **Authentication**: Secure email/password login system protects your data.
- **Device Agnostic**: Log in from any device to access your productivity workspace.

### **Reference Data Files**
- **`data/weekly-calendar.json`**: A structured JSON export of your full weekly recurring task schedule. Contains all 7 days, each with a focus theme, task list, categories, priorities, and estimated time per task. Useful for seeding data or integrating with external tools.

### **Reliability**
- **UUID Generation**: All new entries generate a unique ID on the client-side before sync, ensuring zero conflicts and robust data capabilities.
- **Error Handling**: Visual feedback (toast notifications, red error borders) alerts you if a network request fails.

---

## 💡 Pro Tips
- **Master the Routine**: The "Expansion" zone stays locked until your daily routine is 100% complete. Master the basics first.
- **Capture Everything**: Use the **AI Tracker** to dump raw inputs (URLs, Tools) so you can process them later in your Dashboard tasks.
- **Timestamped Knowledge**: When watching DevOps videos, add notes with timestamps (e.g., `12:45`) to jump back to key concepts later.
- **Review Task Chains**: Visit the **Task Chains** page weekly to realign your daily work with the 3 strategic systems.
- **Keep Accounts Updated**: Use the Accounts Manager to store credentials so you never lose access to a platform mid-outreach.

---
*VibeCode OS. Build the Future.*
