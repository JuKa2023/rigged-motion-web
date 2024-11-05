# Rigged Motion Studios - Diggezz2

A modern web application built with React, TypeScript, and Tailwind CSS, featuring a landing page for Rigged Motion Studios' 3D animation and visual effects services.

## 🚀 Features

- Responsive landing page design
- Dark/Light mode support
- Modern UI components using shadcn/ui
- Gradient backgrounds and custom animations
- Service showcase cards
Team information section

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- Radix UI primitives

## 📦 Installation

1. Clone the repository:

```md
git clone <https://github.com/your-username/rigged-Motion-Studios_Diggezz2.git>
cd rigged-Motion-Studios_Diggezz2
```

1. Install dependencies:

```md
nmp install
```

1. Start the development server:

```md
npm run dev
```

## 🏗️ Project Structure

- /src - Source code
  - /components - React components
    - /ui - Reusable UI components
- /lib - Utility functions
- /assets - Static assets

## 🎨 Styling

The project uses Tailwind CSS with custom theme configuration. The theme includes:

- Custom color schemes for light/dark modes
- Custom border radius variables
- Chart color variables
- Responsive design utilities
Reference to theme configuration:

```Js

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
   './src/**/*.html',
   './src/**/*.js',
   './src/**/*.tsx',
   './src/**/*.ts',
 ],
  theme: {
   extend: {
    borderRadius: {
     lg: 'var(--radius)',
     md: 'calc(var(--radius) - 2px)',
     sm: 'calc(var(--radius) - 4px)'
    },
    colors: {
     background: 'hsl(var(--background))',
     foreground: 'hsl(var(--foreground))',
     card: {
      DEFAULT: 'hsl(var(--card))',
      foreground: 'hsl(var(--card-foreground))'
     },
     popover: {
      DEFAULT: 'hsl(var(--popover))',
      foreground: 'hsl(var(--popover-foreground))'
     },
     primary: {
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))'
     },
     secondary: {
      DEFAULT: 'hsl(var(--secondary))',
      foreground: 'hsl(var(--secondary-foreground))'
     },
     muted: {
      DEFAULT: 'hsl(var(--muted))',
      foreground: 'hsl(var(--muted-foreground))'
     },
     accent: {
      DEFAULT: 'hsl(var(--accent))',
      foreground: 'hsl(var(--accent-foreground))'
     },
     destructive: {
      DEFAULT: 'hsl(var(--destructive))',
      foreground: 'hsl(var(--destructive-foreground))'
     },
     border: 'hsl(var(--border))',
     input: 'hsl(var(--input))',
     ring: 'hsl(var(--ring))',
     chart: {
      '1': 'hsl(var(--chart-1))',
      '2': 'hsl(var(--chart-2))',
      '3': 'hsl(var(--chart-3))',
      '4': 'hsl(var(--chart-4))',
      '5': 'hsl(var(--chart-5))'
     }
    }
   }
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 🧩 Components

The project includes several reusable components:

- Button
- Card
- Input
- Landing Page

The main landing page component can be found here:

```Js
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
            We're your creative partner for stunning 3D animations and visual effects.
            Transform your ideas into captivating visual experiences.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Explore Auctions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-900">
              Our Services <Play className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '3D Animation', icon: Box, description: 'Breathtaking 3D animations that bring your ideas to life.' },
              { title: 'Visual Effects', icon: Award, description: 'Stunning visual effects that elevate your project to the next level.' },
              { title: 'Virtual Tours', icon: Box, description: 'Immersive virtual tours that showcase your space in incredible detail.' },
            ].map((service, index) => (
              <Card key={index} className="bg-blue-800 border-none hover:bg-blue-700 transition-colors duration-300">
                <CardHeader>
                  <service.icon className="h-12 w-12 mb-4 text-blue-400" />
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{service.description}</p>
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

```

## 📝 License

© 2024 Rigged Motion Studios. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 🔧 Environment Setup

```Js
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": ["src"],
}
```
