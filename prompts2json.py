import os
import json

def scan_folder(folder_path):
    files_data = []
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                files_data.append({
                    "filename": filename,
                    "content": content
                })
    return files_data

def save_to_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    folder_path = './prompts'
    output_file = 'prompts.json'
    files_data = scan_folder(folder_path)
    save_to_json(files_data, output_file)
    print(f"Data has been saved to {output_file}")
