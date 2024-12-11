import { useAuth } from "@/contexts/AuthContext"
import { GoogleSignInComponent } from "./GoogleSignIn"
import { UfoBeam } from "./UfoBeam"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Auctionpricecomponent } from "./auctionprice"

export function AuctionPageComponent() {
  const { user, isLoading } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Keep title visible longer
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const videoScale = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1])
  const videoOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1])

  return (
    <div ref={containerRef} className="relative bg-[#0a001f]">
      {/* Initial title view */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-screen flex items-center justify-center text-center z-10 pointer-events-none"
        style={{ opacity: titleOpacity }}
      >
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Ihr Produkt im
            <span className="block text-[#DBD2A4]">Rampenlicht</span>
          </h1>

          {!isLoading && !user && (
            <div className="pointer-events-auto">
              <GoogleSignInComponent className="mx-auto" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Scrollable content */}
      <div className="min-h-[400vh] relative">
        {/* UFO and Beam with images */}
        <UfoBeam />

        {/* Video section */}
        <motion.div
          ref={videoRef}
          className="sticky top-[60vh] w-full max-w-4xl mx-auto px-4 z-20"
          style={{
            scale: videoScale,
            opacity: videoOpacity
          }}
        >
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-lg border border-blue-400/30">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              src="/assets/ufo-video.mp4"
              poster="/assets/productPhotography_placeholder1.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="text-center mt-8 space-y-4">
            <h3 className="text-2xl font-bold text-white">Werbespot Platzierung</h3>
            <p className="text-gray-300">
              Präsentieren Sie Ihr Produkt in unserer nächsten Kampagne
            </p>
          </div>
        </motion.div>
      </div>

      {/* Auction section */}
      <div className="relative bg-gradient-to-r from-[#102532] to-[#DCA8CA] py-20">
        <Auctionpricecomponent />
      </div>
    </div>
  )
}