import os
import glob

directory = r"c:\Users\User\Desktop\Jupid 2\backend\app\services"
files = glob.glob(os.path.join(directory, "*.py"))
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    if "gemini-2.5-flash" in content:
        new_content = content.replace("gemini-2.5-flash", "gemini-1.5-flash")
        with open(file, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Reverted in {file}")
