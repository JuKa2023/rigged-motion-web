import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import React from "react"

export function ContactPageComponent() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2836] to-[#8e7a9f]">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-10">
                        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                            <span className="text-white">Bewege</span>{" "}
                            <span className="text-[#d4c5a1]">etwas mit uns</span>
                        </h1>
                        <form className="space-y-8">
                            <div>
                                <Input
                                    className="bg-white border-2 h-14 text-lg px-4"
                                    placeholder="Dein Name"
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    className="bg-white border-2 h-14 text-lg px-4"
                                    type="email"
                                    placeholder="Deine E-Mail-Adresse"
                                    required
                                />
                            </div>
                            <div>
                                <Textarea
                                    className="bg-white border-2 min-h-[200px] text-lg p-4"
                                    placeholder="Deine Nachricht an uns"
                                    required
                                />
                            </div>
                        </form>
                    </div>

                    <div className="lg:pl-16 mt-12 lg:mt-0">
                        <div className="space-y-8 text-white">
                            <h2 className="text-3xl font-bold">Rigged Motions Studios</h2>
                            <div className="space-y-4 text-lg">
                                <p className="text-[#d4c5a1]">Holzikhofenweg 8</p>
                                <p className="text-[#d4c5a1]">3800 Bern</p>
                                <p className="text-[#d4c5a1]">rigged.motion@gmail.com</p>
                                <p className="text-[#d4c5a1]">Tel: 076 378 66 83</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 sm:mt-16">
                    <Button
                        size="lg"
                        className="text-blue-900 px-8 py-4 text-lg"
                        style={{ backgroundColor: '#DBD2A4' }}
                    >
                        Kontaktieren <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </main>
        </div>
    )
}