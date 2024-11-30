'use client'

import React, { useState } from 'react'
import { generateAgent } from '../actions/generateAgent';
import { runAgent } from '../utils/runAgent';
import { deployAgent } from '../actions/deployAgent';

const AgentCreationPage = () => {
    const [generatedWorkflow, setGeneratedWorkflow] = useState<string>("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [agentPrompt, setAgentPrompt] = useState("")

    const handleGenerate = async (formData: FormData) => {
        setIsGenerating(true)
        const prompt = formData.get('prompt') as string;
        setAgentPrompt(prompt)

        if (!prompt) {
            alert("Please enter a prompt");
            return;
        }

        try {
            const result = await generateAgent(prompt);
            console.log(result)
            setGeneratedWorkflow(result);
        } catch (error) {
            alert("Error generating agent: " + error);
            setGeneratedWorkflow("An error occurred while generating the response.");
        }
        setIsGenerating(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mt-3 mb-8 pb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Create Your AI Agent</h1>

                <div className="space-y-12">
                    {/* Task Description */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90">
                        <label className="block mb-4 text-gray-800 font-semibold text-lg">What would you like your agent to do?</label>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            handleGenerate(formData);
                        }} className="flex gap-4 flex-row items-end">
                            <textarea
                                name='prompt'
                                placeholder="Example: Summarize all daily emails and send them to Slack"
                                rows={3}
                                className="flex-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition max-h-64 min-h-20 text-gray-700"
                            />
                            <button
                                disabled={isGenerating}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl transition duration-200 font-semibold disabled:pointer-events-none disabled:opacity-75 h-fit shadow-md hover:shadow-lg">
                                Generate
                            </button>
                        </form>
                    </div>

                    {/* APIs and Workflow */}
                    {generatedWorkflow && <div className="flex gap-8">
                        <div className="w-1/4">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">APIs Used</h3>
                            <div className="space-y-3">
                                {JSON.parse(generatedWorkflow)["api_used"].map((action: string, index: number) => (
                                    <button key={index} className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 w-full text-left transition duration-200 flex items-center gap-3 shadow-sm hover:shadow-md">
                                        <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-semibold">{action.charAt(0).toUpperCase()}</span>
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Workflow Preview</h3>
                            <div className="space-y-4">
                                {JSON.parse(generatedWorkflow)["workflow_elements"].map((action: { title: string; action: string }, index: number) => (
                                    <div key={index} className='space-y-4'>
                                        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition duration-200 flex justify-between items-center">
                                            <span className="text-gray-700">{action["title"]}</span>
                                            <svg width="18" height="20" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.44925 4.13552C8.72908 3.78644 8.67292 3.27667 8.32376 2.9969C7.9747 2.71713 7.46494 2.7733 7.18522 3.12238L8.44925 4.13552ZM1.44739 11.5767L2.06087 12.1056C2.0672 12.0982 2.07338 12.0908 2.07944 12.0832L1.44739 11.5767ZM1.26271 12.0281L0.454291 11.9753L0.453578 11.9907L1.26271 12.0281ZM1.11151 15.293L0.302378 15.2555C0.300521 15.2957 0.301655 15.336 0.305791 15.376L1.11151 15.293ZM1.96147 16.0349L1.98796 16.8445C2.04198 16.8427 2.09568 16.8356 2.14827 16.823L1.96147 16.0349ZM5.20147 15.2671L5.38831 16.0553L5.40084 16.0521L5.20147 15.2671ZM5.61727 15.0035L6.24216 15.519L6.24918 15.5103L5.61727 15.0035ZM12.7724 7.37572C13.0522 7.02667 12.9962 6.51691 12.6472 6.23704C12.2983 5.95717 11.7884 6.01322 11.5086 6.36225L12.7724 7.37572ZM7.18857 3.12217C6.90874 3.47115 6.96468 3.98094 7.31374 4.26083C7.66269 4.54071 8.17245 4.4847 8.45238 4.13573L7.18857 3.12217ZM9.53551 1.49054L10.1674 1.99733C10.178 1.98406 10.1883 1.97045 10.1981 1.95653L9.53551 1.49054ZM11.2948 1.14494L11.813 0.522389C11.7872 0.500918 11.7601 0.481079 11.7319 0.462967L11.2948 1.14494ZM13.7108 3.1559L14.2841 2.58368C14.2665 2.56606 14.2481 2.54928 14.229 2.53335L13.7108 3.1559ZM13.7011 4.92494L13.1341 4.34645C13.1112 4.36896 13.0896 4.39281 13.0694 4.41787L13.7011 4.92494ZM11.5086 6.36225C11.2285 6.71109 11.2846 7.22053 11.6334 7.50057C11.9823 7.78062 12.4923 7.72456 12.7724 7.37572L11.5086 6.36225ZM8.62151 3.50891C8.5552 3.0665 8.14285 2.7616 7.70049 2.8279C7.25801 2.89419 6.95313 3.30658 7.01944 3.74899L8.62151 3.50891ZM12.2496 7.67154C12.6928 7.61138 13.0033 7.20314 12.9431 6.75991C12.8829 6.31661 12.4747 6.00609 12.0314 6.06632L12.2496 7.67154ZM7.18522 3.12238L0.815346 11.0701L2.07944 12.0832L8.44925 4.13552L7.18522 3.12238ZM0.833922 11.0477C0.609973 11.3075 0.476615 11.6331 0.454291 11.9753L2.071 12.0809C2.0704 12.0899 2.06685 12.0987 2.06087 12.1056L0.833922 11.0477ZM0.453578 11.9907L0.302378 15.2555L1.92065 15.3305L2.07185 12.0656L0.453578 11.9907ZM0.305791 15.376C0.393995 16.2313 1.12866 16.8726 1.98796 16.8445L1.93499 15.2254C1.93154 15.2255 1.92984 15.2249 1.92874 15.2245C1.9272 15.224 1.92515 15.2229 1.92307 15.2211C1.92097 15.2192 1.91962 15.2174 1.91886 15.216C1.91831 15.2149 1.91759 15.2133 1.91724 15.2098L0.305791 15.376ZM2.14827 16.823L5.38831 16.0553L5.01463 14.4789L1.77468 15.2468L2.14827 16.823ZM5.40084 16.0521C5.73078 15.9683 6.02551 15.7817 6.24216 15.519L4.99239 14.4881C4.99498 14.485 4.99833 14.4829 5.00211 14.4819L5.40084 16.0521ZM6.24918 15.5103L12.7724 7.37572L11.5086 6.36225L4.98537 14.4968L6.24918 15.5103ZM8.45238 4.13573L10.1674 1.99733L8.90361 0.983765L7.18857 3.12217L8.45238 4.13573ZM10.1981 1.95653C10.3478 1.74364 10.6386 1.6865 10.8578 1.82693L11.7319 0.462967C10.7823 -0.14557 9.5218 0.102031 8.87293 1.02457L10.1981 1.95653ZM10.7767 1.7675L13.1926 3.77846L14.229 2.53335L11.813 0.522389L10.7767 1.7675ZM13.1375 3.72814C13.2195 3.81032 13.2653 3.92188 13.2646 4.038L14.8846 4.0469C14.8877 3.49858 14.6715 2.97178 14.2841 2.58368L13.1375 3.72814ZM13.2646 4.038C13.2641 4.15413 13.217 4.26517 13.1341 4.34645L14.2681 5.50345C14.6597 5.11963 14.8816 4.59523 14.8846 4.0469L13.2646 4.038ZM13.0694 4.41787L11.5086 6.36225L12.7724 7.37572L14.3328 5.43203L13.0694 4.41787ZM7.01944 3.74899C7.39668 6.26679 9.72678 8.01433 12.2496 7.67154L12.0314 6.06632C10.3867 6.2898 8.86753 5.15044 8.62151 3.50891L7.01944 3.74899Z" fill="#6366F1" />
                                            </svg>
                                        </div>
                                        {index < JSON.parse(generatedWorkflow)["workflow_elements"].length - 1 && (<div className="flex justify-center items-center">
                                            <svg width="15" height="26" viewBox="0 0 15 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                                <path d="M6.84441 25.0732C7.23493 25.4637 7.8681 25.4637 8.25862 25.0732L14.6226 18.7092C15.0131 18.3187 15.0131 17.6855 14.6226 17.295C14.2321 16.9045 13.5989 16.9045 13.2084 17.295L7.55151 22.9519L1.89466 17.295C1.50413 16.9045 0.870969 16.9045 0.480445 17.295C0.0899208 17.6855 0.0899208 18.3187 0.480445 18.7092L6.84441 25.0732ZM6.55151 0.315918L6.55151 24.3661L8.55151 24.3661L8.55151 0.315918L6.55151 0.315918Z" fill="currentColor" />
                                            </svg>
                                        </div>)}
                                    </div>
                                ))}
                                <button className='cursor-pointer mt-6 mx-auto flex hover:opacity-75 transition-opacity'>
                                    <svg width="40" height="40" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-fit'>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M30.5 28C30.5 29.1 29.604 30 28.5 30H4.5C3.396 30 2.5 29.1 2.5 28V4C2.5 2.9 3.396 2 4.5 2H28.5C29.604 2 30.5 2.9 30.5 4V28ZM28.5 0H4.5C2.291 0 0.5 1.79 0.5 4V28C0.5 30.21 2.291 32 4.5 32H28.5C30.709 32 32.5 30.21 32.5 28V4C32.5 1.79 30.709 0 28.5 0ZM22.5 15H17.5V10C17.5 9.45 17.052 9 16.5 9C15.948 9 15.5 9.45 15.5 10V15H10.5C9.948 15 9.5 15.45 9.5 16C9.5 16.55 9.948 17 10.5 17H15.5V22C15.5 22.55 15.948 23 16.5 23C17.052 23 17.5 22.55 17.5 22V17H22.5C23.052 17 23.5 16.55 23.5 16C23.5 15.45 23.052 15 22.5 15Z" fill="#6366F1" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="w-1/4">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Schedule</h3>
                            {JSON.parse(generatedWorkflow)["frequency"].map((title: string, index: number) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition duration-200 flex justify-between items-center mb-3">
                                    <span className="text-gray-700">{title}</span>
                                    <svg width="18" height="20" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.44925 4.13552C8.72908 3.78644 8.67292 3.27667 8.32376 2.9969C7.9747 2.71713 7.46494 2.7733 7.18522 3.12238L8.44925 4.13552ZM1.44739 11.5767L2.06087 12.1056C2.0672 12.0982 2.07338 12.0908 2.07944 12.0832L1.44739 11.5767ZM1.26271 12.0281L0.454291 11.9753L0.453578 11.9907L1.26271 12.0281ZM1.11151 15.293L0.302378 15.2555C0.300521 15.2957 0.301655 15.336 0.305791 15.376L1.11151 15.293ZM1.96147 16.0349L1.98796 16.8445C2.04198 16.8427 2.09568 16.8356 2.14827 16.823L1.96147 16.0349ZM5.20147 15.2671L5.38831 16.0553L5.40084 16.0521L5.20147 15.2671ZM5.61727 15.0035L6.24216 15.519L6.24918 15.5103L5.61727 15.0035ZM12.7724 7.37572C13.0522 7.02667 12.9962 6.51691 12.6472 6.23704C12.2983 5.95717 11.7884 6.01322 11.5086 6.36225L12.7724 7.37572ZM7.18857 3.12217C6.90874 3.47115 6.96468 3.98094 7.31374 4.26083C7.66269 4.54071 8.17245 4.4847 8.45238 4.13573L7.18857 3.12217ZM9.53551 1.49054L10.1674 1.99733C10.178 1.98406 10.1883 1.97045 10.1981 1.95653L9.53551 1.49054ZM11.2948 1.14494L11.813 0.522389C11.7872 0.500918 11.7601 0.481079 11.7319 0.462967L11.2948 1.14494ZM13.7108 3.1559L14.2841 2.58368C14.2665 2.56606 14.2481 2.54928 14.229 2.53335L13.7108 3.1559ZM13.7011 4.92494L13.1341 4.34645C13.1112 4.36896 13.0896 4.39281 13.0694 4.41787L13.7011 4.92494ZM11.5086 6.36225C11.2285 6.71109 11.2846 7.22053 11.6334 7.50057C11.9823 7.78062 12.4923 7.72456 12.7724 7.37572L11.5086 6.36225ZM8.62151 3.50891C8.5552 3.0665 8.14285 2.7616 7.70049 2.8279C7.25801 2.89419 6.95313 3.30658 7.01944 3.74899L8.62151 3.50891ZM12.2496 7.67154C12.6928 7.61138 13.0033 7.20314 12.9431 6.75991C12.8829 6.31661 12.4747 6.00609 12.0314 6.06632L12.2496 7.67154ZM7.18522 3.12238L0.815346 11.0701L2.07944 12.0832L8.44925 4.13552L7.18522 3.12238ZM0.833922 11.0477C0.609973 11.3075 0.476615 11.6331 0.454291 11.9753L2.071 12.0809C2.0704 12.0899 2.06685 12.0987 2.06087 12.1056L0.833922 11.0477ZM0.453578 11.9907L0.302378 15.2555L1.92065 15.3305L2.07185 12.0656L0.453578 11.9907ZM0.305791 15.376C0.393995 16.2313 1.12866 16.8726 1.98796 16.8445L1.93499 15.2254C1.93154 15.2255 1.92984 15.2249 1.92874 15.2245C1.9272 15.224 1.92515 15.2229 1.92307 15.2211C1.92097 15.2192 1.91962 15.2174 1.91886 15.216C1.91831 15.2149 1.91759 15.2133 1.91724 15.2098L0.305791 15.376ZM2.14827 16.823L5.38831 16.0553L5.01463 14.4789L1.77468 15.2468L2.14827 16.823ZM5.40084 16.0521C5.73078 15.9683 6.02551 15.7817 6.24216 15.519L4.99239 14.4881C4.99498 14.485 4.99833 14.4829 5.00211 14.4819L5.40084 16.0521ZM6.24918 15.5103L12.7724 7.37572L11.5086 6.36225L4.98537 14.4968L6.24918 15.5103ZM8.45238 4.13573L10.1674 1.99733L8.90361 0.983765L7.18857 3.12217L8.45238 4.13573ZM10.1981 1.95653C10.3478 1.74364 10.6386 1.6865 10.8578 1.82693L11.7319 0.462967C10.7823 -0.14557 9.5218 0.102031 8.87293 1.02457L10.1981 1.95653ZM10.7767 1.7675L13.1926 3.77846L14.229 2.53335L11.813 0.522389L10.7767 1.7675ZM13.1375 3.72814C13.2195 3.81032 13.2653 3.92188 13.2646 4.038L14.8846 4.0469C14.8877 3.49858 14.6715 2.97178 14.2841 2.58368L13.1375 3.72814ZM13.2646 4.038C13.2641 4.15413 13.217 4.26517 13.1341 4.34645L14.2681 5.50345C14.6597 5.11963 14.8816 4.59523 14.8846 4.0469L13.2646 4.038ZM13.0694 4.41787L11.5086 6.36225L12.7724 7.37572L14.3328 5.43203L13.0694 4.41787ZM7.01944 3.74899C7.39668 6.26679 9.72678 8.01433 12.2496 7.67154L12.0314 6.06632C10.3867 6.2898 8.86753 5.15044 8.62151 3.50891L7.01944 3.74899Z" fill="#6366F1" />
                                    </svg>
                                </div>
                            ))}
                            <button className='cursor-pointer mt-6 mx-auto flex hover:opacity-75 transition-opacity'>
                                <svg width="40" height="40" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-fit'>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M30.5 28C30.5 29.1 29.604 30 28.5 30H4.5C3.396 30 2.5 29.1 2.5 28V4C2.5 2.9 3.396 2 4.5 2H28.5C29.604 2 30.5 2.9 30.5 4V28ZM28.5 0H4.5C2.291 0 0.5 1.79 0.5 4V28C0.5 30.21 2.291 32 4.5 32H28.5C30.709 32 32.5 30.21 32.5 28V4C32.5 1.79 30.709 0 28.5 0ZM22.5 15H17.5V10C17.5 9.45 17.052 9 16.5 9C15.948 9 15.5 9.45 15.5 10V15H10.5C9.948 15 9.5 15.45 9.5 16C9.5 16.55 9.948 17 10.5 17H15.5V22C15.5 22.55 15.948 23 16.5 23C17.052 23 17.5 22.55 17.5 22V17H22.5C23.052 17 23.5 16.55 23.5 16C23.5 15.45 23.052 15 22.5 15Z" fill="#6366F1" />
                                </svg>
                            </button>
                        </div>
                    </div>}

                    {/* Estimated Cost */}
                    {generatedWorkflow && <div className="bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">Cost Estimate</h3>
                        <div className="text-sm text-gray-600 mb-6">
                            Estimates based on selected frequency and API usage
                        </div>
                        <div className="flex gap-4 mb-8">
                            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition duration-200">Per day</button>
                            <button className="text-gray-700 hover:bg-gray-50 border border-gray-200 px-6 py-3 rounded-xl font-medium transition duration-200">Per month</button>
                        </div>
                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex justify-between items-center">
                                <span>LLM usage</span>
                                <span>$0.03</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 font-medium">
                                <span>APIs</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Gmail API</span>
                                <span>$0.01</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Slack API</span>
                                <span>$0.01</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t mt-4 font-medium text-base">
                                <span>Total per run</span>
                                <span>$0.05</span>
                            </div>
                        </div>
                    </div>}

                    {/* Action Buttons */}
                    {generatedWorkflow && <div className="flex gap-6 justify-center pt-8">
                        <button onClick={() => deployAgent(generatedWorkflow, agentPrompt)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl transition duration-200 font-semibold shadow-md hover:shadow-lg">
                            Deploy Agent
                        </button>
                        <button onClick={() => runAgent("59")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl transition duration-200 font-semibold shadow-md hover:shadow-lg">
                            Run
                        </button>
                        <button className="text-gray-700 hover:bg-gray-50 border border-gray-200 px-10 py-4 rounded-xl font-semibold transition duration-200">
                            Save Draft
                        </button>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default AgentCreationPage