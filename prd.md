# 🌤️ Weather Station Map App – PRD

## 📄 Overview
A web application that displays weather stations on an interactive map using Leaflet and Angular v18. When a marker is clicked, additional weather information will be shown in a modal window.

---

## ✅ Core Requirements

| Feature | Description |
|--------|-------------|
| **1. Map with Leaflet** | Integrate Leaflet.js to render a world map. |
| **2. Weather Station Markers** | Display markers on the map based on provided weather station data. |
| **3. Marker Clustering** | Use default Leaflet cluster grouping for nearby markers. |
| **4. Marker Interaction** | Clicking on a marker opens a modal with station-specific weather data. |
| **5. Weather Data Integration** | Fetch data from: <br>• [Open-Meteo API](https://api.open-meteo.com/v1/forecast) <br>• [Data.gov.sg API](https://api.data.gov.sg/v1/environment/2-hour-weather-forecast) |
| **6. Modal with Weather Info** | Show key data such as temperature, humidity, radiation, and basic timeseries graph in modal. |

---

## 🌟 Bonus Features

| Bonus Feature | Description |
|---------------|-------------|
| **1. Responsive UI** | Ensure the application is mobile-friendly and works across various screen sizes. |
| **2. Autocomplete Search** | Add a search bar to allow location/station autocomplete. On selection, pan the map to the relevant marker. |
| **3. Mini-Map in Modal** | Display a small embedded map (satellite view) of the station inside the modal. |
| **4. Marker Highlighting** | Highlight active/selected marker with visual effect. |
| **5. Smooth Animations** | Animate modal opening and chart transitions for better UX. |

---

## 🛠️ Tech Stack

- **Frontend Framework**: Angular v18
- **Map Engine**: Leaflet.js
- **UI Libraries** (optional): Angular Material, Chart.js, ngx-charts
- **Data Sources**:
  - Open-Meteo: `https://api.open-meteo.com/v1/forecast`
  - Data.gov.sg: `https://api.data.gov.sg/v1/environment/2-hour-weather-forecast`

---

## 📎 Notes

- Default marker and cluster icons can be used.
- Minimal styling is acceptable for core features.
- Aim for readable, maintainable, and modular Angular component structure.

---

## 📈 Success Criteria

- Map loads and displays all weather stations successfully.
- Clicking on any marker opens a modal with accurate weather data from both APIs.
- Code is clean, readable, and logically structured.
- Bonus features, if implemented, enhance usability but are not required for completion.

---
