import sys
import json
from bs4 import BeautifulSoup

def extract_plain_text_from_json(json_file):
    with open(json_file, 'r') as f:
        data = json.load(f)
        if 'content' in data:
            html_content = data['content']
            soup = BeautifulSoup(html_content, 'html.parser')
            text_content = soup.get_text(separator="\n", strip=True)
            print(text_content)
        else:
            print("No 'content' key found in the JSON file.")

if __name__ == "__main__":
    # Check if a filename is provided as an argument
    if len(sys.argv) < 2:
        print("Usage: python script_name.py <json_file>")
        sys.exit(1)

    # Get the filename from command-line arguments
    json_file = sys.argv[1]

    # Call the function to extract and print plain text content
    extract_plain_text_from_json(json_file)

