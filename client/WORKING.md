FULL WORKFLOW — ALL COMMANDS

🟢 1️⃣ Start a New Feature
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

🟡 2️⃣ Work & Commit (Local Only)
git status
git add .
git commit -m "feat: implement my feature"
(Repeat commits as needed)

🔵 3️⃣ Merge Feature → Develop
git checkout develop
git merge feature/my-feature
🧹 4️⃣ Delete Feature Branch (Local)
git branch -d feature/my-feature
☁️ 5️⃣ Push Develop
git push origin develop

🟣 6️⃣ Beta Versioning (On Develop)
Edit package.json:
"version": "X.Y.Z-beta"

Then:

git add package.json
git commit -m "chore: bump version to vX.Y.Z-beta"

🏷️ 7️⃣ Tag Beta Release
git tag -a vX.Y.Z-beta -m "Beta release vX.Y.Z"

☁️ 8️⃣ Push Develop + Beta Tag
git push origin develop
git push origin vX.Y.Z-beta

🚀 PRODUCTION RELEASE (WHEN READY)
🔴 9️⃣ Merge Develop → Main
git checkout main
git pull origin main
git merge develop

🟠 🔟 Production Version Bump
Edit package.json:
"version": "X.Y.Z"

Then:

git add package.json
git commit -m "chore: release vX.Y.Z"

🏷️ 1️⃣1️⃣ Tag Production Release
git tag -a vX.Y.Z -m "Production release vX.Y.Z"

🏁 TL;DR — ONE LINE FLOW
feature → commit → merge develop → push develop → tag beta
develop → merge main → bump version → tag stable → push
