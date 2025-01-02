import { UfoBeam } from "./UfoBeam";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Auctionpricecomponent } from "./auctionprice";

export function AuctionPageComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="relative bg-[#0a001f]">
      {/* Initial title view */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-screen flex items-center justify-center text-center z-10 pointer-events-none"
        style={{ opacity: titleOpacity }}
      >
        <div className="max-w-2xl mx-auto p-4 space-y-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-5xl text-white">
            Dein Produkt im
            <span className=" text-[#DBD2A4] px-4">
               Galaktischen Rampenlicht
            </span>
          </h1>
          <p className="text-3xl text-white">
            Sichere dir einen exklusiven Werbeplatz in unserem
            UFO-Video
          </p>
        </div>
      </motion.div>

      {/* Scrollable content */}
      <div className="min-h-fit relative">
        {/* UFO and Beam with images */}
        <UfoBeam />

        <div className="sticky top-[60vh] w-full max-w-4xl mx-auto px-4 z-20 mb-24">
          <div className="text-center mt-8 space-y-10">
            <h3 className="text-2xl font-bold text-white">
              Premium Werbeplatz
            </h3>
            <p className="text-gray-300">
              Dies könnte dein Produkt sein, steigere jetzt mit!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="backdrop-blur-sm bg-black/20 p-8 rounded-lg border border-[#1E4959]/30">
                <h4 className="font-semibold mb-2">
                  Professionelle Integration
                </h4>
                <p className="text-sm text-gray-300">
                  Dein Produkt wird ganz nach deinen Wünschen in das Video eingebaut               </p>
              </div>
              <div className="backdrop-blur-sm bg-black/20 p-8 rounded-lg border border-[#1E4959]/30">
                <h4 className="font-semibold mb-2">Maximale Reichweite</h4>
                <p className="text-sm text-gray-300">
                  Marketing auf allen Plattformen                </p>
              </div>
              <div className="backdrop-blur-sm bg-black/20 p-8 rounded-lg border border-[#1E4959]/30">
                <h4 className="font-semibold mb-2">Herausstechen</h4>
                <p className="text-sm text-gray-300">
                  Hebe dich von der Konkurrenz ab</p>
              </div>
            </div>
            <div className="space-y-4 text-center mt-104">
              <h4 className="text-xl font-semibold text-white">Ablauf</h4>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-left">
                <div className="backdrop-blur-sm bg-black/20 p-8 rounded-lg border border-[#1E4959]/30 text-center">
                  <h5 className="font-semibold mb-2">
                    1. Teilnahme an der Auktion
                  </h5>
                  <p className="text-gray-300">
                    Sichere dir den Platz durch eine Gebotsabgab.                  </p>
                </div>

                <div className="backdrop-blur-sm bg-black/20 p-8 rounded-lg border border-[#1E4959]/30 text-center">
                  <h5 className="font-semibold mb-4">
                    2. Bereitstellung der Produktinformationen
                  </h5>
                  <p className="text-gray-300">
                    Teile uns mit, was dein Produkt ist.                  </p>
                </div>
                <div className="backdrop-blur-sm bg-black/20 p-8 rounded-lg border border-[#1E4959]/30 text-center">
                  <h5 className="font-semibold mb-4">
                    3. Konzeption und Produktion
                  </h5>
                  <p className="text-gray-300">
                    Unser Team integriert dein Produkt in den Werbespot.                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Auctionpricecomponent />
    </div>
  );
}
