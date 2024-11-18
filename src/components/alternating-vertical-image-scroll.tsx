"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function AlternatingVerticalImageScroll() {
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
                <div className="h-screen flex items-center justify-end p-4">
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
                                src="/assets/productPhotography_placeholder1.jpg"
                                alt="Product Photography Placeholder 1"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Second image - Left side */}
                <div className="h-screen flex items-center justify-start p-4">
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
                                src="/assets/productPhotography_placeholer2.jpg"
                                alt="Landscape 2"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Third image - Right side */}
                <div className="h-screen flex items-center justify-end p-4">
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
                                src="/assets/productPhotography_placeholder3.jpg"
                                alt="Landscape 3"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}