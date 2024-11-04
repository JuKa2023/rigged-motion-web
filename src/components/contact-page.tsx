import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactPageComponent() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2836] to-[#8e7a9f]">
            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <h1 className="text-5xl font-bold">
                            <span className="text-white">Bewege</span>{" "}
                            <span className="text-[#d4c5a1]">etwas mit uns</span>
                        </h1>
                        <form className="space-y-6">
                            <div>
                                <Input
                                    className="bg-white border-2 h-12 text-lg"
                                    placeholder="Dein Name"
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    className="bg-white border-2 h-12 text-lg"
                                    type="email"
                                    placeholder="Deine E-Mail-Adresse"
                                    required
                                />
                            </div>
                            <div>
                                <Textarea
                                    className="bg-white border-2 min-h-[200px] text-lg"
                                    placeholder="Deine Nachricht an uns"
                                    required
                                />
                            </div>
                        </form>
                    </div>

                    <div className="lg:pl-12">
                        <div className="space-y-6 text-white">
                            <h2 className="text-3xl font-bold">Rigged Motions Studios</h2>
                            <div className="space-y-2 text-lg">
                                <p className="text-[#d4c5a1]">Holzikhofenweg 8</p>
                                <p className="text-[#d4c5a1]">3800 Bern</p>
                                <p className="text-[#d4c5a1]">rigged.motion@gmail.com</p>
                                <p className="text-[#d4c5a1]">Tel: 076 378 66 83</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}