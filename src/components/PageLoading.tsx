import React from 'react'

export const PageLoading: React.FC<any> = () => {
  return (
    <div>
      <div className="fixed inset-0 opacity-40 bg-white dark:bg-gray-900 z-20"></div>
      <div className="fixed inset-0 z-20">
        <span className="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative">
          <div className="flex justify-center items-center">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </span>
      </div>
    </div>
  )
}
