# Ergani Schedule Manager

A desktop application for managing employee schedules and integrating with the Ergani system.

![Application Screenshot](docs/screenshot.png)

## Features

- Create, edit, and manage employee schedules
- Submit schedule data directly to the Ergani system
- Generate reports and visualize employee work hours
- Export schedules to various formats (PDF, Excel, CSV)
- Dark and light theme support
- Cross-platform: Windows, macOS, and Linux

## Installation

### Windows

1. Download the latest Windows installer from the [releases page](https://github.com/programming-vasilis-48/ergani-tauri/releases).
2. Run the installer and follow the instructions.
3. The application will be installed and a shortcut will be created on your desktop.

### macOS

1. Download the latest macOS DMG file from the [releases page](https://github.com/programming-vasilis-48/ergani-tauri/releases).
2. Open the DMG file and drag the application to your Applications folder.
3. The first time you run the application, you may need to right-click the app and select "Open" to bypass macOS security restrictions.

### Linux

1. Download the latest AppImage file from the [releases page](https://github.com/programming-vasilis-48/ergani-tauri/releases).
2. Make the AppImage executable: `chmod +x Ergani-Schedule-Manager-*.AppImage`
3. Run the AppImage file: `./Ergani-Schedule-Manager-*.AppImage`

## Development

### Prerequisites

- Node.js 16 or later
- Rust and Cargo
- Python 3.7 or later

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/programming-vasilis-48/ergani-tauri.git
   cd ergani-tauri
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. To build the application for production:
   ```
   npm run build
   ```

### Building Installers

#### Windows

```
npm run build:windows
```

#### macOS

```
npm run build:macos
```

#### Linux

```
npm run build:linux
```

## Usage

1. **Initial Setup**: When you first launch the application, you'll need to configure your Ergani credentials.

2. **Creating Schedules**: Click the "New Schedule" button to create a new schedule. You can add employees and assign shifts.

3. **Managing Employees**: Use the "Employees" tab to add, edit, or remove employees.

4. **Submitting to Ergani**: Click the "Submit" button to send the schedule data to the Ergani system.

5. **Exporting Data**: Use the "Export" menu to export your schedules to various formats.

## Configuration

The application stores configuration data in the following locations:

- Windows: `%APPDATA%\ergani-schedule-manager\config.json`
- macOS: `~/Library/Application Support/ergani-schedule-manager/config.json`
- Linux: `~/.config/ergani-schedule-manager/config.json`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tauri](https://tauri.app/) - Framework for building desktop applications with web technologies
- [React](https://reactjs.org/) - Frontend framework
- [Python Flask](https://flask.palletsprojects.com/) - Backend API
- [SQLite](https://www.sqlite.org/) - Database 