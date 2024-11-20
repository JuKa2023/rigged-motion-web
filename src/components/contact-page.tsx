import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function ContactPageComponent() {
    return (
        <div className="min-h-screen">
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
                                    placeholder="Dein Name"
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Deine E-Mail-Adresse"
                                    required
                                />
                            </div>
                            <div>
                                <Textarea
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
                    <Button>
                        Kontaktieren <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </main>
        </div>
    )
}