'use client';

import ChatPage from '@/components/dashboard/Chat/ChatPage';
import AuthHeader from '@/components/dashboard/AuthHeader';

export default function ChatDashboard() {
    return (
        <>
            <AuthHeader/>
            <ChatPage/>
        </>
    );
}

