'use client'

import AuthHeader from '@/components/dashboard/AuthHeader'
import ChecklistPage from '@/components/dashboard/checklist/ChecklistPage'

export default function Checklist() {
    return (
        <>
            <AuthHeader/>
            <main className="min-h-screen bg-white dark:bg-slate-900">
                <ChecklistPage/>
            </main>
        </>
    );
}

