import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Palette,
  Type,
  ImageIcon,
  Layout,
  CheckCircle2,
  Users,
  Shield,
  Server,
  Star,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm fixed top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">CMS-Builder</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Start for free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex-1">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Build. Launch. <span className="text-blue-600">Grow.</span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
              with CMS-Builder
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            The all-in-one visual CMS builder for creators, startups, and businesses. Design, manage, and publish your website with ease—no coding, just creativity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg bg-transparent"
              >
                Start for free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Builder Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-100/60 to-green-100/60 rounded-3xl p-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-200">
                {/* --- Builder-like UI Mockup --- */}
                <div className="h-96 flex flex-col">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white/80">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-700">CMS-Builder</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">Publish</Button>
                      <Button size="sm" variant="outline" className="border-gray-300 text-gray-700">Preview</Button>
                    </div>
                  </div>
                  <div className="flex flex-1 min-h-0">
                    {/* Sidebar */}
                    <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Type className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Layout className="w-5 h-5 text-yellow-600" />
                      </div>
                    </div>
                    {/* Canvas */}
                    <div className="flex-1 bg-gray-100 flex items-center justify-center relative">
                      {/* Example draggable blocks */}
                      <div className="absolute left-1/4 top-1/4 w-48 h-24 bg-white rounded-lg shadow-md border border-blue-200 flex items-center justify-center text-blue-700 font-semibold text-lg cursor-move">
                        <Type className="w-5 h-5 mr-2" /> Heading Block
                      </div>
                      <div className="absolute left-1/2 top-1/2 w-40 h-16 bg-white rounded-lg shadow-md border border-green-200 flex items-center justify-center text-green-700 font-semibold text-base cursor-move">
                        <ImageIcon className="w-5 h-5 mr-2" /> Image Block
                      </div>
                    </div>
                    {/* Properties Panel */}
                    <div className="w-64 bg-white border-l border-gray-200 p-4 flex flex-col">
                      <h4 className="font-semibold text-gray-700 mb-4">Properties</h4>
                      <div className="mb-2">
                        <label className="block text-xs text-gray-500 mb-1">Text</label>
                        <input className="w-full border border-gray-200 rounded px-2 py-1 text-sm" value="Heading Block" readOnly />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs text-gray-500 mb-1">Font Size</label>
                        <input className="w-full border border-gray-200 rounded px-2 py-1 text-sm" value="32" readOnly />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs text-gray-500 mb-1">Color</label>
                        <input className="w-full border border-gray-200 rounded px-2 py-1 text-sm" value="#2563eb" readOnly />
                      </div>
                      <Button size="sm" className="mt-4 bg-blue-600 text-white hover:bg-blue-700">Apply</Button>
                    </div>
                  </div>
                </div>
                {/* --- End Builder-like UI Mockup --- */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-500">Build and publish websites in minutes, not hours.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Palette className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Design Freedom</h3>
            <p className="text-gray-500">Complete creative control with our visual editor.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Publish Anywhere</h3>
            <p className="text-gray-500">Export clean code or publish directly to the web.</p>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">Built for every team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-gray-200 bg-white">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Agencies & Freelancers</h3>
            <p className="text-gray-600 mb-4">Deliver client sites faster with reusable components and exports.</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> Client-friendly editing</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> Exportable HTML/CSS/JSON</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> Project templates</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 bg-white">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Startups & Teams</h3>
            <p className="text-gray-600 mb-4">Iterate on marketing pages without waiting on engineering cycles.</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> Versioned projects</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> Preview mode</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> One-click publish</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 bg-white">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprises</h3>
            <p className="text-gray-600 mb-4">Keep governance while empowering teams to ship quickly.</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> Role-based access</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> Audit-friendly exports</li>
              <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-green-600 mr-2" /> Self-host ready</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold mb-4">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & drop</h3>
              <p className="text-gray-600">Choose from text, images, buttons, and more. Place them exactly where you need.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold mb-4">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize</h3>
              <p className="text-gray-600">Refine properties, typography, spacing, and layers with pixel precision.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold mb-4">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview & export</h3>
              <p className="text-gray-600">Preview exactly what your users will see. Export clean HTML/CSS/JSON.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-gray-200 p-8 bg-white">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <Image src="/placeholder-logo.svg" alt="Integration" width={100} height={24} />
            <Image src="/placeholder-logo.svg" alt="Integration" width={100} height={24} />
            <Image src="/placeholder-logo.svg" alt="Integration" width={100} height={24} />
            <Image src="/placeholder-logo.svg" alt="Integration" width={100} height={24} />
            <Image src="/placeholder-logo.svg" alt="Integration" width={100} height={24} />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">Loved by creators</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">“CMS-Builder helped us launch our new marketing site in a day. The visual editor is unbelievably smooth.”</p>
              <div className="flex items-center gap-3">
                <Image src="/placeholder-user.jpg" alt="User" width={36} height={36} className="rounded-full" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">Alex Johnson</div>
                  <div className="text-xs text-gray-500">Founder, PixelWave</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-green-500 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Start building for free</h3>
            <p className="text-white/90">Upgrade anytime. No credit card required to get started.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">Create account</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Sign in</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Can I export the code and host it myself?</AccordionTrigger>
            <AccordionContent>
              Yes. You can export HTML, CSS, and JSON. Host anywhere or integrate with your stack.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is there an autosave feature?</AccordionTrigger>
            <AccordionContent>
              Changes are auto-saved every few seconds and synced with your project.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Do I need to know how to code?</AccordionTrigger>
            <AccordionContent>
              No. It’s fully visual, but developers can still export code for full control.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-lg font-bold text-gray-900">CMS-Builder</span>
          </div>
          <div className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} CMS-Builder. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
