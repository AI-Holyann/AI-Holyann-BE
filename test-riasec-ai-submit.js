/**
 * Test RIASEC Submit API with AI Server Integration
 */

const testRIASECSubmit = async () => {
    console.log('='.repeat(60));
    console.log('Testing RIASEC Submit API with AI Server');
    console.log('='.repeat(60));
    
    // Sample answers: Realistic = high (5), others lower
    const answers = {};
    for (let i = 1; i <= 48; i++) {
        if (i <= 8) {
            answers[i] = 5; // Realistic
        } else if (i <= 16) {
            answers[i] = 4; // Investigative
        } else if (i <= 24) {
            answers[i] = 3; // Artistic
        } else if (i <= 32) {
            answers[i] = 2; // Social
        } else if (i <= 40) {
            answers[i] = 2; // Enterprising
        } else {
            answers[i] = 3; // Conventional
        }
    }
    
    const requestData = {
        test_id: 'test-riasec-001',
        student_id: 'student-001',
        test_type: 'riasec',
        answers: answers
    };
    
    console.log('\n📤 Sending request to /api/tests/submit...');
    console.log('Test ID:', requestData.test_id);
    console.log('Sample answers:', {
        'Q1 (R)': answers[1],
        'Q10 (I)': answers[10],
        'Q20 (A)': answers[20],
        'Q30 (S)': answers[30],
        'Q40 (E)': answers[40],
        'Q48 (C)': answers[48]
    });
    
    try {
        const response = await fetch('http://localhost:3000/api/tests/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        console.log('\n📥 Response Status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            
            console.log('\n✅ SUCCESS!');
            console.log('\n📊 RIASEC Result:');
            console.log(JSON.stringify(result, null, 2));
            
            if (result.success && result.result) {
                console.log('\n🎯 Result Analysis:');
                console.log('Holland Code:', result.result.result_code);
                console.log('Scores:', result.result.scores);
                
                // Check if scores are from AI (8-40) or local (0-100)
                const scoreValues = Object.values(result.result.scores);
                const maxScore = Math.max(...scoreValues);
                
                if (maxScore <= 40) {
                    console.log('\n✅ Using AI Server scores (8-40 range)');
                } else {
                    console.log('\n⚠️ Using local calculation scores (0-100 range)');
                }
            }
        } else {
            const error = await response.json();
            console.log('\n❌ ERROR:', error);
        }
        
    } catch (error) {
        console.error('\n❌ Request failed:', error.message);
    }
    
    console.log('\n' + '='.repeat(60));
};

// Run test
testRIASECSubmit().catch(console.error);
