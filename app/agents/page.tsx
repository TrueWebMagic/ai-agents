import React from 'react'
import AgentsList from '../components/AgentsList'

const AgentCreationPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mt-3 mb-8 pb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Your AI Agents</h1>
                <AgentsList />
            </div>
        </div>
    )
}

export default AgentCreationPage