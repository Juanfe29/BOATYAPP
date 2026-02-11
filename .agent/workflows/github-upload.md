---
description: How to push the ISOMORPH AI project to GitHub
---

Follow these steps to upload your code to GitHub:

### 1. Create a Repository on GitHub
1. Log in to [GitHub](https://github.com/).
2. Click the **+** icon in the top right and select **New repository**.
3. Name it `isomorph-ai` (or your preferred name).
4. Keep it **Public** or **Private**.
5. **DO NOT** initialize with README, license, or gitignore (we already have those).
6. Click **Create repository**.

### 2. Connect and Push
Copy the following commands and run them in your terminal (I have already committed your changes):

```bash
# Add your GitHub repository link (replace <your-username>)
git remote add origin https://github.com/<your-username>/isomorph-ai.git

# Rename branch to main (if not already)
git branch -M main

# Push your code
git push -u origin main
```

### 3. Future Updates
Whenever you make more changes:
```bash
git add .
git commit -m "Description of your changes"
git push
```
