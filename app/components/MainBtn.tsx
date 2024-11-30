'use client';

import React, { useState } from 'react'
import { runAgent } from '../utils/runAgent';

type MainBtnProps = {
    action: string;
    id: string;
}

const MainBtn = ({ action, id }: MainBtnProps) => {
    const [isRunning, setIsRunning] = useState(false);

    const handleClick = async (id: string) => {
        setIsRunning(true);

        if (action === "run once") {
            try {
                await runAgent(id);
            } catch (error) {
                console.error("Error running agent:", error);
            } finally {
                setIsRunning(false);
            }
        }
    };

    return (
        <button disabled={isRunning} onClick={() => { handleClick(id) }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl transition duration-200 font-semibold shadow-md hover:shadow-lg disabled:pointer-events-none disabled:opacity-70">
            {isRunning == false ? (action == "run once" && 'Run Once') : 'Running...'}
        </button>
    )
}

export default MainBtn