

const HomePage = () => {
    return (
        <div className='w-full h-full grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4'>
           {
            Array.from({length:30}).map((value, index) => (
                <div className='border border-red-500' key={index}>
                    <h1>test</h1>
                </div>
            ))
           }
        </div>
    )
}

export default HomePage