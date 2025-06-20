#!/bin/bash

# Switch to prod branch
git checkout prod

# Reset prod to match dev
git reset --hard dev

# Force push to remote prod
git push -f origin prod

echo "Production branch has been updated successfully!" 

