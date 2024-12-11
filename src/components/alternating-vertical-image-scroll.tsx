import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import  Productpotogrtapohy1jpg from '/assets/productPhotography_placeholder1.jpg';
import  Productpotogrtapohy2jpg from '/assets/productPhotography_placeholer2.jpg';
import  Productpotogrtapohy3jpg from '/assets/productPhotography_placeholder3.jpg';

export function AlternatingVerticalImageScroll() {
    const [stars, setStars] = useState<{ x: number; y: number; delay: number; size: number }[]>([])

    useEffect(() => {
        const newStars = Array.from({ length: 50 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 2,
            size: Math.random() * 2 + 1 // Random size between 1-3px
        }))
        setStars(newStars)
    }, [])

    return (
        <div className="absolute inset-0 bg-[#0a001f] overflow-hidden">
            {/* Stars in the background */}
            {stars.map((star, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        delay: star.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Central light beam */}
            <div className="absolute left-1/2 h-full w-full -translate-x-1/2">
                <motion.div
                    className="h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-10"
                    style={{
                        clipPath: "polygon(49% 0%, 51% 0%, 65% 100%, 35% 100%)",
                    }}
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Alternating images with animations */}
            <div className="relative mx-auto max-w-5xl h-full flex flex-col justify-center">
                <div className="grid grid-cols-3 gap-8 px-4">
                    {/* Left image */}
                    <motion.div
                        className="aspect-[3/4] relative"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ 
                            y: [50, 0, 50],
                            opacity: 1
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <img
                            src={Productpotogrtapohy1jpg}
                            alt="Product 1"
                            className="w-full h-full object-cover rounded-lg shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                    </motion.div>

                    {/* Center image */}
                    <motion.div
                        className="aspect-[3/4] relative"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ 
                            y: [-50, 0, -50],
                            opacity: 1
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <img
                            src={Productpotogrtapohy2jpg}
                            alt="Product 2"
                            className="w-full h-full object-cover rounded-lg shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                    </motion.div>

                    {/* Right image */}
                    <motion.div
                        className="aspect-[3/4] relative"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ 
                            y: [50, 0, 50],
                            opacity: 1
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <img
                            src={Productpotogrtapohy3jpg}
                            alt="Product 3"
                            className="w-full h-full object-cover rounded-lg shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}