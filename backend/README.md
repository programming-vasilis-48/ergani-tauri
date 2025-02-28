# Ergani Backend - System Documentation

## Overview
This backend system automates the process of retrieving, processing, and comparing employee work schedules from the Ergani system (Greek workforce management system). It compares planned schedules with actual work times and generates summary reports.

## Setup Instructions
1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Make sure `.env` file is properly configured with necessary credentials

## Core Files and Their Functions

### main.py
The main entry point that orchestrates the entire workflow. It sequentially calls other modules to:
- Retrieve company information
- Download work schedules (planned and actual)
- Process and compare the schedules
- Generate summary reports

### gen_info.py
Downloads company information in JSON format and stores it in the `company_info` folder. Retrieves essential data about the employer and branches.

### get_gen_info.py
A simplified version of gen_info.py that retrieves only basic company information, used by the frontend.

### schedule.py
Downloads employee work schedules from the Ergani system, both planned and actual schedules.

### preprocess_planned.py
Processes the raw planned schedule data, formatting and structuring it for later comparison.

### preprocess_actual.py
Similar to preprocess_planned.py but for actual recorded work times. Processes the raw data into a consistent format.

### combiner.py
The core comparison engine that compares planned schedules against actual work times. Generates the `comparedTimetable.xlsx` file highlighting discrepancies and issues.

### summary.py
Creates summary reports of employee work up to the current time in the month. Generates the `summaryTimetable.xlsx` file with aggregated statistics.

### utils.py
Contains utility functions used across multiple modules, such as date handling, data formatting, and common operations.

### argies.py
Handles Greek holidays and non-working days, ensuring these are properly accounted for in schedule processing.

### remove_rows.py
Utility for filtering out certain rows from the data based on specific criteria.

### excel_to_json.py
Converts Excel data to JSON format for easier processing.

### types.json
Contains type definitions and data structures used throughout the system.

## Output Files
- `compared_*.xlsx`: Detailed comparison between planned and actual schedules
- `summary_*.xlsx`: Summary statistics for each employee's work

## Workflow
The system follows a sequential workflow:
1. Retrieve company information
2. Download schedules
3. Preprocess both planned and actual schedules
4. Compare the schedules and identify discrepancies
5. Generate summary reports

This automation significantly reduces manual effort in workforce management and compliance reporting.
