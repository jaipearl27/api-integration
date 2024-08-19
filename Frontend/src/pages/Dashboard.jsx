import React, { useState } from 'react'
import SearchForm from './SearchForm'
import VisualizationForm from './VisualizationForm'

const Dashboard = () => {
    const [toggleForm, setToggleForm] = useState(true)

    return (
        <>
            <div className='w-full py-5 flex justify-center'>
                <div className='flex flex-wrap w-full md:w-1/3'>
                    <button className='w-full md:w-1/2 p-1 text-center rounded-sm bg-blue-500 hover:bg-blue-700 text-white transition duration-300' onClick={() => setToggleForm(true)}>Search Form</button>
                    <button className='w-full md:w-1/2 p-1 text-center rounded-sm bg-green-600 hover:bg-green-700 text-white transition duration-300' onClick={() => setToggleForm(false)}>Visualization Form</button>
                </div>
            </div>
            {toggleForm ? (
                <SearchForm />
            ) : (
                <VisualizationForm />
            )}
        </>
    )
}

export default Dashboard