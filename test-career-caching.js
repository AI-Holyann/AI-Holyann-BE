/**
 * Test Career Recommendations Caching
 * 
 * Test scenario:
 * 1. Complete all tests -> Gọi AI lần đầu, lưu vào DB
 * 2. Complete lại -> Không gọi AI, lấy từ DB
 * 3. Reset -> Xóa DB, gọi AI lại
 */

const STUDENT_ID = 'c33cc622-79aa-439e-9463-cec4b439e013'; // Replace with actual student_id

async function testCareerRecommendations() {
    console.log('='.repeat(60));
    console.log('Testing Career Recommendations Caching');
    console.log('='.repeat(60));

    // Test 1: Get current recommendations
    console.log('\n📋 Test 1: Get current recommendations');
    try {
        const response = await fetch(`http://localhost:3000/api/tests/career/${STUDENT_ID}`);
        const result = await response.json();
        
        if (result.success) {
            console.log(`✅ Found ${result.total} recommendations`);
            if (result.total > 0) {
                console.log('Sample:', result.recommendations[0]);
            }
        } else {
            console.log('❌', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    // Test 2: Complete tests (should use cache if exists)
    console.log('\n🔄 Test 2: Complete all tests (check caching)');
    try {
        const response = await fetch('http://localhost:3000/api/tests/complete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({student_id: STUDENT_ID})
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`✅ Complete successful`);
            console.log(`📊 Is cached: ${result.is_cached ? 'YES (from DB)' : 'NO (called AI)'}`);
            console.log(`📈 Recommendations count: ${result.recommendations?.length || 0}`);
        } else {
            console.log('❌', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    // Test 3: Reset recommendations (force re-generate)
    console.log('\n🔄 Test 3: Reset recommendations (force AI call)');
    const shouldReset = false; // Set to true to test reset

    if (shouldReset) {
        try {
            const response = await fetch(`http://localhost:3000/api/tests/career/${STUDENT_ID}/reset`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log(`✅ Reset successful`);
                console.log(`🗑️ Deleted: ${result.old_count} old recommendations`);
                console.log(`💾 Created: ${result.new_count} new recommendations`);
            } else {
                console.log('❌', result.error);
            }
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    } else {
        console.log('⏭️ Skipped (set shouldReset = true to test)');
    }

    // Test 4: Complete again after reset (should call AI again)
    if (shouldReset) {
        console.log('\n🔄 Test 4: Complete tests after reset');
        try {
            const response = await fetch('http://localhost:3000/api/tests/complete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({student_id: STUDENT_ID})
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log(`✅ Complete successful`);
                console.log(`📊 Is cached: ${result.is_cached ? 'YES' : 'NO'}`);
            } else {
                console.log('❌', result.error);
            }
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Testing completed!');
    console.log('='.repeat(60));
}

// Run tests
testCareerRecommendations().catch(console.error);
