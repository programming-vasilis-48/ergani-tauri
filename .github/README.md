# TimeShift - Ergani Schedule Manager

A modern desktop application for managing employee schedules and integrating with the Ergani system in Greece.

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/programming-vasilis-48/TimeShift)](https://github.com/programming-vasilis-48/TimeShift/releases)
[![GitHub license](https://img.shields.io/github/license/programming-vasilis-48/TimeShift)](https://github.com/programming-vasilis-48/TimeShift/blob/main/LICENSE)

![TimeShift App Screenshot](../docs/images/screenshot.png)

## 🚀 Features

- **📅 Schedule Management**: Create, edit, and manage employee schedules with an intuitive interface
- **🔄 Ergani Integration**: Submit data directly to the Ergani system with a single click
- **📊 Reporting**: Generate comprehensive reports on employee work hours, absences, and more
- **📤 Data Export**: Export schedules to PDF, Excel, and CSV formats
- **🔄 Auto Updates**: Always stay up-to-date with the latest features and improvements
- **🌙 Dark Mode**: Choose between light and dark themes for comfortable use in any environment

## 💻 Installation

Visit our [download page](https://programming-vasilis-48.github.io/TimeShift/public/download.html) to get the latest version for your platform:

- **Windows**: Download and run the installer (.exe)
- **macOS**: Download the .dmg file and drag to Applications
- **Linux**: Download the AppImage

## 📖 Documentation

For detailed documentation, including setup guides and API references, visit our [documentation site](https://programming-vasilis-48.github.io/TimeShift/docs/).

## 🛠️ Development

### Prerequisites

- Node.js 16+
- Rust and Cargo
- Python 3.7+

### Setup

```bash
# Clone the repository
git clone https://github.com/programming-vasilis-48/TimeShift.git
cd TimeShift

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build for all platforms
npm run build:all

# Or build for specific platform
npm run build:windows
npm run build:macos
npm run build:linux
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE.txt) file for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - Framework for building desktop applications
- [React](https://reactjs.org/) - Frontend framework
- [Python Flask](https://flask.palletsprojects.com/) - Backend API
- [SQLite](https://www.sqlite.org/) - Database 