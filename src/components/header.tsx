import React from 'react'


export function HeaderComponent() {
    return (
        <header className="container mx-auto py-6 flex justify-between items-center">
            <div
                className="flex justify-between items-center border-b border-white border-opacity-200 pb-4 w-full px-12"
                style={{borderBottomColor: '#DBD2A4', borderBottomWidth: '5px'}}>
                <a href="#"> <img src="/assets/Riggedmotion.svg" alt="logo" className="h-8 flex-shrink-0"/> </a>
                <nav className="ml-auto w-1/3 flex justify-end space-x-8 gap-4">
                    <a href="#" className="text-white hover:text-gray-300 text-lg font-semibold">Versteigerung</a>
                    <a href="#" className="text-white hover:text-gray-300 text-lg font-semibold">Kontakt</a>
                </nav>
            </div>
        </header>
    )
}
