import CareerAssessmentResults from '@/components/CareerAssessmentResults'

console.log('CareerAssessmentResults imported successfully:', CareerAssessmentResults)

export default function TestImport() {
    return (
        <div>
            <h1>Test Import CareerAssessmentResults</h1>
            <CareerAssessmentResults
                studentId="test"
                onClose={() => console.log('close')}
            />
        </div>
    )
}
