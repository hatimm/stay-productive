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
- **Responsive Sidebar**: Quick-access navigation to Hub, Calendar, Notes, AI Tracker, and Settings from any page.

### 5. **Freelance Client Mode** 🤝
- **Client Active Toggle**: A dedicated switch in the header for when you have an active contract.
- **Focus Shift**: When active, all `Freelancing` and `Lead` tasks are prioritized.
- **Pipeline Management**: Track leads, proposals, and active projects in a dedicated view.

---

### 6. **AI Tracker** 🧠 (New!)
A dedicated command center for staying ahead of the AI curve.

#### **Resources to Check** (Sidebar)
- **Purpose**: Your daily "check-in" list for high-value intelligence (Newsletters, X Accounts, YouTube Channels).
- **Weekly Reset**: Toggle items as you check them. They automatically uncheck next week.
- **Add New Resource**: Click the prominent **`+`** button to open a modal where you can add:
    - **Name**: e.g., "TLDR AI"
    - **URL**: Direct link to the source.
    - **Type**: Select from a dropdown (`Website`, `X Account`, `YouTube`, `Other`).

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

---

## ⚙️ Data & Architecture

### **Cloud-Native Backend (Supabase)** ☁️
Unlike the previous local-only version, **VibeCode OS** is now fully cloud-enabled.
- **Database**: All data (Tasks, Notes, Tools, Resources) is stored in a secure Postgres database via Supabase.
- **Real-Time Sync**: Changes to tasks or notes are saved instantly to the cloud.
- **Authentication**: Secure email/password login system protects your data.
- **Device Agnostic**: Log in from any device to access your productivity workspace.

### **Reliability**
- **UUID Generation**: All new entries generate a unique ID on the client-side before sync, ensuring zero conflicts and robust data capabilities.
- **Error Handling**: Visual feedback (toast notifications, red error borders) alerts you if a network request fails.

---

## 💡 Pro Tips
- **Master the Routine**: The "Expansion" zone stays locked until your daily routine is 100% complete. Master the basics first.
- **Capture Everything**: Use the **AI Tracker** to dump raw inputs (URLs, Tools) so you can process them later in your Dashboard tasks.
- **Timestamped Knowledge**: When watching DevOps videos, add notes with timestamps (e.g., `12:45`) to jump back to key concepts later.

---
*VibeCode OS. Build the Future.*
