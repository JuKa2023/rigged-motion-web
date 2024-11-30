import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Award, Box } from 'lucide-react'
import placeholderpng from '/assets/placeholder.png'

export function LandingPageComponent() {
  return (
      <main className="container mx-auto px-4">
          <section className="py-20 text-center">
              <h1 className="text-7xl font-bold mb-6 bg-clip-text text-white">
                  Rigged Motion Studios</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                  Willkommen bei Rigged Motion Studios, Ihrem kreativen Partner für beeindruckende 3D-Animationen
                  für
                  Werbezwecke. Wir sind ein junges, dynamisches Team von Designern und Animatoren, das mit
                  Leidenschaft
                  und frischen Ideen daran arbeitet, Deine Visionen zum Leben zu erwecken.</p>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                  Mit modernster Technologie und einem Auge für Details gestalten wir visuelle Erlebnisse, die
                  begeistern und in Erinnerung bleiben.</p>
              <div className="flex justify-center space-x-4">
                  <Button>
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
                      },
                      {
                          title: 'Visual Effects',
                          icon: Award,
                      },
                      {
                          title: 'Virtual Tours',
                          icon: Box,
                      },
                  ].map((service, index) => (
                      <Card
                          key={index}
                          className="border-none hover:bg-blue-700 transition-colors duration-300"
                          style={{backgroundColor: '#1E4959'}}
                      >
                          <CardHeader className="flex justify-center items-center">
                              {/* Icon styled to take up full width and centered */}
                              <service.icon
                                  className="w-full h-24"  // Adjust the height as needed
                                  style={{color: '#ffffff'}}
                              />
                          </CardHeader>
                          <CardContent>
                              <CardTitle className="text-xl font-bold" style={{color: '#DBD2A4'}}>
                                  {service.title}
                              </CardTitle>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </section>

          <section className="py-16">
              <h2 className="text-3xl font-bold mb-8 text-center">About Our Team</h2>

              {/* Center the image */}
              <div className="flex justify-center mb-8">
                  <img
                      src={placeholderpng}
                      alt="Our Team"
                      className="rounded-lg shadow-md"
                      style={{maxWidth: '80%', height: 'auto'}} // Ensures responsive scaling
                  />
              </div>

              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                  We are a team of passionate multimedia students who share a love for 3D animations and VFX.
                  During our studies, we discovered the joy of bringing ideas to life and telling stories visually.
              </p>

              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                  Each of us brings unique creative approaches and skills that we combine in collaborative projects.
                  We're curious, experimental, and always looking for new challenges.
              </p>
          </section>

      </main>
  )
}