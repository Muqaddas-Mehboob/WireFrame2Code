import React from 'react'
import ImageUpload from './_components/ImageUpload'

function Dashboard() {
    return (
        <div className='lg:px-4 xl:px-60'>
            <h2 className='font-bold text-3xl'>Convert Wireframe to code</h2>
            <ImageUpload />
        </div>
    )
}

export default Dashboard