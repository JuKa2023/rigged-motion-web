import React from 'react'
import { Button } from "@/components/ui/button"

export function Auctionpricecomponent() {
    return (
        <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16 space-y-16 text-center">
            {/* Header Section */}
            <div className="space-y-4 max-w-3xl">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight uppercase">
                    Es könnte ihr Produkt sein welches hier auf der Erde landet
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl uppercase">
                    Bieten Sie jetzt mit, um Ihr Produkt galaktisch zu bewerben
                </p>
            </div>

            {/* Current Bid Section */}
            <div className="space-y-4">
                <h2 className="text-xl uppercase">Aktuelles Gebot</h2>
                <p className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                    CHF 120&apos;000
                </p>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl justify-center items-center">
                <Button
                    variant="secondary"
                >
                    Wie funktioniert die Auktion
                </Button>
                <Button
                    variant="secondary"
                >
                    Dein Gebot abgeben
                </Button>
            </div>
        </section>
    )
}