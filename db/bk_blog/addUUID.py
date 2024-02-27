import os
import json
import uuid

def add_uuid_to_json_files(folder_path):
    # List all files in the folder
    files = os.listdir(folder_path)

    # Iterate through each file
    for file_name in files:
        if file_name.endswith('.json'):
            file_path = os.path.join(folder_path, file_name)

            # Open the JSON file and load its contents
            with open(file_path, 'r') as file:
                data = json.load(file)

            # Check if the file already has an ID
            if 'id' not in data or not data['id']:
                # Generate a UUID and assign it to the 'id' field
                data['id'] = str(uuid.uuid4())

                # Write the updated JSON back to the file
                with open(file_path, 'w') as file:
                    json.dump(data, file, indent=4)
                    print(f"Added UUID to {file_name}")

# Specify the folder path containing the JSON files
folder_path = '.'

# Call the function to add UUID to JSON files
add_uuid_to_json_files(folder_path)

