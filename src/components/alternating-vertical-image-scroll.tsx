import React from 'react'


export function AlternatingVerticalImageScroll() {
  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      {/* Image containers */}
      <div className="relative mx-auto max-w-4xl">
        {/* First image - Right side */}
        <div className="h-screen flex items-center justify-end p-4">
          <div className="w-64 h-64">
            <img
              src="/placeholder.svg?height=256&width=256"
              alt="Landscape 1"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Second image - Left side */}
        <div className="h-screen flex items-center justify-start p-4">
          <div className="w-64 h-64">
            <img
              src="/placeholder.svg?height=256&width=256"
              alt="Landscape 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Third image - Right side */}
        <div className="h-screen flex items-center justify-end p-4">
          <div className="w-64 h-64">
            <img
              src="/placeholder.svg?height=256&width=256"
              alt="Landscape 3"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

