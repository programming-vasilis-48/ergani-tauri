import sys
import json
from gen_info import gen_info
from contextlib import redirect_stdout
import io

if __name__ == "__main__":
    # Write debug info to stderr
    sys.stderr.write("-------------Get Gen Info start-------------\n")
    
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        sys.exit(1)
        
    usernameInfo = sys.argv[1]
    passwordInfo = sys.argv[2]
    
    # Capture any extra prints from gen_info() into a buffer
    buffer = io.StringIO()
    with redirect_stdout(buffer):
        employer_data, branch_data = gen_info(usernameInfo, passwordInfo)
    # Optionally, you can log captured output to stderr:
    captured = buffer.getvalue()
    if captured:
        sys.stderr.write("Captured output from gen_info: " + captured + "\n")
    
    # Retrieve the company name from employer_data
    if employer_data:
        key = list(employer_data.keys())[0]
        company_name = employer_data[key].get("Eponimia", "Ergani Schedule")
    else:
        company_name = "Ergani Schedule"
    
    # Print only the JSON output (with Greek characters correctly encoded)
    print(json.dumps({"companyName": company_name}, ensure_ascii=False))
