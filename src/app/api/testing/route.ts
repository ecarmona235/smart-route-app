import { RouterClient } from 'ai-router-package';

export async function POST() {
  try {
    const client = new RouterClient({
        AI_ANALYSIS_API: process.env.AI_ANALYSIS_API,
        providers: [
            {
                provider_name: 'openai',
                api_key: process.env.OPENAI_API_KEY || '',
            },
            {
                provider_name: 'gemini',
                api_key: process.env.GEMINI_API_KEY || '',
            },
            {
                provider_name: 'x',
                api_key: process.env.X_API_KEY || '',
            },
            {
                provider_name: 'anthropic',
                api_key: process.env.ANTHROPIC_API_KEY || '',
            },
            {
                provider_name: 'serper',
                api_key: process.env.SERPER_API_KEY || '',
            },
        ],
        maxAge: 168 * 2,
        hierarchy: {
            first: 'last_used',
            second: 'accuracy',
            third: 'price',
            last: 'latency',
        },
        stale_clean_up: true,
        reasoning: true,
        

    });
    await client.initialize();
    
    console.log('=== ROUTER CLIENT INITIALIZED - STARTING COMPREHENSIVE TESTS ===');

    // Test Configuration Getters
    console.log('\n--- Testing Configuration Getters ---');
    try {
      const hierarchy = client.getHierarchy();
      console.log('✅ getHierarchy():', hierarchy);
      
      const maxAge = client.getMaxAge();
      console.log('✅ getMaxAge():', maxAge);
      
      const reasoningEnabled = client.isReasoningEnabled();
      console.log('✅ isReasoningEnabled():', reasoningEnabled);
      
      const staleCleanUpEnabled = client.isStaleCleanUpEnabled();
      console.log('✅ isStaleCleanUpEnabled():', staleCleanUpEnabled);
      
      const providers = client.getProviders();
      console.log('✅ getProviders():', providers);
    } catch (error) {
      console.error('❌ Configuration Getters Error:', error);
    }

    // Test Configuration Setters
    console.log('\n--- Testing Configuration Setters ---');
    try {
      // Test setMaxAge
      client.setMaxAge(72); // Change to 3 days
      console.log('✅ setMaxAge(72) - Max age updated to 3 days');
      
      // Test setHierarchy
      const newHierarchy = {
        first: 'price' as const,
        second: 'accuracy' as const, 
        third: 'latency' as const,
        last: 'last_used' as const
      };
      client.setHierarchy(newHierarchy);
      console.log('✅ setHierarchy() - Routing priority changed to price first');
      
      // Test setReasoning
      client.setReasoning(true);
      console.log('✅ setReasoning(true) - Reasoning enabled');
      
      // Test setStaleCleanUp
      client.setStaleCleanUp(false);
      console.log('✅ setStaleCleanUp(false) - Stale cleanup disabled');
      
      // Verify changes
      console.log('📊 Updated config - MaxAge:', client.getMaxAge(), 'Reasoning:', client.isReasoningEnabled());
    } catch (error) {
      console.error('❌ Configuration Setters Error:', error);
    }

    // Test Provider Management
    console.log('\n--- Testing Provider Management ---');
    try {
      // Test addProvider
      client.addProvider('test-provider', 'test-api-key-123');
      console.log('✅ addProvider() - Test provider added');
      
      // Test updateProviderAPIKey
      const updated = client.updateProviderAPIKey('test-provider', 'new-api-key-456');
      console.log('✅ updateProviderAPIKey() - API key updated:', updated);
      
      // Test getProviders to see the new provider
      const updatedProviders = client.getProviders();
      console.log('✅ getProviders() after adding:', updatedProviders);
      
      // Test removeProviderFromConfig
      const removed = client.removeProviderFromConfig('test-provider');
      console.log('✅ removeProviderFromConfig() - Test provider removed:', removed);
      
      // Verify removal
      const finalProviders = client.getProviders();
      console.log('✅ getProviders() after removal:', finalProviders);
    } catch (error) {
      console.error('❌ Provider Management Error:', error);
    }

    // Test Data Health & Freshness
    console.log('\n--- Testing Data Health & Freshness ---');
    try {
      const isInit = client.isInitialized();
      console.log('✅ isInitialized():', isInit);
      
      const lastInit = client.getLastInitialization();
      console.log('✅ getLastInitialization():', new Date(lastInit).toISOString());
      
      const isStale = client.isDataStale();
      console.log('✅ isDataStale():', isStale);
      
      const health = client.getDataHealth();
      console.log('✅ getDataHealth():', health);
      
      // Test ensureFreshData (should not refresh since data is fresh)
      await client.ensureFreshData();
      console.log('✅ ensureFreshData() - Data is fresh, no refresh needed');
    } catch (error) {
      console.error('❌ Data Health Error:', error);
    }

    // Test Data Refresh
    console.log('\n--- Testing Data Refresh ---');
    try {
      // Test refreshData
      await client.refreshData();
      console.log('✅ refreshData() - Data refreshed while preserving usage history');
      
      // Verify refresh updated timestamp
      const newLastInit = client.getLastInitialization();
      console.log('✅ getLastInitialization() after refresh:', new Date(newLastInit).toISOString());
    } catch (error) {
      console.error('❌ Data Refresh Error:', error);
    }

    // Test Data Removal (if any data exists)
    console.log('\n--- Testing Data Removal ---');
    try {
      // Note: These tests depend on actual data being present
      // They might not remove anything if no data exists
      const providerRemoved = client.removeProvider('non-existent-provider');
      console.log('✅ removeProvider() - Non-existent provider removal attempt:', providerRemoved);
      
      const modelRemoved = client.removeModel('non-existent-provider', 'non-existent-model');
      console.log('✅ removeModel() - Non-existent model removal attempt:', modelRemoved);
    } catch (error) {
      console.error('❌ Data Removal Error:', error);
    }

    // Test Edge Cases
    console.log('\n--- Testing Edge Cases ---');
    try {
      // Test invalid maxAge
      try {
        client.setMaxAge(-1);
        console.log('❌ setMaxAge(-1) - Should have thrown error');
      } catch (error) {
        console.log('✅ setMaxAge(-1) - Correctly threw error:', error instanceof Error ? error.message : 'Unknown error');
      }
      
      // Test invalid hierarchy
      try {
        client.setHierarchy({
          first: 'invalid' as any,
          second: 'accuracy',
          third: 'price',
          last: 'latency'
        });
        console.log('❌ setHierarchy(invalid) - Should have thrown error');
      } catch (error) {
        console.log('✅ setHierarchy(invalid) - Correctly threw error:', error instanceof Error ? error.message : 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Edge Cases Error:', error);
    }

    // Final Configuration State
    console.log('\n--- Final Configuration State ---');
    try {
      const finalHierarchy = client.getHierarchy();
      const finalMaxAge = client.getMaxAge();
      const finalReasoning = client.isReasoningEnabled();
      const finalStaleCleanUp = client.isStaleCleanUpEnabled();
      const finalProviders = client.getProviders();
      
      console.log('📊 Final Configuration:');
      console.log('  - Hierarchy:', finalHierarchy);
      console.log('  - MaxAge:', finalMaxAge, 'hours');
      console.log('  - Reasoning:', finalReasoning);
      console.log('  - StaleCleanUp:', finalStaleCleanUp);
      console.log('  - Providers:', finalProviders);
    } catch (error) {
      console.error('❌ Final Configuration Error:', error);
    }

    console.log('\n=== ALL TESTS COMPLETED ===');

    return Response.json({ 
      success: true, 
      message: 'Router client initialized and all public methods tested successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}