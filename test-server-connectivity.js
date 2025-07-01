#!/usr/bin/env node

// Enhanced test script to check if the server is working
async function testServer() {
  const serverUrl = 'http://localhost:5000';
  
  console.log('🚀 RecipeShare Server Connectivity Test');
  console.log('=====================================');
  console.log('🔍 Testing server connectivity...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${serverUrl}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Server health check passed:', healthData.status);
    } else {
      console.log('❌ Server health check failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('💡 Please start the server with: npm run server');
    return;
  }
  
  // Test if authentication is working (this should return 401)
  try {
    const storiesResponse = await fetch(`${serverUrl}/api/stories/feed`);
    console.log('📡 Stories endpoint status:', storiesResponse.status);
    if (storiesResponse.status === 401) {
      console.log('✅ Authentication is working (401 Unauthorized as expected)');
    } else if (storiesResponse.status === 404) {
      console.log('❌ Stories endpoint not found - route may not be registered');
    }
  } catch (error) {
    console.log('❌ Error testing stories endpoint:', error.message);
  }
  
  // Test challenges endpoint
  try {
    const challengesResponse = await fetch(`${serverUrl}/api/challenges/current`);
    console.log('🏆 Challenges endpoint status:', challengesResponse.status);
    if (challengesResponse.status === 401) {
      console.log('✅ Challenges authentication is working');
    } else if (challengesResponse.status === 404) {
      console.log('❌ Challenges endpoint not found');
    }
  } catch (error) {
    console.log('❌ Error testing challenges endpoint:', error.message);
  }

  // Test recipes endpoints
  try {
    const recipesResponse = await fetch(`${serverUrl}/api/recipes`);
    console.log('🍳 Recipes endpoint status:', recipesResponse.status);
    if (recipesResponse.status === 401) {
      console.log('✅ Recipes authentication is working');
    } else if (recipesResponse.status === 404) {
      console.log('❌ Recipes endpoint not found');
    }
  } catch (error) {
    console.log('❌ Error testing recipes endpoint:', error.message);
  }

  // Test liked recipes endpoint
  try {
    const likedResponse = await fetch(`${serverUrl}/api/recipes/liked`);
    console.log('❤️ Liked recipes endpoint status:', likedResponse.status);
    if (likedResponse.status === 401) {
      console.log('✅ Liked recipes authentication is working');
    }
  } catch (error) {
    console.log('❌ Error testing liked recipes endpoint:', error.message);
  }

  // Test saved recipes endpoint
  try {
    const savedResponse = await fetch(`${serverUrl}/api/recipes/saved`);
    console.log('💾 Saved recipes endpoint status:', savedResponse.status);
    if (savedResponse.status === 401) {
      console.log('✅ Saved recipes authentication is working');
    }
  } catch (error) {
    console.log('❌ Error testing saved recipes endpoint:', error.message);
  }

  console.log('\n🎯 Test Summary:');
  console.log('- Health endpoint should return 200 (OK)');
  console.log('- Protected endpoints should return 401 (Unauthorized)');
  console.log('- If endpoints return 404, routes may not be registered');
  console.log('\n💡 Next steps:');
  console.log('1. If server is running ✅, test the frontend at http://localhost:5173');
  console.log('2. Try registering/logging in to get auth tokens');
  console.log('3. Test the sidebar features and story creation');
}

testServer().catch(console.error);
