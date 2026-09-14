import os
import re

replacements = [
    # Exact cases
    ("Zargigs Technologies", "DocsZar Technologies"),
    ("zargigstechnologies@gmail.com", "contactdocszar@gmail.com"),
    ("contactzargigs@gmail.com", "contactdocszar@gmail.com"),
    ("contactgigsflix@gmail.com", "contactdocszar@gmail.com"),
    ("gigsflixtechnologies@gmail.com", "contactdocszar@gmail.com"),
    ("ZARGIGS ENTERPRISE", "DOCSZAR ENTERPRISE"),
    ("ZARGIGS", "DOCSZAR"),
    ("Zargigs", "DocsZar"),
    ("zargigs", "docszar"),
    ("GigsFlix", "DocsZar"),
    ("Gigsflix", "DocsZar"),
    ("gigsflix.com", "docszar.com"),
    ("zargigs.com", "docszar.com"),
]

def update_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        orig_content = content
        for old, new in replacements:
            content = content.replace(old, new)
            
        if orig_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error updating {filepath}: {e}")

targets = ["frontend", "supabase"]
for target in targets:
    for root, dirs, files in os.walk(target):
        if "node_modules" in dirs:
            dirs.remove("node_modules")
        if "dist" in dirs:
            dirs.remove("dist")
        if ".git" in dirs:
            dirs.remove(".git")
        for file in files:
            if file.endswith((".jsx", ".js", ".html", ".json", ".sql", ".ts", ".md", ".css")):
                update_file(os.path.join(root, file))

print("Completed renaming to DocsZar.")
