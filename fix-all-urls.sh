#!/bin/bash
# Comprehensive fix for all hardcoded localhost URLs in React components

echo "🔥 FIXING ALL HARDCODED LOCALHOST URLS"
echo "====================================="

# Replace all localhost:5000 with API endpoints in all component files
cd frontend/src/components

echo "Fixing CreateRecipe.tsx..."
sed -i "s|http://localhost:5000/api/recipes|API_ENDPOINTS.RECIPES.CREATE|g" CreateRecipe.tsx

echo "Fixing Feed.tsx..."
sed -i "s|http://localhost:5000/api/recipes/feed|API_ENDPOINTS.RECIPES.LIST|g" Feed.tsx
sed -i "s|http://localhost:5000/api/stories/feed|API_ENDPOINTS.STORIES?.LIST|g" Feed.tsx
sed -i "s|http://localhost:5000/api/challenges/current|API_ENDPOINTS.CHALLENGES?.CURRENT|g" Feed.tsx
sed -i "s|http://localhost:5000/api/users/suggestions/new|API_ENDPOINTS.USERS.SUGGESTIONS|g" Feed.tsx
sed -i "s|http://localhost:5000/api/recipes/user/|API_ENDPOINTS.RECIPES.BY_USER|g" Feed.tsx
sed -i "s|http://localhost:5000/api/users/profile|API_ENDPOINTS.USERS.PROFILE|g" Feed.tsx
sed -i "s|http://localhost:5000/api/recipes/saved|API_ENDPOINTS.RECIPES.SAVED|g" Feed.tsx
sed -i "s|http://localhost:5000/api/recipes/liked|API_ENDPOINTS.RECIPES.LIKED|g" Feed.tsx
sed -i "s|http://localhost:5000/api/users/followers-list|API_ENDPOINTS.USERS.FOLLOWERS|g" Feed.tsx
sed -i "s|http://localhost:5000/api/recipes/popular|API_ENDPOINTS.RECIPES.POPULAR|g" Feed.tsx

echo "✅ All localhost URLs have been replaced with API_ENDPOINTS"
echo "🚀 Components now use centralized API configuration"
