import sys
import json
from datetime import datetime
from gen_info import gen_info
from schedule import run_scheduler
from preprocess_planned import preprocess_planned_timetable
from preprocess_actual import process_timetable
from combiner import combine
from summary import summary_and_save

if __name__ == "__main__":
    if len(sys.argv) < 10:
        print("Missing arguments")
        sys.exit(1)
    usernameInfo = sys.argv[1]
    passwordInfo = sys.argv[2]
    usernameSchedule = sys.argv[3]
    passwordSchedule = sys.argv[4]
    start_date = sys.argv[5]
    end_date = sys.argv[6]
    output_dir = sys.argv[7]
    # Convert arguments 8 and 9 to booleans
    remove_future = sys.argv[8].lower() in ("true", "1", "yes")
    remove_dayoff = sys.argv[9].lower() in ("true", "1", "yes")
    output_folder_dir = "excel"
    output_dir = f"{output_dir}/{output_folder_dir}"

    # Use a common timestamp for file names
    timestamp = datetime.now().strftime('%d%m')

    employer_data, branch_data = gen_info(usernameInfo, passwordInfo)
    print(employer_data, branch_data)
    planned_file, actual_file = run_scheduler(output_dir, usernameSchedule, passwordSchedule, start_date, end_date)
    planned_data = preprocess_planned_timetable(planned_file)
    actual_data = process_timetable(actual_file)
    combined_file_path = f"{output_dir}/compared_{timestamp}.xlsx"
    # combine() must now accept remove_future and remove_dayoff parameters and filter rows accordingly.
    combined_data = combine(planned_data, actual_data, remove_future, remove_dayoff, combined_file_path)
    summary_file_path = f"{output_dir}/summary_{timestamp}.xlsx"
    summary_dict = summary_and_save(combined_data, summary_file_path)

    # Return only the file paths (not the full JSON data)
    output_data = {
        "combined_excel": combined_file_path,
        "summary_excel": summary_file_path
    }
    print(json.dumps(output_data, ensure_ascii=False))



# PLANNED INPUT EXAMPLE
#branch	afm	        last_name	first_name	date	    clock_in	        clock_out	        break	    work
#0	    025127328	ΠΑΠΑΔΑΚΗΣ	ΓΕΩΡΓΙΟΣ	2025-02-03	2025-02-03T08:00:00	2025-02-03T16:00:00	Outside 20	WORKING

# ACTUAL INPUT EXAMPLE
#afm	    last_name	first_name	clock_in	    clock_out
#035882679	ΑΓΓΕΛΗ	    ΑΝΘΗ	    2025-02-03T07:51:00	2025-02-03T16:20:00




# OUTPUT EXAMPLE
#AFM	    Branch	Last Name	First Name	Planned Start (ISO)	    Actual Start (ISO)	Planned End (ISO)	    Actual End (ISO)	    Break	    Schedule Start Date	    Schedule Start Time	    Schedule End Date	Schedule End Time	    Actual Start Date	Actual Start Time	Actual End Date	    Actual End Time	    Start Diff	Finish Diff	Summary	            Severity	Planned Hours	Planned Night Hours	Planned Sunday Hours
#035882679	0	    ΑΓΓΕΛΗ	    ΑΝΘΗ	    2025-02-03T08:00:00	    2025-02-03T07:51:00	2025-02-03T16:00:00	    2025-02-03T16:20:00	    Outside 20	2025-02-03	            08:00	                2025-02-03	        16:00	                2025-02-03	        07:51	            2025-02-03	        16:20	            +00:09	    +00:00	    Total diff: +00:09	Low	        8	            0	                0
