import pandas as pd
import json

def excel_to_json(input_file, output_file):
    """
    Converts an Excel file to JSON format.

    :param input_file: Path to the input Excel file
    :param output_file: Path to save the output JSON file
    """
    try:
        # Read the Excel file into a DataFrame
        df = pd.read_excel(input_file, dtype=str)  # Read all columns as strings to preserve data
        
        # Convert the DataFrame to a list of dictionaries
        data = df.to_dict(orient="records")
        
        # Write the data to a JSON file
        with open(output_file, "w", encoding="utf-8") as json_file:
            json.dump(data, json_file, ensure_ascii=False, indent=4)
        
        print(f"Excel file '{input_file}' successfully converted to JSON and saved to '{output_file}'.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
input_excel_file = "expectedTimetable.xlsx"  # Replace with your Excel file path
output_json_file = "expectedSchedule.json"  # Replace with your desired JSON file path

excel_to_json(input_excel_file, output_json_file)
