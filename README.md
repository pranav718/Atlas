
<!-- markdownlint-disable MD033 MD051 -->
<div align="center">

# UniWay – MUJ Campus Navigation


### Transforming MUJ Campus Maps into Seamless Navigational Experiences


[![GitHub last commit](https://img.shields.io/github/last-commit/aetosdios27/Atlas_?style=for-the-badge&logo=github&labelColor=333)](https://github.com/aetosdios27/Atlas_)
![GitHub top language](https://img.shields.io/github/languages/top/aetosdios27/Atlas_?style=for-the-badge&color=blue&labelColor=333)
![GitHub language count](https://img.shields.io/github/languages/count/aetosdios27/Atlas_?style=for-the-badge&color=blueviolet&labelColor=333)

---

[**Live Demo 🚀**](https://atlas-dn8h.vercel.app/)
<br>
⚠ **Disclaimer:** Optimized for **PC/Desktop displays** only — mobile and tablet layouts may not display correctly.


</div>

---

## 📌 Table of Contents
- [Overview](#overview)
- [Current Features](#current-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
- [Planned Roadmap](#planned-roadmap)
- [Team](#team)
- [Disclaimer](#disclaimer)
- [Feedback](#feedback)

---

## Overview

**UniWay** is a campus navigation web application built specifically for **Manipal University Jaipur (MUJ)**.  
This is the **first public demo release**, aimed at showcasing the core navigation experience and setting the stage for future enhancements.  

UniWay provides MUJ students, faculty, and visitors with an **interactive campus map**, **real-time search**, and **dynamic location information** — all powered by a modern, scalable architecture.

---

## Current Features

### 🗺️ Core Navigation & Mapping
- **Interactive Campus Map:** Smooth panning and zooming with Leaflet for exploring MUJ.
- **Dynamic Location Markers:** Key campus locations fetched from a live backend API, with clickable details.
- **Simple Path Routing:** Proof-of-concept path display from current location to destination.

### 🔍 Search & Discovery
- **Real-time Predictive Search:** Instant, case-insensitive suggestions while typing.
- **Location Cards:** Curated list of important places, complete with images and key details.

### ⏱ Real-time Information
- **Live Location Status:** Data served from a central API for up-to-date hours and open/closed status.
- **Decoupled Architecture:** Backend updates instantly reflected without requiring user updates.

---

## Technology Stack

### 🖥 Frontend
- **Next.js (React Framework):** High performance, file-based routing, and serverless capabilities.
- **TypeScript:** Strict typing for error prevention and maintainable code.
- **Tailwind CSS:** Utility-first styling for rapid, responsive UI development.
- **Leaflet.js:** Lightweight, open-source mapping with custom markers and layers.

### ⚙ Backend & Data
- **Next.js API Routes:** Serverless endpoints that scale automatically with Vercel.
- **JSON (Prototype Data) → MongoDB (Planned):** Easy migration path from static data to a live database with admin panel management.

### 🚀 Deployment
- **Vercel:** CI/CD pipeline — every `git push` deploys a new live build automatically.

---

## Getting Started

### Prerequisites
- **Programming Language:** TypeScript  
- **Package Manager:** npm

### Installation

```bash
# Clone the repository

git clone https://github.com/aetosdios27/Atlas_

# Navigate to the project folder
cd Atlas_

# Install dependencies
npm install

### Usage

```bash
npm start
```

### Testing

```bash
npm test
```


## Planned Roadmap

- Mobile and tablet optimization
- Turn-by-turn navigation
- Indoor navigation for academic blocks
- Event location tagging
- Live route ETA calculations
- Admin panel for real-time campus data updates

---

## Team

**Team Name:** Atlas

**Members:**

- Manavi Mutyalwar
- Pushpendra Singh
- Pranav Ray
- Akshat Singh

---

## Disclaimer

UniWay is **currently optimized for PC/Desktop displays**.
Mobile and tablet support is planned for a future release.
This is the **first demo release** — expect some limitations as we collect feedback and refine features.

---

## Feedback

## Feedback

If you are part of MUJ and testing UniWay:

- **Report Bugs:** [GitHub Issues](https://github.com/aetosdios27/Atlas_/issues)
- **Feature Suggestions:** Create a new issue with the `enhancement` label
- **Contact Dev Team:** Open a discussion in the GitHub Discussions tab

---

↑ [**Back to Top**](#uniway--muj-campus-navigation)


