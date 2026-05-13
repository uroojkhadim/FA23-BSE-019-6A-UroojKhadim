import os

replacements = {
    "blue-50": "sky-50",
    "blue-100": "sky-100",
    "blue-200": "sky-200",
    "blue-300": "sky-300",
    "blue-400": "sky-400",
    "blue-500": "sky-500",
    "blue-600": "sky-600",
    "blue-700": "sky-700",
    "blue-800": "sky-800",
    "blue-900": "sky-900",
    "emerald-50": "sky-50",
    "emerald-100": "sky-100",
    "emerald-200": "sky-200",
    "emerald-300": "sky-300",
    "emerald-400": "sky-400",
    "emerald-500": "sky-500",
    "emerald-600": "sky-600",
    "emerald-700": "sky-700",
    "emerald-800": "sky-800",
    "emerald-900": "sky-900",
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
            
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated: {file_path}")
