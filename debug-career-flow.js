/**
 * Debug Career Recommendations Flow
 * This script will help identify why career_matches is empty
 */

const STUDENT_ID = 'c33cc622-79aa-439e-9463-cec4b439e013';

async function debugCareerFlow() {
    console.log('='.repeat(70));
    console.log('🔍 Debugging Career Recommendations Flow');
    console.log('='.repeat(70));
    console.log(`Student ID: ${STUDENT_ID}\n`);

    // Step 1: Check if student exists
    console.log('📋 Step 1: Check if student profile exists...');
    try {
        const response = await fetch(`http://localhost:3000/api/auth/session`);
        console.log(`   Status: ${response.status}`);
        if (response.ok) {
            console.log('   ✅ Session active\n');
        }
    } catch (error) {
        console.error('   ❌ Error:', error.message, '\n');
    }

    // Step 2: Check current career_matches
    console.log('📋 Step 2: Check current career_matches in DB...');
    try {
        const response = await fetch(`http://localhost:3000/api/tests/career/${STUDENT_ID}`);
        const result = await response.json();
        
        console.log(`   Status: ${response.status}`);
        if (result.success) {
            console.log(`   ✅ Career matches found: ${result.total}`);
            if (result.total > 0) {
                console.log(`   📊 Sample: ${result.recommendations[0].job_title} (${result.recommendations[0].match_percentage}%)`);
            } else {
                console.log('   ⚠️ No career matches in database yet');
            }
        } else {
            console.log(`   ❌ Error: ${result.error}`);
        }
        console.log('');
    } catch (error) {
        console.error('   ❌ Error:', error.message, '\n');
    }

    // Step 3: Check tests completion status
    console.log('📋 Step 3: Check tests completion status...');
    try {
        // This is a hypothetical check - you may need to adjust based on your actual API
        console.log('   ℹ️ Need to manually check if all 3 tests (MBTI, RIASEC, GRIT) are completed');
        console.log('   ℹ️ Check assessments_completed field in students table\n');
    } catch (error) {
        console.error('   ❌ Error:', error.message, '\n');
    }

    // Step 4: Try to complete tests (this triggers AI call)
    console.log('📋 Step 4: Attempt to complete all tests...');
    console.log('   🚀 Calling POST /api/tests/complete...\n');
    
    try {
        const response = await fetch('http://localhost:3000/api/tests/complete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({student_id: STUDENT_ID})
        });
        
        console.log(`   Response Status: ${response.status}`);
        
        const result = await response.json();
        
        if (result.success) {
            console.log('   ✅ Complete API succeeded!');
            console.log(`   📊 Is cached: ${result.is_cached ? 'YES (from DB)' : 'NO (called AI)'}`);
            console.log(`   📈 Recommendations count: ${result.recommendations?.length || 0}`);
            
            if (result.recommendations && result.recommendations.length > 0) {
                console.log('\n   📝 Sample recommendations:');
                result.recommendations.slice(0, 3).forEach((rec, i) => {
                    console.log(`      ${i + 1}. ${rec.title || rec.job_title} (${rec.match_score || rec.match_percentage}%)`);
                });
            }
        } else {
            console.log(`   ❌ Error: ${result.error}`);
            if (result.missing_tests) {
                console.log(`   ⚠️ Missing tests: ${result.missing_tests.join(', ')}`);
                console.log('   💡 Tip: Complete all tests first!');
            }
        }
        console.log('');
    } catch (error) {
        console.error('   ❌ Request Error:', error.message);
        console.log('   💡 Make sure Next.js server is running on port 3000\n');
    }

    // Step 5: Verify career_matches was saved
    console.log('📋 Step 5: Verify career_matches in DB after complete...');
    try {
        const response = await fetch(`http://localhost:3000/api/tests/career/${STUDENT_ID}`);
        const result = await response.json();
        
        if (result.success && result.total > 0) {
            console.log(`   ✅ SUCCESS! Found ${result.total} career matches in DB`);
            console.log('   💾 Data has been saved to career_matches table');
        } else {
            console.log('   ⚠️ Still no career matches in DB');
            console.log('   💡 Possible reasons:');
            console.log('      - AI server (Django) is not running');
            console.log('      - AI API returned no recommendations');
            console.log('      - Tests are not completed yet');
        }
        console.log('');
    } catch (error) {
        console.error('   ❌ Error:', error.message, '\n');
    }

    // Summary
    console.log('='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log('To fix "no data in career_matches":');
    console.log('');
    console.log('1. ✅ Make sure you completed all 3 tests (MBTI, RIASEC, GRIT)');
    console.log('2. ✅ Make sure Django AI server is running on port 8000');
    console.log('3. ✅ Call POST /api/tests/complete with student_id');
    console.log('4. ✅ Check server logs for AI API response');
    console.log('5. ✅ Verify data in Prisma Studio');
    console.log('');
    console.log('Common issues:');
    console.log('- 🔴 Django server not running → AI call fails → No data saved');
    console.log('- 🔴 Tests incomplete → API returns error → No data saved');
    console.log('- 🔴 AI returns empty recommendations → No data saved');
    console.log('='.repeat(70));
}

// Run debug
debugCareerFlow().catch(console.error);
