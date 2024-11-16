import React from 'react'
import { Button } from "@/components/ui/button"

export function auctionpricecomponent() {
    return (
        <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16 space-y-16 text-center">
            <div className="space-y-4 max-w-3xl">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight uppercase">
                    Es könnte ihr produkt sein welches hier auf der erde landet
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl uppercase">
                    Bieten sie jetz mit um ihr produkt galaktisch zu bewerben
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl uppercase">Aktuelles Gebot</h2>
                <p className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                    CHF 120&apos;000
                </p>
            </div>

            <div className="flex flex-row gap-4 w-full max-w-2xl justify-center">
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