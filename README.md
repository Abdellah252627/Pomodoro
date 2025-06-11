# Pomodoro Technique Web Application

A comprehensive Pomodoro Technique web application built with HTML, CSS, and vanilla JavaScript to help students and professionals manage their time effectively.

## Features

### Core Pomodoro Timer
- Customizable timer with default settings of 25 minutes work/5 minutes break
- Visual and audio notifications when sessions end
- Option to customize session lengths (e.g., 45 min work/10 min break)
- Clear visual indication of current session type (work or break)

### Task Management System
- Add, edit, and delete tasks
- Associate tasks with estimated Pomodoro sessions
- Track completion status with visual indicators
- Prioritization functionality

### Statistics Dashboard
- Daily and weekly session tracking
- Visual charts showing productivity patterns
- Task completion metrics
- Data export capability (CSV format)

### User-Friendly Interface
- Clean, distraction-free design with calming colors
- Support for Arabic language with RTL text formatting
- Dark mode toggle for reduced eye strain
- Responsive design for all device sizes

### Additional Features
- Browser notifications for session starts/ends
- Local storage for data persistence
- Built-in guidance for Pomodoro technique beginners
- Focus mode to minimize distractions

## Technical Details

- Built with pure HTML, CSS, and vanilla JavaScript (no frameworks)
- Uses Chart.js for statistics visualization
- Implements responsive design principles
- Uses browser storage for saving user preferences and data
- Supports internationalization (English and Arabic)

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start using the Pomodoro timer to boost your productivity!

## Browser Compatibility

This application is compatible with modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Project Structure

```
pomodoro/
├── index.html              # Main HTML file
├── css/                    # CSS styles
│   ├── main.css            # Main stylesheet
│   ├── dark-mode.css       # Dark mode styles
│   └── rtl.css             # RTL support for Arabic
├── js/                     # JavaScript files
│   ├── app.js              # Main application logic
│   ├── timer.js            # Timer functionality
│   ├── tasks.js            # Task management
│   ├── statistics.js       # Statistics tracking
│   ├── settings.js         # User preferences
│   ├── notifications.js    # Browser notifications
│   ├── storage.js          # Local storage management
│   └── i18n.js             # Internationalization
└── assets/                 # Assets
    ├── sounds/             # Audio notifications
    ├── images/             # Icons and UI elements
    └── fonts/              # Custom fonts
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Chart.js](https://www.chartjs.org/) for statistics visualization
- [Font Awesome](https://fontawesome.com/) for icons
- [The Pomodoro Technique®](https://francescocirillo.com/pages/pomodoro-technique) by Francesco Cirillo
