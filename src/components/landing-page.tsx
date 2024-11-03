import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Play, Award, Box } from 'lucide-react'

export function LandingPageComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#102532] to-[#DCA8CA] text-white font-sans">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex justify-between items-center border-b border-white border-opacity-200 pb-4 w-full px-12"  style={{ borderBottomColor: '#DBD2A4', borderBottomWidth: '5px' }}>
            <a href="#"> <img src="src/assets/Riggedmotion.svg" alt="logo" className="h-8 flex-shrink-0"/> </a>
          <nav className="ml-auto w-1/3 flex justify-end space-x-8 gap-4">
            <a href="#" className="text-white hover:text-gray-300 text-lg font-semibold">Versteigerung</a>
            <a href="#" className="text-white hover:text-gray-300 text-lg font-semibold">Kontakt</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4">
          <section className="py-20 text-center">
              <h1 className="text-7xl font-bold mb-6 bg-clip-text text-white">
                  Rigged Motion Studios</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                  Willkommen bei Rigged Motion Studios, Ihrem kreativen Partner für beeindruckende 3D-Animationen für
                  Werbezwecke. Wir sind ein junges, dynamisches Team von Designern und Animatoren, das mit Leidenschaft
                  und frischen Ideen daran arbeitet, Deine Visionen zum Leben zu erwecken.</p>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                  Mit modernster Technologie und einem Auge für Details gestalten wir visuelle Erlebnisse, die
                  begeistern und in Erinnerung bleiben.</p>
              <div className="flex justify-center space-x-4">
                  <Button
                      size="lg"
                      className="text-blue-900"
                      style={{backgroundColor: '#DBD2A4'}}
                  >
                      Explore Auctions <ArrowRight className="ml-2 h-4 w-4"/>
                  </Button>
              </div>
          </section>


          <section className="py-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                      {
                          title: '3D Animation',
                          icon: Box,
                          description: 'Breathtaking 3D animations that bring your ideas to life.'
                      },
                      {
                          title: 'Visual Effects',
                          icon: Award,
                          description: 'Stunning visual effects that elevate your project to the next level.' },
              { title: 'Virtual Tours', icon: Box, description: 'Immersive virtual tours that showcase your space in incredible detail.' },
            ].map((service, index) => (
              <Card key={index} className="border-none hover:bg-blue-700 transition-colors duration-300" style={{backgroundColor: '#1E4959'}}>
                <CardHeader>
                  <service.icon className="h-12 w-12 mb-4 text-blue-400" />

                </CardHeader>
                <CardContent>
                    <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">About Our Team</h2>
          <Card className="bg-blue-800 border-none">
            <CardContent className="p-6 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <img src="/placeholder.svg?height=300&width=400" alt="Our Team" className="rounded-lg shadow-md" />
              </div>
              <div className="md:w-1/2 md:pl-6">
                <p className="text-lg">
                  We are a team of passionate multimedia students who share a love for 3D animations and VFX. 
                  During our studies, we discovered the joy of bringing ideas to life and telling stories visually. 
                  Each of us brings unique creative approaches and skills that we combine in collaborative projects. 
                  We're curious, experimental, and always looking for new challenges.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

      </main>

      <footer className="bg-blue-900 py-8 mt-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">&copy; 2024 Rigged Motion Studios. All rights reserved.</div>
          <nav className="flex space-x-4">
            <Button variant="link" className="text-sm text-white hover:text-blue-200">Terms</Button>
            <Button variant="link" className="text-sm text-white hover:text-blue-200">Privacy</Button>
            <Button variant="link" className="text-sm text-white hover:text-blue-200">Imprint</Button>
          </nav>
        </div>
      </footer>
    </div>
  )
}