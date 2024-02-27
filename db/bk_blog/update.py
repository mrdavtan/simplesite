import os
import json

def update_json_structure(directory):
    # List all files in the directory
    files = os.listdir(directory)

    # Iterate through each file
    for file_name in files:
        if file_name.endswith('.json'):
            file_path = os.path.join(directory, file_name)

            # Read the contents of the JSON file
            with open(file_path, 'r') as file:
                data = json.load(file)

            # Update the JSON structure
            updated_data = {
                "id": data.get("id", ""),
                "title": data.get("title", ""),
                "description": data.get("description", ""),
                "publishedDate": data.get("publishedDate", ""),
                "lastUpdatedDate": data.get("lastUpdatedDate", ""),
                "content": data.get("content", ""),
                "author": {
                    "name": data.get("author", {}).get("name", ""),
                    "bio": data.get("author", {}).get("bio", ""),
                    "profileUrl": data.get("author", {}).get("profileUrl", "")
                },
                "seo": {
                    "metaTitle": data.get("seo", {}).get("metaTitle", ""),
                    "metaDescription": data.get("seo", {}).get("metaDescription", ""),
                    "focusKeywords": data.get("seo", {}).get("focusKeywords", []),
                    "slug": data.get("seo", {}).get("slug", ""),
                    "keywords": data.get("seo", {}).get("keywords", []),
                    "updateFrequency": data.get("seo", {}).get("updateFrequency", ""),
                    "contentLength": data.get("seo", {}).get("contentLength", 0),
                    "pageSpeedScore": data.get("seo", {}).get("pageSpeedScore", 0),
                    "bounceRate": data.get("seo", {}).get("bounceRate", 0),
                    "timeOnPage": data.get("seo", {}).get("timeOnPage", 0),
                    "mobileFriendliness": data.get("seo", {}).get("mobileFriendliness", False),
                    "structuredDataImplemented": data.get("seo", {}).get("structuredDataImplemented", False)
                },
                "tags": data.get("tags", []),
                "categories": data.get("categories", []),
                "images": [{
                    "imageUrl": data.get("imageUrl", ""),
                    "altText": data.get("altText", ""),
                    "imageTitle": data.get("imageTitle", ""),
                    "imageDescription": data.get("imageDescription", ""),
                    "caption": data.get("caption", "")
                }],
                "comments": data.get("comments", []),
                "relatedPosts": data.get("relatedPosts", []),
                "externalLinks": data.get("externalLinks", []),
                "internalLinks": data.get("internalLinks", []),
                "contentGraph": data.get("contentGraph", {"nodes": [], "edges": []}),
                "versioning": data.get("versioning", {"hash": "", "versionNumber": "", "versionDate": "", "changelog": ""})
            }

            # Write the updated JSON back to the file
            with open(file_path, 'w') as file:
                json.dump(updated_data, file, indent=4)

            print(f"Updated structure of {file_name}")

# Specify the folder path containing the JSON files
folder_path = '.'

# Call the function to update JSON file structures
update_json_structure(folder_path)

