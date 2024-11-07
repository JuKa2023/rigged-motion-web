import { Button } from "@/components/ui/button"
import React from "react"

export function AuctionObjectComponent() {
    return (
        <div className="relative w-full bg-[#0a001f] overflow-hidden">
            {/* Top image */}
            <div className="w-full flex justify-center mb-8">
                <div className="w-2/3 h-64 relative">
                    <Image
                        src="/placeholder.svg"
                        alt="Top image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            </div>

            <div className="relative h-[150vh]">
                {/* Central light beam */}
                <div
                    className="absolute left-1/2 h-full -translate-x-1/2 opacity-20"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)',
                        width: '10%',
                        clipPath: 'polygon(50% 0%, 100% 100%, -100% 100%)'
                    }}
                />

                {/* Boxes */}
                <div className="relative h-full">
                    {/* Top box */}
                    <motion.div
                        className="absolute left-[15%] top-[10%] w-48 h-48 bg-[#1a4747] rounded-lg flex items-center justify-center"
                        animate={{
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Mountain className="w-16 h-16 text-[#d4c5a1]" />
                    </motion.div>

                    {/* Middle box */}
                    <motion.div
                        className="absolute right-[15%] top-[50%] w-48 h-48 bg-[#1a4747] rounded-lg flex items-center justify-center"
                        animate={{
                            y: [0, 20, 0],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Mountain className="w-16 h-16 text-[#d4c5a1]" />
                    </motion.div>

                    {/* Bottom box */}
                    <motion.div
                        className="absolute left-[35%] bottom-[30%] w-48 h-48 bg-[#1a4747] rounded-lg flex items-center justify-center"
                        animate={{
                            y: [-20, 0, -20],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Mountain className="w-16 h-16 text-[#d4c5a1]" />
                    </motion.div>

                    {/* Bottom section */}
                    <div className="absolute bottom-0 w-full">
                        {/* Progress bar container */}
                        <div className="w-full max-w-3xl mx-auto mb-8">
                            <div className="bg-[#1a4747] p-8 rounded-lg">
                                <div className="h-2 bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-red-600 w-[60%]" />
                                </div>
                            </div>
                        </div>

                        {/* Tree silhouette divider */}
                        <div className="w-full h-24 bg-[url('/placeholder.svg')] bg-cover bg-bottom" />

                        {/* Content section */}
                        <div className="w-full bg-black py-12 px-4">
                            <div className="max-w-3xl mx-auto text-center space-y-8">
                                <p className="text-white text-sm">
                                    ES KOMMT IM PRESENT SEIN JEGLICHES UND AUF SEIN ENDE LANGT
                                </p>
                                <p className="text-white text-sm">
                                    BETTEN SIE JETZ MIT UNS DIE PRESENT REALISATION ZU ERREICHEN
                                </p>
                                <div className="space-y-4">
                                    <h2 className="text-white text-lg">AKTUELLES CREDIT</h2>
                                    <p className="text-white text-4xl font-bold">CHF 120'000</p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Button variant="outline" className="bg-white text-black hover:bg-gray-100">
                                        WIE FUNKTIONIERT DIE AKTION
                                    </Button>
                                    <Button variant="outline" className="bg-white text-black hover:bg-gray-100">
                                        DEN KREDIT ANFRAGEN
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}