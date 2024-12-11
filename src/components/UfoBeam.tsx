import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Productpotogrtapohy1jpg from '/assets/productPhotography_placeholder1.jpg'
import Productpotogrtapohy2jpg from '/assets/productPhotography_placeholer2.jpg'
import Productpotogrtapohy3jpg from '/assets/productPhotography_placeholder3.jpg'

export function UfoBeam() {
    const [stars, setStars] = useState<{ x: number; y: number; delay: number }[]>([])

    useEffect(() => {
        const newStars = Array.from({ length: 20 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 2,
        }))
        setStars(newStars)
    }, [])

    return (
        <div className="relative min-h-screen w-full bg-[#0a001f] overflow-x-hidden">
            {/* Stars in the background */}
            {stars.map((star, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-300"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 2,
                        delay: star.delay,
                        repeat: Infinity,
                    }}
                />
            ))}

            {/* UFO */}
            <motion.div
                className="sticky top-20 w-full h-40 flex justify-center z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <div className="relative w-64 h-32">
                    {/* UFO Body */}
                    <div className="absolute w-full h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full bottom-0 backdrop-blur-lg border border-gray-600">
                        <div className="absolute inset-x-0 -top-2 h-4 bg-gradient-to-b from-blue-400 to-transparent rounded-full opacity-50" />
                    </div>
                    {/* UFO Top */}
                    <div className="absolute w-32 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full left-1/2 -translate-x-1/2 top-0 border border-gray-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
                    </div>
                    {/* UFO Lights */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bottom-2 w-3 h-3 bg-blue-400 rounded-full"
                            style={{ 
                                left: `${20 + i * 15}%`,
                                boxShadow: '0 0 10px rgba(96, 165, 250, 0.8)'
                            }}
                            animate={{ 
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Central light beam */}
            <div className="absolute left-1/2 h-full w-full -translate-x-1/2">
                <div
                    className="h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
                    style={{
                        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                    }}
                />
            </div>

            {/* Alternating images with animations */}
            <div className="relative mx-auto max-w-4xl">
                {/* First image - Right side */}
                <div className="h-screen flex items-center lg:justify-end sm:justify-center p-4">
                    <motion.div
                        className="w-64 aspect-[4/5]"
                        animate={{
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-full h-full">
                            <img
                                src={Productpotogrtapohy1jpg}
                                alt="Product Photography Placeholder 1"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Second image - Left side */}
                <div className="h-screen flex items-center lg:justify-start sm:justify-center p-4">
                    <motion.div
                        className="w-64 aspect-[4/5]"
                        animate={{
                            y: [0, 20, 0],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-full h-full">
                            <img
                                src={Productpotogrtapohy2jpg}
                                alt="Product Photography 2"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Third image - Right side */}
                <div className="h-screen flex items-center lg:justify-end sm:justify-center p-4">
                    <motion.div
                        className="w-64 aspect-[4/5]"
                        animate={{
                            y: [-20, 0, -20],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-full h-full">
                            <img
                                src={Productpotogrtapohy3jpg}
                                alt="Product Photography 3"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
} 