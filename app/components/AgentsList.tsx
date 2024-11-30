import React from 'react'
import { getAgents } from '../actions/getAgents';
import MainBtn from './MainBtn';

const AgentsList = async () => {
    const agents = await getAgents();

    return (
        <div className="flex gap-4 flex-wrap justify-center">
            {agents?.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90 w-fit">
                    <label className="block text-gray-800 font-semibold text-lg">{item.name}</label>
                    <h2 className={item.status == 'active' ? 'text-green-500' : 'text-gray-400'}>{item.status == "active" ? "Active" : "Disabled"}</h2>
                    <div className='mt-6'>
                        <MainBtn action="run once" id={item.id} />
                    </div>
                </div>
            ))
            }
        </div >
    )
}

export default AgentsList