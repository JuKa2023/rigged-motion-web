import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import {useEffect} from "react";

export function ContactPageComponent() {

    useEffect(() => {
        const widgetScriptSrc = 'https://tally.so/widgets/embed.js';

        const load = () => {
            // Load Tally embeds
            if (typeof Tally !== 'undefined') {
                Tally.loadEmbeds();
                return;
            }

            // Fallback if window.Tally is not available
            document
                .querySelectorAll('iframe[data-tally-src]:not([src])')
                .forEach((iframeEl) => {
                    iframeEl.src = iframeEl.dataset.tallySrc;
                });
        };

        // If Tally is already loaded, load the embeds
        if (typeof Tally !== 'undefined') {
            load();
            return;
        }

        // If the Tally widget script is not loaded yet, load it
        if (document.querySelector(`script[src="${widgetScriptSrc}"]`) === null) {
            const script = document.createElement('script');
            script.src = widgetScriptSrc;
            script.onload = load;
            script.onerror = load;
            document.body.appendChild(script);
            return;
        }
    }, []);

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-10">
                        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                            <span className="text-white">Bewege</span>{" "}
                            <span className="text-[#d4c5a1]">etwas mit uns</span>
                        </h1>
                        <iframe
                            data-tally-src="https://tally.so/embed/nGYdpo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                            loading="lazy" width="100%" height="0" frameBorder="0" marginHeight="0" marginWidth="0"
                            title="Contact form
                        "></iframe>
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