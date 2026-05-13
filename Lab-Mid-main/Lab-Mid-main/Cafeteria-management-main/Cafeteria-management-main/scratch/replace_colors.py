import os
import re

replacements = {
    "#006633": "#0ea5e9",
    "#004d26": "#0284c7",
    "#003300": "#0c4a6e",
    "green-50": "sky-50",
    "green-100": "sky-100",
    "green-200": "sky-200",
    "green-300": "sky-300",
    "green-400": "sky-400",
    "green-500": "sky-500",
    "green-600": "sky-600",
    "green-700": "sky-700",
    "green-800": "sky-800",
    "green-900": "sky-900",
}

src_dir = r"d:\GitHub\FA23-BSE-019-6A-UroojKhadim\Lab-Mid-main\Lab-Mid-main\Cafeteria-management-main\Cafeteria-management-main\src"

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".tsx", ".ts", ".css")):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                # Also handle case variations if any
                new_content = new_content.replace(old.upper(), new)
            
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated: {file_path}")
