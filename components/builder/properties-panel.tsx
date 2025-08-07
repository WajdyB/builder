"use client"

import { useBuilderStore } from "@/lib/store/builder-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { 
  Type, 
  Palette, 
  Layout, 
  Move, 
  Link as LinkIcon,
  Image as ImageIcon,
  Settings,
  FileText,
  MessageSquare,
  Mail,
  DollarSign,
  User,
  Globe,
  Video,
  Grid3X3,
  Layers,
  CheckSquare,
  Circle,
  ChevronDown,
  Tag,
  Play,
  Share2,
  HelpCircle,
  Copy,
  Trash2
} from "lucide-react"

export function PropertiesPanel() {
  const { selectedElement, updateElement, deleteElement, duplicateElement } = useBuilderStore()

  if (!selectedElement) {
    return (
      <div className="h-full bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-4">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <Settings className="w-8 h-8 mx-auto mb-2" />
          <p>Select a component to edit its properties</p>
        </div>
      </div>
    )
  }

  const handlePropertyChange = (property: string, value: any) => {
    updateElement(selectedElement.id, { [property]: value })
  }

  const handleDelete = () => {
    if (selectedElement) {
      deleteElement(selectedElement.id)
    }
  }

  const handleDuplicate = () => {
    if (selectedElement) {
      duplicateElement(selectedElement.id)
    }
  }

  const renderTextProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Text Content</Label>
          <Textarea
            value={selectedElement.properties.text || ""}
            onChange={(e) => handlePropertyChange("text", e.target.value)}
            placeholder="Enter your text content (leave empty for no text)..."
            rows={4}
          />
        </div>
        <div>
          <Label>Font Family</Label>
          <Select value={selectedElement.properties.fontFamily || "Inter"} onValueChange={(value) => handlePropertyChange("fontFamily", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Font Weight</Label>
          <Select value={selectedElement.properties.fontWeight || "normal"} onValueChange={(value) => handlePropertyChange("fontWeight", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="100">Thin</SelectItem>
              <SelectItem value="300">Light</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="700">Semi Bold</SelectItem>
              <SelectItem value="900">Black</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Text Alignment</Label>
          <Select value={selectedElement.properties.textAlign || "left"} onValueChange={(value) => handlePropertyChange("textAlign", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="justify">Justify</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderHeadingProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Heading Text</Label>
          <Input
            value={selectedElement.properties.text || ""}
            onChange={(e) => handlePropertyChange("text", e.target.value)}
            placeholder="Enter your heading (leave empty for no text)..."
          />
        </div>
        <div>
          <Label>Heading Level</Label>
          <Select value={selectedElement.properties.headingLevel || "h1"} onValueChange={(value) => handlePropertyChange("headingLevel", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1 - Main Heading</SelectItem>
              <SelectItem value="h2">H2 - Section Heading</SelectItem>
              <SelectItem value="h3">H3 - Subsection</SelectItem>
              <SelectItem value="h4">H4 - Minor Heading</SelectItem>
              <SelectItem value="h5">H5 - Small Heading</SelectItem>
              <SelectItem value="h6">H6 - Tiny Heading</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Font Family</Label>
          <Select value={selectedElement.properties.fontFamily || "Inter"} onValueChange={(value) => handlePropertyChange("fontFamily", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Font Weight</Label>
          <Select value={selectedElement.properties.fontWeight || "bold"} onValueChange={(value) => handlePropertyChange("fontWeight", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="100">Thin</SelectItem>
              <SelectItem value="300">Light</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="700">Semi Bold</SelectItem>
              <SelectItem value="900">Black</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderParagraphProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Paragraph Text</Label>
          <Textarea
            value={selectedElement.properties.text || ""}
            onChange={(e) => handlePropertyChange("text", e.target.value)}
            placeholder="Enter your paragraph content (leave empty for no text)..."
            rows={6}
          />
        </div>
        <div>
          <Label>Line Height</Label>
          <Select value={selectedElement.properties.lineHeight || "1.6"} onValueChange={(value) => handlePropertyChange("lineHeight", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.2">Tight (1.2)</SelectItem>
              <SelectItem value="1.4">Normal (1.4)</SelectItem>
              <SelectItem value="1.6">Relaxed (1.6)</SelectItem>
              <SelectItem value="1.8">Loose (1.8)</SelectItem>
              <SelectItem value="2.0">Very Loose (2.0)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Text Alignment</Label>
          <Select value={selectedElement.properties.textAlign || "left"} onValueChange={(value) => handlePropertyChange("textAlign", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="justify">Justify</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderLinkProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Link Text</Label>
          <Input
            value={selectedElement.properties.text || ""}
            onChange={(e) => handlePropertyChange("text", e.target.value)}
            placeholder="Enter link text (leave empty for no text)..."
          />
        </div>
        <div>
          <Label>URL</Label>
          <Input
            value={selectedElement.properties.href || ""}
            onChange={(e) => handlePropertyChange("href", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <Label>Target</Label>
          <Select value={selectedElement.properties.target || "_self"} onValueChange={(value) => handlePropertyChange("target", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_self">Same Window</SelectItem>
              <SelectItem value="_blank">New Window</SelectItem>
              <SelectItem value="_parent">Parent Frame</SelectItem>
              <SelectItem value="_top">Top Frame</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Link Style</Label>
          <Select value={selectedElement.properties.linkStyle || "default"} onValueChange={(value) => handlePropertyChange("linkStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="button">Button Style</SelectItem>
              <SelectItem value="underline">Underline Only</SelectItem>
              <SelectItem value="icon">Icon Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderButtonProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Button Text</Label>
          <Input
            value={selectedElement.properties.text || ""}
            onChange={(e) => handlePropertyChange("text", e.target.value)}
            placeholder="Enter button text (leave empty for no text)..."
          />
        </div>
        <div>
          <Label>Button Style</Label>
          <Select value={selectedElement.properties.buttonStyle || "primary"} onValueChange={(value) => handlePropertyChange("buttonStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="danger">Danger</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="glass">Glass</SelectItem>
              <SelectItem value="neon">Neon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Button Size</Label>
          <Select value={selectedElement.properties.buttonSize || "default"} onValueChange={(value) => handlePropertyChange("buttonSize", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">Extra Small</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Border Radius</Label>
          <Select value={selectedElement.properties.borderRadius || "default"} onValueChange={(value) => handlePropertyChange("borderRadius", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Action URL</Label>
          <Input
            value={selectedElement.properties.href || ""}
            onChange={(e) => handlePropertyChange("href", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <Label>Target</Label>
          <Select value={selectedElement.properties.target || "_self"} onValueChange={(value) => handlePropertyChange("target", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_self">Same Window</SelectItem>
              <SelectItem value="_blank">New Window</SelectItem>
              <SelectItem value="_parent">Parent Frame</SelectItem>
              <SelectItem value="_top">Top Frame</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={selectedElement.properties.disabled || false}
            onCheckedChange={(checked) => handlePropertyChange("disabled", checked)}
          />
          <Label>Disabled</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={selectedElement.properties.loading || false}
            onCheckedChange={(checked) => handlePropertyChange("loading", checked)}
          />
          <Label>Loading State</Label>
        </div>
      </div>
    </>
  )

  const renderImageProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Image URL</Label>
          <Input
            value={selectedElement.properties.src || ""}
            onChange={(e) => handlePropertyChange("src", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label>Alt Text</Label>
          <Input
            value={selectedElement.properties.alt || ""}
            onChange={(e) => handlePropertyChange("alt", e.target.value)}
            placeholder="Describe the image..."
          />
        </div>
        <div>
          <Label>Image Style</Label>
          <Select value={selectedElement.properties.imageStyle || "default"} onValueChange={(value) => handlePropertyChange("imageStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="bordered">Bordered</SelectItem>
              <SelectItem value="shadow">With Shadow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Object Fit</Label>
          <Select value={selectedElement.properties.objectFit || "cover"} onValueChange={(value) => handlePropertyChange("objectFit", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover</SelectItem>
              <SelectItem value="contain">Contain</SelectItem>
              <SelectItem value="fill">Fill</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={selectedElement.properties.lazy || false}
            onCheckedChange={(checked) => handlePropertyChange("lazy", checked)}
          />
          <Label>Lazy Loading</Label>
        </div>
      </div>
    </>
  )

  const renderHeroProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Main Heading</Label>
          <Input
            value={selectedElement.properties.heading || ""}
            onChange={(e) => handlePropertyChange("heading", e.target.value)}
            placeholder="Enter main heading..."
          />
        </div>
        <div>
          <Label>Subheading</Label>
          <Textarea
            value={selectedElement.properties.subheading || ""}
            onChange={(e) => handlePropertyChange("subheading", e.target.value)}
            placeholder="Enter subheading text..."
            rows={3}
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={selectedElement.properties.buttonText || ""}
            onChange={(e) => handlePropertyChange("buttonText", e.target.value)}
            placeholder="Get Started"
          />
        </div>
        <div>
          <Label>Button URL</Label>
          <Input
            value={selectedElement.properties.buttonUrl || ""}
            onChange={(e) => handlePropertyChange("buttonUrl", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <Label>Hero Style</Label>
          <Select value={selectedElement.properties.heroStyle || "default"} onValueChange={(value) => handlePropertyChange("heroStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Background Image</Label>
          <Input
            value={selectedElement.properties.backgroundImage || ""}
            onChange={(e) => handlePropertyChange("backgroundImage", e.target.value)}
            placeholder="https://example.com/bg.jpg"
          />
        </div>
      </div>
    </>
  )

  const renderNavigationProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Logo Text</Label>
          <Input
            value={selectedElement.properties.logoText || ""}
            onChange={(e) => handlePropertyChange("logoText", e.target.value)}
            placeholder="Your Logo"
          />
        </div>
        <div>
          <Label>Menu Items</Label>
          <Textarea
            value={selectedElement.properties.menuItems || ""}
            onChange={(e) => handlePropertyChange("menuItems", e.target.value)}
            placeholder="Home, About, Services, Contact"
            rows={3}
          />
        </div>
        <div>
          <Label>Navigation Style</Label>
          <Select value={selectedElement.properties.navStyle || "default"} onValueChange={(value) => handlePropertyChange("navStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="centered">Centered</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={selectedElement.properties.sticky || false}
            onCheckedChange={(checked) => handlePropertyChange("sticky", checked)}
          />
          <Label>Sticky Navigation</Label>
        </div>
      </div>
    </>
  )

  const renderFormProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Form Title</Label>
          <Input
            value={selectedElement.properties.formTitle || ""}
            onChange={(e) => handlePropertyChange("formTitle", e.target.value)}
            placeholder="Contact Us"
          />
        </div>
        <div>
          <Label>Form Fields</Label>
          <Textarea
            value={selectedElement.properties.formFields || ""}
            onChange={(e) => handlePropertyChange("formFields", e.target.value)}
            placeholder="Name, Email, Message"
            rows={3}
          />
        </div>
        <div>
          <Label>Submit Button Text</Label>
          <Input
            value={selectedElement.properties.submitText || ""}
            onChange={(e) => handlePropertyChange("submitText", e.target.value)}
            placeholder="Send Message"
          />
        </div>
        <div>
          <Label>Form Style</Label>
          <Select value={selectedElement.properties.formStyle || "default"} onValueChange={(value) => handlePropertyChange("formStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="floating">Floating Labels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderPricingProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Plan Name</Label>
          <Input
            value={selectedElement.properties.planName || ""}
            onChange={(e) => handlePropertyChange("planName", e.target.value)}
            placeholder="Pro Plan"
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            value={selectedElement.properties.price || ""}
            onChange={(e) => handlePropertyChange("price", e.target.value)}
            placeholder="$29"
          />
        </div>
        <div>
          <Label>Billing Period</Label>
          <Select value={selectedElement.properties.billingPeriod || "month"} onValueChange={(value) => handlePropertyChange("billingPeriod", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Per Month</SelectItem>
              <SelectItem value="year">Per Year</SelectItem>
              <SelectItem value="one-time">One Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Features</Label>
          <Textarea
            value={selectedElement.properties.features || ""}
            onChange={(e) => handlePropertyChange("features", e.target.value)}
            placeholder="Feature 1, Feature 2, Feature 3"
            rows={4}
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={selectedElement.properties.buttonText || ""}
            onChange={(e) => handlePropertyChange("buttonText", e.target.value)}
            placeholder="Choose Plan"
          />
        </div>
        <div>
          <Label>Pricing Style</Label>
          <Select value={selectedElement.properties.pricingStyle || "default"} onValueChange={(value) => handlePropertyChange("pricingStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderTestimonialProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Quote Text</Label>
          <Textarea
            value={selectedElement.properties.quote || ""}
            onChange={(e) => handlePropertyChange("quote", e.target.value)}
            placeholder="Enter the testimonial quote..."
            rows={4}
          />
        </div>
        <div>
          <Label>Author Name</Label>
          <Input
            value={selectedElement.properties.authorName || ""}
            onChange={(e) => handlePropertyChange("authorName", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label>Author Title</Label>
          <Input
            value={selectedElement.properties.authorTitle || ""}
            onChange={(e) => handlePropertyChange("authorTitle", e.target.value)}
            placeholder="CEO, Company"
          />
        </div>
        <div>
          <Label>Author Avatar</Label>
          <Input
            value={selectedElement.properties.authorAvatar || ""}
            onChange={(e) => handlePropertyChange("authorAvatar", e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        <div>
          <Label>Rating</Label>
          <Select value={selectedElement.properties.rating || "5"} onValueChange={(value) => handlePropertyChange("rating", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Star</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Testimonial Style</Label>
          <Select value={selectedElement.properties.testimonialStyle || "default"} onValueChange={(value) => handlePropertyChange("testimonialStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="quote">Quote Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderNewsletterProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Newsletter Title</Label>
          <Input
            value={selectedElement.properties.newsletterTitle || ""}
            onChange={(e) => handlePropertyChange("newsletterTitle", e.target.value)}
            placeholder="Stay Updated"
          />
        </div>
        <div>
          <Label>Newsletter Description</Label>
          <Textarea
            value={selectedElement.properties.newsletterDescription || ""}
            onChange={(e) => handlePropertyChange("newsletterDescription", e.target.value)}
            placeholder="Subscribe to our newsletter for the latest updates"
            rows={3}
          />
        </div>
        <div>
          <Label>Placeholder Text</Label>
          <Input
            value={selectedElement.properties.placeholder || ""}
            onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={selectedElement.properties.buttonText || ""}
            onChange={(e) => handlePropertyChange("buttonText", e.target.value)}
            placeholder="Subscribe"
          />
        </div>
        <div>
          <Label>Newsletter Style</Label>
          <Select value={selectedElement.properties.newsletterStyle || "default"} onValueChange={(value) => handlePropertyChange("newsletterStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderSocialProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Social Platforms</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={selectedElement.properties.facebook || false}
                onCheckedChange={(checked) => handlePropertyChange("facebook", checked)}
              />
              <Label>Facebook</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={selectedElement.properties.twitter || false}
                onCheckedChange={(checked) => handlePropertyChange("twitter", checked)}
              />
              <Label>Twitter</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={selectedElement.properties.linkedin || false}
                onCheckedChange={(checked) => handlePropertyChange("linkedin", checked)}
              />
              <Label>LinkedIn</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={selectedElement.properties.instagram || false}
                onCheckedChange={(checked) => handlePropertyChange("instagram", checked)}
              />
              <Label>Instagram</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={selectedElement.properties.youtube || false}
                onCheckedChange={(checked) => handlePropertyChange("youtube", checked)}
              />
              <Label>YouTube</Label>
            </div>
          </div>
        </div>
        <div>
          <Label>Social Style</Label>
          <Select value={selectedElement.properties.socialStyle || "default"} onValueChange={(value) => handlePropertyChange("socialStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="square">Square</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Size</Label>
          <Select value={selectedElement.properties.socialSize || "default"} onValueChange={(value) => handlePropertyChange("socialSize", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderCommonProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Width</Label>
          <Input
            type="number"
            value={selectedElement.properties.width || ""}
            onChange={(e) => handlePropertyChange("width", parseInt(e.target.value))}
            placeholder="Width in pixels"
          />
        </div>
        <div>
          <Label>Height</Label>
          <Input
            type="number"
            value={selectedElement.properties.height || ""}
            onChange={(e) => handlePropertyChange("height", parseInt(e.target.value))}
            placeholder="Height in pixels"
          />
        </div>
        <div>
          <Label>Background Color</Label>
          <Input
            type="color"
            value={selectedElement.properties.backgroundColor || "#ffffff"}
            onChange={(e) => handlePropertyChange("backgroundColor", e.target.value)}
          />
        </div>
        <div>
          <Label>Text Color</Label>
          <Input
            type="color"
            value={selectedElement.properties.color || "#000000"}
            onChange={(e) => handlePropertyChange("color", e.target.value)}
          />
        </div>
        <div>
          <Label>Font Size</Label>
          <Input
            type="number"
            value={selectedElement.properties.fontSize || ""}
            onChange={(e) => handlePropertyChange("fontSize", parseInt(e.target.value))}
            placeholder="Font size in pixels"
          />
        </div>
        <div>
          <Label>Font Weight</Label>
          <Select value={selectedElement.properties.fontWeight || "normal"} onValueChange={(value) => handlePropertyChange("fontWeight", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="100">Thin</SelectItem>
              <SelectItem value="300">Light</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="700">Semi Bold</SelectItem>
              <SelectItem value="900">Black</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Text Alignment</Label>
          <Select value={selectedElement.properties.textAlign || "left"} onValueChange={(value) => handlePropertyChange("textAlign", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="justify">Justify</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Line Height</Label>
          <Select value={selectedElement.properties.lineHeight || "1.5"} onValueChange={(value) => handlePropertyChange("lineHeight", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.2">Tight (1.2)</SelectItem>
              <SelectItem value="1.4">Normal (1.4)</SelectItem>
              <SelectItem value="1.5">Relaxed (1.5)</SelectItem>
              <SelectItem value="1.6">Loose (1.6)</SelectItem>
              <SelectItem value="1.8">Very Loose (1.8)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Padding</Label>
          <Input
            type="number"
            value={selectedElement.properties.padding || ""}
            onChange={(e) => handlePropertyChange("padding", parseInt(e.target.value))}
            placeholder="Padding in pixels"
          />
        </div>
        <div>
          <Label>Border Radius</Label>
          <Input
            type="number"
            value={selectedElement.properties.borderRadius || ""}
            onChange={(e) => handlePropertyChange("borderRadius", parseInt(e.target.value))}
            placeholder="Border radius in pixels"
          />
        </div>
        <div>
          <Label>Border Width</Label>
          <Input
            type="number"
            value={selectedElement.properties.borderWidth || ""}
            onChange={(e) => handlePropertyChange("borderWidth", parseInt(e.target.value))}
            placeholder="Border width in pixels"
          />
        </div>
        <div>
          <Label>Border Color</Label>
          <Input
            type="color"
            value={selectedElement.properties.borderColor || "#000000"}
            onChange={(e) => handlePropertyChange("borderColor", e.target.value)}
          />
        </div>
        <div>
          <Label>Shadow</Label>
          <Select value={selectedElement.properties.shadow || "none"} onValueChange={(value) => handlePropertyChange("shadow", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
              <SelectItem value="inner">Inner</SelectItem>
              <SelectItem value="glow">Glow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Opacity</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={selectedElement.properties.opacity || "100"}
            onChange={(e) => handlePropertyChange("opacity", parseInt(e.target.value))}
            placeholder="Opacity (0-100)"
          />
        </div>
        <div>
          <Label>Transform</Label>
          <Select value={selectedElement.properties.transform || "none"} onValueChange={(value) => handlePropertyChange("transform", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="scale-95">Scale Down</SelectItem>
              <SelectItem value="scale-105">Scale Up</SelectItem>
              <SelectItem value="rotate-1">Rotate Right</SelectItem>
              <SelectItem value="-rotate-1">Rotate Left</SelectItem>
              <SelectItem value="skew-1">Skew Right</SelectItem>
              <SelectItem value="-skew-1">Skew Left</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Z-Index</Label>
          <Input
            type="number"
            value={selectedElement.properties.zIndex || ""}
            onChange={(e) => handlePropertyChange("zIndex", parseInt(e.target.value))}
            placeholder="Z-index value"
          />
        </div>
      </div>
    </>
  )

  const renderComponentSpecificProperties = () => {
    switch (selectedElement.type) {
      case "text":
        return renderTextProperties()
      case "heading":
        return renderHeadingProperties()
      case "paragraph":
        return renderParagraphProperties()
      case "link":
        return renderLinkProperties()
      case "button":
        return renderButtonProperties()
      case "image":
        return renderImageProperties()
      case "hero":
        return renderHeroProperties()
      case "navigation":
        return renderNavigationProperties()
      case "form":
        return renderFormProperties()
      case "input":
        return renderInputProperties()
      case "textarea":
        return renderTextareaProperties()
      case "checkbox":
        return renderCheckboxProperties()
      case "radio":
        return renderRadioProperties()
      case "select":
        return renderSelectProperties()
      case "label":
        return renderLabelProperties()
      case "tabs":
        return renderTabsProperties()
      case "accordion":
        return renderAccordionProperties()
      case "modal":
        return renderModalProperties()
      case "tooltip":
        return renderTooltipProperties()
      case "dropdown":
        return renderDropdownProperties()
      case "video":
        return renderVideoProperties()
      case "gallery":
        return renderGalleryProperties()
      case "slider":
        return renderSliderProperties()
      case "icon":
        return renderIconProperties()
      case "pricing":
        return renderPricingProperties()
      case "testimonial":
        return renderTestimonialProperties()
      case "contact":
        return renderContactProperties()
      case "newsletter":
        return renderNewsletterProperties()
      case "social":
        return renderSocialProperties()
      case "section":
        return renderSectionProperties()
      case "card":
        return renderCardProperties()
      case "footer":
        return renderFooterProperties()
      case "divider":
        return renderDividerProperties()
      default:
        return renderCommonContentProperties()
    }
  }

  // Add missing property renderers for form components
  const renderInputProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Placeholder Text</Label>
          <Input
            value={selectedElement.properties.placeholder || ""}
            onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
            placeholder="Enter placeholder text..."
          />
        </div>
        <div>
          <Label>Input Type</Label>
          <Select value={selectedElement.properties.inputType || "text"} onValueChange={(value) => handlePropertyChange("inputType", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="password">Password</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="tel">Telephone</SelectItem>
              <SelectItem value="url">URL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Input Style</Label>
          <Select value={selectedElement.properties.inputStyle || "default"} onValueChange={(value) => handlePropertyChange("inputStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderTextareaProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Placeholder Text</Label>
          <Input
            value={selectedElement.properties.placeholder || ""}
            onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
            placeholder="Enter placeholder text..."
          />
        </div>
        <div>
          <Label>Number of Rows</Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={selectedElement.properties.rows || "4"}
            onChange={(e) => handlePropertyChange("rows", parseInt(e.target.value))}
            placeholder="Number of rows"
          />
        </div>
        <div>
          <Label>Textarea Style</Label>
          <Select value={selectedElement.properties.textareaStyle || "default"} onValueChange={(value) => handlePropertyChange("textareaStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderCheckboxProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Checkbox Label</Label>
          <Input
            value={selectedElement.properties.label || ""}
            onChange={(e) => handlePropertyChange("label", e.target.value)}
            placeholder="Enter checkbox label..."
          />
        </div>
        <div>
          <Label>Checkbox Style</Label>
          <Select value={selectedElement.properties.checkboxStyle || "default"} onValueChange={(value) => handlePropertyChange("checkboxStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Accent Color</Label>
          <Input
            type="color"
            value={selectedElement.properties.accentColor || "#3b82f6"}
            onChange={(e) => handlePropertyChange("accentColor", e.target.value)}
          />
        </div>
      </div>
    </>
  )

  const renderRadioProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Radio Label</Label>
          <Input
            value={selectedElement.properties.label || ""}
            onChange={(e) => handlePropertyChange("label", e.target.value)}
            placeholder="Enter radio label..."
          />
        </div>
        <div>
          <Label>Radio Group Name</Label>
          <Input
            value={selectedElement.properties.name || ""}
            onChange={(e) => handlePropertyChange("name", e.target.value)}
            placeholder="radio-group"
          />
        </div>
        <div>
          <Label>Radio Style</Label>
          <Select value={selectedElement.properties.radioStyle || "default"} onValueChange={(value) => handlePropertyChange("radioStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Accent Color</Label>
          <Input
            type="color"
            value={selectedElement.properties.accentColor || "#3b82f6"}
            onChange={(e) => handlePropertyChange("accentColor", e.target.value)}
          />
        </div>
      </div>
    </>
  )

  const renderSelectProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Placeholder Text</Label>
          <Input
            value={selectedElement.properties.placeholder || ""}
            onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
            placeholder="Select an option"
          />
        </div>
        <div>
          <Label>Select Style</Label>
          <Select value={selectedElement.properties.selectStyle || "default"} onValueChange={(value) => handlePropertyChange("selectStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderLabelProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Label Text</Label>
          <Input
            value={selectedElement.properties.text || ""}
            onChange={(e) => handlePropertyChange("text", e.target.value)}
            placeholder="Enter label text..."
          />
        </div>
      </div>
    </>
  )

  // Add missing property renderers for interactive components
  const renderTabsProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Tab Items</Label>
          <Textarea
            value={selectedElement.properties.tabItems || ""}
            onChange={(e) => handlePropertyChange("tabItems", e.target.value)}
            placeholder="Tab 1, Tab 2, Tab 3"
            rows={3}
          />
        </div>
        <div>
          <Label>Tabs Style</Label>
          <Select value={selectedElement.properties.tabsStyle || "default"} onValueChange={(value) => handlePropertyChange("tabsStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderAccordionProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Accordion Items</Label>
          <Textarea
            value={selectedElement.properties.accordionItems || ""}
            onChange={(e) => handlePropertyChange("accordionItems", e.target.value)}
            placeholder="Section 1, Section 2, Section 3"
            rows={3}
          />
        </div>
        <div>
          <Label>Accordion Style</Label>
          <Select value={selectedElement.properties.accordionStyle || "default"} onValueChange={(value) => handlePropertyChange("accordionStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderModalProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Modal Title</Label>
          <Input
            value={selectedElement.properties.title || ""}
            onChange={(e) => handlePropertyChange("title", e.target.value)}
            placeholder="Modal Dialog"
          />
        </div>
        <div>
          <Label>Modal Content</Label>
          <Textarea
            value={selectedElement.properties.content || ""}
            onChange={(e) => handlePropertyChange("content", e.target.value)}
            placeholder="This is a modal dialog component"
            rows={3}
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={selectedElement.properties.buttonText || ""}
            onChange={(e) => handlePropertyChange("buttonText", e.target.value)}
            placeholder="Close"
          />
        </div>
        <div>
          <Label>Modal Style</Label>
          <Select value={selectedElement.properties.modalStyle || "default"} onValueChange={(value) => handlePropertyChange("modalStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderTooltipProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Trigger Text</Label>
          <Input
            value={selectedElement.properties.triggerText || ""}
            onChange={(e) => handlePropertyChange("triggerText", e.target.value)}
            placeholder="Hover me"
          />
        </div>
        <div>
          <Label>Tooltip Text</Label>
          <Input
            value={selectedElement.properties.tooltipText || ""}
            onChange={(e) => handlePropertyChange("tooltipText", e.target.value)}
            placeholder="Tooltip content"
          />
        </div>
        <div>
          <Label>Tooltip Style</Label>
          <Select value={selectedElement.properties.tooltipStyle || "default"} onValueChange={(value) => handlePropertyChange("tooltipStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderDropdownProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Trigger Text</Label>
          <Input
            value={selectedElement.properties.triggerText || ""}
            onChange={(e) => handlePropertyChange("triggerText", e.target.value)}
            placeholder="Dropdown"
          />
        </div>
        <div>
          <Label>Dropdown Items</Label>
          <Textarea
            value={selectedElement.properties.dropdownItems || ""}
            onChange={(e) => handlePropertyChange("dropdownItems", e.target.value)}
            placeholder="Option 1, Option 2, Option 3"
            rows={3}
          />
        </div>
        <div>
          <Label>Dropdown Style</Label>
          <Select value={selectedElement.properties.dropdownStyle || "default"} onValueChange={(value) => handlePropertyChange("dropdownStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  // Add missing property renderers for media components
  const renderVideoProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Video Title</Label>
          <Input
            value={selectedElement.properties.videoTitle || ""}
            onChange={(e) => handlePropertyChange("videoTitle", e.target.value)}
            placeholder="Video Player"
          />
        </div>
        <div>
          <Label>Video Description</Label>
          <Input
            value={selectedElement.properties.videoDescription || ""}
            onChange={(e) => handlePropertyChange("videoDescription", e.target.value)}
            placeholder="Video description"
          />
        </div>
        <div>
          <Label>Video Style</Label>
          <Select value={selectedElement.properties.videoStyle || "default"} onValueChange={(value) => handlePropertyChange("videoStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderGalleryProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Gallery Style</Label>
          <Select value={selectedElement.properties.galleryStyle || "default"} onValueChange={(value) => handlePropertyChange("galleryStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">2x2 Grid</SelectItem>
              <SelectItem value="modern">3x3 Grid</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderSliderProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Slider Title</Label>
          <Input
            value={selectedElement.properties.sliderTitle || ""}
            onChange={(e) => handlePropertyChange("sliderTitle", e.target.value)}
            placeholder="Image Slider"
          />
        </div>
        <div>
          <Label>Slider Description</Label>
          <Input
            value={selectedElement.properties.sliderDescription || ""}
            onChange={(e) => handlePropertyChange("sliderDescription", e.target.value)}
            placeholder="Slider description"
          />
        </div>
        <div>
          <Label>Slider Style</Label>
          <Select value={selectedElement.properties.sliderStyle || "default"} onValueChange={(value) => handlePropertyChange("sliderStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderIconProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Icon Name</Label>
          <Input
            value={selectedElement.properties.iconName || ""}
            onChange={(e) => handlePropertyChange("iconName", e.target.value)}
            placeholder="★"
          />
        </div>
        <div>
          <Label>Icon Style</Label>
          <Select value={selectedElement.properties.iconStyle || "default"} onValueChange={(value) => handlePropertyChange("iconStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="accent">Accent</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="danger">Danger</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Icon Size</Label>
          <Select value={selectedElement.properties.iconSize || "default"} onValueChange={(value) => handlePropertyChange("iconSize", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  // Add missing property renderers for layout components
  const renderSectionProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Section Style</Label>
          <Select value={selectedElement.properties.sectionStyle || "default"} onValueChange={(value) => handlePropertyChange("sectionStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
              <SelectItem value="hero">Hero Style</SelectItem>
              <SelectItem value="dark">Dark Style</SelectItem>
              <SelectItem value="accent">Accent Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderCardProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Card Style</Label>
          <Select value={selectedElement.properties.cardStyle || "default"} onValueChange={(value) => handlePropertyChange("cardStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="elevated">Elevated</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="dark">Dark Style</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderFooterProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Company Name</Label>
          <Input
            value={selectedElement.properties.companyName || ""}
            onChange={(e) => handlePropertyChange("companyName", e.target.value)}
            placeholder="Your Company"
          />
        </div>
        <div>
          <Label>Copyright Text</Label>
          <Input
            value={selectedElement.properties.copyrightText || ""}
            onChange={(e) => handlePropertyChange("copyrightText", e.target.value)}
            placeholder="© 2024 All rights reserved"
          />
        </div>
      </div>
    </>
  )

  const renderDividerProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Divider Style</Label>
          <Select value={selectedElement.properties.dividerStyle || "solid"} onValueChange={(value) => handlePropertyChange("dividerStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="fancy">Fancy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderContactProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Form Title</Label>
          <Input
            value={selectedElement.properties.formTitle || ""}
            onChange={(e) => handlePropertyChange("formTitle", e.target.value)}
            placeholder="Contact Us"
          />
        </div>
        <div>
          <Label>Form Fields</Label>
          <Textarea
            value={selectedElement.properties.formFields || ""}
            onChange={(e) => handlePropertyChange("formFields", e.target.value)}
            placeholder="Name, Email, Message"
            rows={3}
          />
        </div>
        <div>
          <Label>Submit Button Text</Label>
          <Input
            value={selectedElement.properties.submitText || ""}
            onChange={(e) => handlePropertyChange("submitText", e.target.value)}
            placeholder="Send Message"
          />
        </div>
        <div>
          <Label>Form Style</Label>
          <Select value={selectedElement.properties.formStyle || "default"} onValueChange={(value) => handlePropertyChange("formStyle", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="card">Card Style</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="floating">Floating Labels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )

  const renderCommonContentProperties = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label>Text Content</Label>
          <Textarea
            value={selectedElement.properties.text || ""}
            onChange={(e) => handlePropertyChange("text", e.target.value)}
            placeholder="Enter text content..."
            rows={4}
          />
        </div>
      </div>
    </>
  )

  return (
    <div className="h-full bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Customize your {selectedElement.type} component
        </p>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDuplicate}
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="content" className="p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content" className="flex items-center space-x-1">
            <Type className="w-3 h-3" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center space-x-1">
            <Palette className="w-3 h-3" />
            <span>Style</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center space-x-1">
            <Layout className="w-3 h-3" />
            <span>Layout</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          {renderComponentSpecificProperties()}
        </TabsContent>

        <TabsContent value="style" className="space-y-4 mt-4">
          {renderCommonProperties()}
        </TabsContent>

        <TabsContent value="layout" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label>X Position</Label>
              <Input
                type="number"
                value={selectedElement.properties.x || ""}
                onChange={(e) => handlePropertyChange("x", parseInt(e.target.value))}
                placeholder="X position"
              />
            </div>
            <div>
              <Label>Y Position</Label>
              <Input
                type="number"
                value={selectedElement.properties.y || ""}
                onChange={(e) => handlePropertyChange("y", parseInt(e.target.value))}
                placeholder="Y position"
              />
            </div>
            <div>
              <Label>Display</Label>
              <Select value={selectedElement.properties.display || "block"} onValueChange={(value) => handlePropertyChange("display", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="inline-block">Inline Block</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Flex Direction</Label>
              <Select value={selectedElement.properties.flexDirection || "row"} onValueChange={(value) => handlePropertyChange("flexDirection", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Row</SelectItem>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row-reverse">Row Reverse</SelectItem>
                  <SelectItem value="column-reverse">Column Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Justify Content</Label>
              <Select value={selectedElement.properties.justifyContent || "flex-start"} onValueChange={(value) => handlePropertyChange("justifyContent", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">End</SelectItem>
                  <SelectItem value="space-between">Space Between</SelectItem>
                  <SelectItem value="space-around">Space Around</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Align Items</Label>
              <Select value={selectedElement.properties.alignItems || "stretch"} onValueChange={(value) => handlePropertyChange("alignItems", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stretch">Stretch</SelectItem>
                  <SelectItem value="flex-start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">End</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
