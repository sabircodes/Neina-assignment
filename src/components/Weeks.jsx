import React from 'react'

const Weeks = () => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <div className="rounded-full px-5 py-2 bg-gray-300 text-gray-700 hover:bg-orange-500 hover:text-white transition-colors duration-300 cursor-pointer">
        Daily
      </div>
      <div className="rounded-full px-5 py-2 bg-gray-300 text-gray-700 hover:bg-orange-500 hover:text-white transition-colors duration-300 cursor-pointer">
        Weekly
      </div>
      <div className="rounded-full px-5 py-2 bg-gray-300 text-gray-700 hover:bg-orange-500 hover:text-white transition-colors duration-300 cursor-pointer">
        Monthly
      </div>
    </div>
  )
}

export default Weeks
