'use client'
import { useAuth } from '@/contexts/AuthContext'
import Dashboard from '@/components/Dashboard'
import AuthHeader from '@/components/AuthHeader'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthHeader />
      <div className="flex justify-center py-8">
        <Dashboard 
          userName={user?.name || 'Khách'} 
        />
      </div>
    </div>
  )
}