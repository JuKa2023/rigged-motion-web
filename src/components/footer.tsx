import React from 'react';

export function FooterComponent () {
    return(

    <footer className="container mx-auto py-6 flex justify-between items-center">
        <div
            className="flex justify-between items-center border-t border-opacity-200 pt-4 w-full px-12"
            style={{borderTopColor: '#DBD2A4', borderTopWidth: '5px'}}
        >
            <div className="text-sm text-white">&copy; 2024 Rigged Motion Studios. All rights reserved.</div>
            <nav className="ml-auto w-1/3 flex justify-end space-x-8 gap-4">
                <a href="#">AGB</a>
                <a href="#">Impressum</a>
                <a href="#">Datenschutz</a>
            </nav>
        </div>
    </footer>
    )
}