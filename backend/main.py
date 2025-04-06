import sys
import json
import logging
import warnings
import os
import ctypes
from ctypes import wintypes
from pathlib import Path, PureWindowsPath
from datetime import datetime
from gen_info import gen_info
from schedule import run_scheduler
from preprocess_planned import preprocess_planned_timetable
from preprocess_actual import process_timetable
from combiner import combine
from summary import summary_and_save
import pandas as pd

# Suppress openpyxl warnings
warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='ergani_scheduler.log',
    encoding='utf-8'
)

def get_short_path_name(long_name):
    """Get the short path name (8.3) for a given long path."""
    try:
        # Initialize buffer with enough space
        buffer = ctypes.create_unicode_buffer(wintypes.MAX_PATH)
        # Get the short path name
        GetShortPathNameW = ctypes.windll.kernel32.GetShortPathNameW
        GetShortPathNameW(str(long_name), buffer, wintypes.MAX_PATH)
        return buffer.value
    except Exception as e:
        logging.error(f"Error getting short path for {long_name}: {e}")
        return str(long_name)

def normalize_path(path):
    """Convert a path to a proper Windows path with Unicode support."""
    try:
        # Convert to absolute path
        abs_path = os.path.abspath(path)
        # Get the short path name for the absolute path
        short_path = get_short_path_name(abs_path)
        # Convert to forward slashes for consistency
        return short_path.replace('\\', '/')
    except Exception as e:
        logging.error(f"Error normalizing path {path}: {e}")
        return path.replace('\\', '/')

def ensure_directory(path):
    """Create directory if it doesn't exist, handling Unicode paths."""
    try:
        # Convert to absolute path
        abs_path = os.path.abspath(path)
        # Create directory using the absolute path
        os.makedirs(abs_path, exist_ok=True)
        # Return the short path name
        return get_short_path_name(abs_path)
    except Exception as e:
        logging.error(f"Error creating directory {path}: {e}")
        raise

def read_excel_to_json(file_path):
    try:
        # Get short path name for Excel file
        short_path = get_short_path_name(file_path)
        df = pd.read_excel(short_path)
        # Convert DataFrame to dict and handle NaN values
        records = df.replace({pd.NA: None}).to_dict(orient='records')
        # Convert all values to strings to ensure proper JSON serialization
        for record in records:
            record.update({k: str(v) if pd.notna(v) else None for k, v in record.items()})
        return records
    except Exception as e:
        logging.error(f"Error reading Excel file {file_path}: {e}")
        return []

if __name__ == "__main__":
    try:
        if len(sys.argv) < 10:
            raise ValueError("Missing arguments")

        usernameInfo = sys.argv[1]
        passwordInfo = sys.argv[2]
        usernameSchedule = sys.argv[3]
        passwordSchedule = sys.argv[4]
        start_date = sys.argv[5]
        end_date = sys.argv[6]
        output_dir = sys.argv[7]
        remove_future = sys.argv[8].lower() in ("true", "1", "yes")
        remove_dayoff = sys.argv[9].lower() in ("true", "1", "yes")
        
        # Create directory structure with proper path handling
        base_dir = ensure_directory(output_dir)
        excel_dir = ensure_directory(os.path.join(base_dir, "excel"))
        data_dir = ensure_directory(os.path.join(excel_dir, "data"))
        
        # Use a common timestamp for file names
        timestamp = datetime.now().strftime('%d%m')

        # Get employer and branch data
        employer_data, branch_data = gen_info(usernameInfo, passwordInfo)
        logging.info(f"Employer data: {employer_data}")
        logging.info(f"Branch data: {branch_data}")

        # Run the scheduler
        planned_file, actual_file = run_scheduler(excel_dir, usernameSchedule, passwordSchedule, start_date, end_date)
        logging.info(f"Downloaded files: {planned_file}, {actual_file}")

        # Process the files
        planned_data = preprocess_planned_timetable(planned_file)
        actual_data = process_timetable(actual_file)

        # Combine the data
        combined_file_path = os.path.join(excel_dir, f"compared_{timestamp}.xlsx")
        combined_data = combine(planned_data, actual_data, remove_future, remove_dayoff, combined_file_path)

        # Generate summary
        summary_file_path = os.path.join(excel_dir, f"summary_{timestamp}.xlsx")
        summary_dict = summary_and_save(combined_data, summary_file_path)

        # Read Excel files into JSON format
        combined_json = read_excel_to_json(combined_file_path)
        summary_json = read_excel_to_json(summary_file_path)

        # Save data to JSON files
        combined_json_path = os.path.join(data_dir, f"combined_{timestamp}.json")
        summary_json_path = os.path.join(data_dir, f"summary_{timestamp}.json")

        # Write JSON files with proper encoding
        with open(combined_json_path, 'w', encoding='utf-8') as f:
            json.dump(combined_json, f, ensure_ascii=False, indent=2)

        with open(summary_json_path, 'w', encoding='utf-8') as f:
            json.dump(summary_json, f, ensure_ascii=False, indent=2)

        # Return file paths using normalized paths
        output_data = {
            "combined_excel": normalize_path(combined_file_path),
            "summary_excel": normalize_path(summary_file_path),
            "combined_json": normalize_path(combined_json_path),
            "summary_json": normalize_path(summary_json_path)
        }

        # Print only the file paths as JSON
        print(json.dumps(output_data, ensure_ascii=False))

    except Exception as e:
        logging.error(f"Error in main: {str(e)}")
        error_json = json.dumps({"error": str(e)}, ensure_ascii=False)
        sys.stdout.buffer.write(error_json.encode('utf-8'))
        sys.stdout.buffer.write(b'\n')
        sys.exit(1)



# PLANNED INPUT EXAMPLE
#branch	afm	        last_name	first_name	date	    clock_in	        clock_out	        break	    work
#0	    025127328	ΠΑΠΑΔΑΚΗΣ	ΓΕΩΡΓΙΟΣ	2025-02-03	2025-02-03T08:00:00	2025-02-03T16:00:00	Outside 20	WORKING

# ACTUAL INPUT EXAMPLE
#afm	    last_name	first_name	clock_in	    clock_out
#035882679	ΑΓΓΕΛΗ	    ΑΝΘΗ	    2025-02-03T07:51:00	2025-02-03T16:20:00




# OUTPUT EXAMPLE
#AFM	    Branch	Last Name	First Name	Planned Start (ISO)	    Actual Start (ISO)	Planned End (ISO)	    Actual End (ISO)	    Break	    Schedule Start Date	    Schedule Start Time	    Schedule End Date	Schedule End Time	    Actual Start Date	Actual Start Time	Actual End Date	    Actual End Time	    Start Diff	Finish Diff	Summary	            Severity	Planned Hours	Planned Night Hours	Planned Sunday Hours
#035882679	0	    ΑΓΓΕΛΗ	    ΑΝΘΗ	    2025-02-03T08:00:00	    2025-02-03T07:51:00	2025-02-03T16:00:00	    2025-02-03T16:20:00	    Outside 20	2025-02-03	            08:00	                2025-02-03	        16:00	                2025-02-03	        07:51	            2025-02-03	        16:20	            +00:09	    +00:00	    Total diff: +00:09	Low	        8	            0	                0
