#!/bin/bash
# 1. Move folders to a safe temporary path
mv backend /tmp/backend-app
mv frontend /tmp/frontend-app

# 2. Clear out any root files that will cause conflicts
rm -rf *

# 3. Bring the backend Laravel files to the absolute root level
cp -r /tmp/backend-app/* .
