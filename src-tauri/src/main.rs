// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;
use tauri::Manager;
use std::env;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn run_python(params: serde_json::Value) -> Result<serde_json::Value, String> {
    // Get the project root directory (where Cargo.toml is located)
    let current_dir = env::current_dir()
        .map_err(|e| e.to_string())?;
    
    // Go up one level to reach the project root (from src-tauri to project root)
    let project_root = current_dir
        .parent()
        .ok_or("Failed to get project root")?
        .to_path_buf();

    // Construct the path to the Python script
    let script_path = if cfg!(debug_assertions) {
        // In development, use the backend directory in the project root
        project_root.join("backend").join("main.py")
    } else {
        // In production, use the bundled backend directory next to the executable
        std::env::current_exe()
            .map_err(|e| e.to_string())?
            .parent()
            .ok_or("Failed to get executable directory")?
            .join("backend")
            .join("main.py")
    };

    println!("Using Python script at: {:?}", script_path);

    // Execute Python script with parameters
    let output = Command::new("python")
        .arg(&script_path)
        .args(&[
            params["usernameInfo"].as_str().unwrap_or(""),
            params["passwordInfo"].as_str().unwrap_or(""),
            params["usernameSchedule"].as_str().unwrap_or(""),
            params["passwordSchedule"].as_str().unwrap_or(""),
            params["start_date"].as_str().unwrap_or(""),
            params["end_date"].as_str().unwrap_or(""),
            params["output_dir"].as_str().unwrap_or(""),
            if params["remove_future"].as_bool().unwrap_or(false) { "true" } else { "false" },
            if params["remove_dayoff"].as_bool().unwrap_or(false) { "true" } else { "false" },
        ])
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    println!("Python stdout: {}", stdout);
    println!("Python stderr: {}", stderr);

    if !output.status.success() {
        return Err(format!("Python script failed: {}", stderr));
    }

    // Try to parse the output as JSON
    match serde_json::from_str(&stdout) {
        Ok(json) => Ok(json),
        Err(e) => Err(format!(
            "Failed to parse Python output as JSON: {}. Output was: {}",
            e,
            stdout
        )),
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_window("main").unwrap().open_devtools();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![run_python])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
