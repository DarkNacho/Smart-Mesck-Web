import os
import json
import requests
from datetime import datetime, timedelta

API_URL = "https://castudillo-hapi.darknacho.software/fhir/Questionnaire"
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraXNpbmVnNTU2QGxvc3Z0bi5jb20iLCJpZCI6IjUiLCJyb2xlIjoiQWRtaW4iLCJuYW1lIjoiSnVhbiBDYXJsb3MgQm9kb3F1ZSIsImV4cCI6MTcyNjI3Mjk0OC42NTc5NDF9.SbZlEjvttPg8OyqaTou4Z2OYM-LL3T0hT1pLr35qveI"  # Replace with your actual token


def send_post_request(json_data):
    headers = {
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
    }
    response = requests.post(API_URL, headers=headers, json=json_data)
    return response


def main():
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_folder_path = script_dir  # JSON files are in the same directory as the script

    for filename in os.listdir(json_folder_path):
        if filename.endswith(".json"):
            file_path = os.path.join(json_folder_path, filename)
            try:
                with open(file_path, "r") as json_file:
                    json_data = json.load(json_file)
                    response = send_post_request(json_data)
                    print(f"Sent {filename}: {response.status_code}")
            except Exception as e:
                print(f"Failed to send {filename}: {e}")


if __name__ == "__main__":
    main()
