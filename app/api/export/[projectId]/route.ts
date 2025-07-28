import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "html"

    // Fetch project with all pages and components
    const project = await prisma.project.findFirst({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
      include: {
        pages: {
          include: {
            components: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (format === "json") {
      return NextResponse.json(project, {
        headers: {
          "Content-Disposition": `attachment; filename="${project.title}.json"`,
          "Content-Type": "application/json",
        },
      })
    }

    if (format === "html") {
      const html = generateHTML(project)
      return new NextResponse(html, {
        headers: {
          "Content-Disposition": `attachment; filename="${project.title}.html"`,
          "Content-Type": "text/html",
        },
      })
    }

    if (format === "css") {
      const css = generateCSS(project)
      return new NextResponse(css, {
        headers: {
          "Content-Disposition": `attachment; filename="${project.title}.css"`,
          "Content-Type": "text/css",
        },
      })
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  } catch (error) {
    console.error("Error exporting project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateHTML(project: any): string {
  if (!project.pages || project.pages.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
        .container { position: relative; min-height: 100vh; background: white; }
        .page { position: relative; min-height: 100vh; }
        ${generateInlineCSS(project)}
    </style>
</head>
<body>
    <div class="container">
        <h1>No content available</h1>
    </div>
</body>
</html>`
  }

  const pagesHTML = project.pages.map((page: any) => generatePageHTML(page)).join("\n")

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title}</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
        .container { position: relative; min-height: 100vh; background: white; }
        .page { position: relative; min-height: 100vh; }
        ${generateInlineCSS(project)}
    </style>
</head>
<body>
    <div class="container">
        ${pagesHTML}
    </div>
</body>
</html>`
}

function generatePageHTML(page: any): string {
  const componentsHTML = page.components.map((component: any) => generateComponentHTML(component)).join("\n        ")
  
  return `
    <div class="page page-${page.id}" id="page-${page.slug}">
        ${componentsHTML}
    </div>`
}

function generateComponentHTML(component: any): string {
  const { type, properties } = component
  
  // Extract position properties from the properties object
  const x = properties.x || 0
  const y = properties.y || 0
  const width = properties.width || "auto"
  const height = properties.height || "auto"
  const zIndex = properties.zIndex || 0
  
  const style = `position: absolute; left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px; z-index: ${zIndex};`

  switch (type) {
    case "text":
      return `<div class="component-${component.id} text-component" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Your compelling text here"}</div>`

    case "heading":
      const headingLevel = properties.headingLevel || "h1"
      return `<${headingLevel} class="component-${component.id} heading-component" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Your Heading"}</${headingLevel}>`

    case "paragraph":
      return `<p class="component-${component.id} paragraph-component" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Your paragraph text goes here. This is a longer text block that can contain multiple sentences and provide more detailed information to your readers."}</p>`

    case "link":
      return `<a class="component-${component.id} link-component" href="${properties.href || "#"}" target="${properties.target || "_self"}" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Click here"}</a>`

    case "button":
      const buttonClass = `button-${properties.buttonStyle || "primary"}`
      return `<button class="component-${component.id} button-component ${buttonClass}" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Click me"}</button>`

    case "image":
      return `<img class="component-${component.id} image-component" src="${properties.src || "/placeholder.svg"}" alt="${properties.alt || "Image"}" style="${style} ${getPropertiesStyle(properties)}" />`

    case "divider":
      const dividerClass = `divider-${properties.dividerStyle || "solid"}`
      return `<div class="component-${component.id} divider-component ${dividerClass}" style="${style} ${getPropertiesStyle(properties)}"></div>`

    case "section":
      const sectionClass = `section-${properties.sectionStyle || "default"}`
      return `<section class="component-${component.id} section-component ${sectionClass}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="section-content">
          <h2>Section Container</h2>
          <p>Perfect for organizing your content</p>
        </div>
      </section>`

    case "card":
      const cardClass = `card-${properties.cardStyle || "default"}`
      return `<div class="component-${component.id} card-component ${cardClass}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="card-content">
          <h3>Card Title</h3>
          <p>This is a beautiful card component with customizable styling.</p>
        </div>
      </div>`

    case "hero":
      const heroClass = `hero-${properties.heroStyle || "default"}`
      return `<div class="component-${component.id} hero-component ${heroClass}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="hero-content">
          <h1>Hero Section</h1>
          <p>Create stunning hero sections for your website</p>
          <button class="hero-button">Get Started</button>
        </div>
      </div>`

    case "navigation":
      return `<nav class="component-${component.id} navigation-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="nav-content">
          <div class="nav-logo">Logo</div>
          <div class="nav-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </nav>`

    case "footer":
      return `<footer class="component-${component.id} footer-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="footer-content">
          <div class="footer-logo">Your Company</div>
          <div class="footer-copyright">© 2024 All rights reserved</div>
        </div>
      </footer>`

    case "container":
      return `<div class="component-${component.id} container-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="container-content">
          <h3>Container</h3>
          <p>Content wrapper with max-width</p>
        </div>
      </div>`

    case "grid":
      return `<div class="component-${component.id} grid-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="grid-content">
          <h3>Grid Layout</h3>
          <p>CSS Grid container</p>
        </div>
      </div>`

    case "flex":
      return `<div class="component-${component.id} flex-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="flex-content">
          <h3>Flex Layout</h3>
          <p>Flexbox container</p>
        </div>
      </div>`

    case "sidebar":
      return `<aside class="component-${component.id} sidebar-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="sidebar-content">
          <h3>Sidebar</h3>
          <nav class="sidebar-nav">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </aside>`

    case "input":
      const inputClass = `input-${properties.inputStyle || "default"}`
      return `<input class="component-${component.id} input-component ${inputClass}" type="${properties.inputType || "text"}" placeholder="${properties.placeholder || "Enter your text..."}" style="${style} ${getPropertiesStyle(properties)}" />`

    case "textarea":
      const textareaClass = `textarea-${properties.textareaStyle || "default"}`
      return `<textarea class="component-${component.id} textarea-component ${textareaClass}" placeholder="${properties.placeholder || "Write your message here..."}" rows="${properties.rows || 4}" style="${style} ${getPropertiesStyle(properties)}"></textarea>`

    case "checkbox":
      const checkboxClass = `checkbox-${properties.checkboxStyle || "default"}`
      return `<label class="component-${component.id} checkbox-component ${checkboxClass}" style="${style} ${getPropertiesStyle(properties)}">
        <input type="checkbox" />
        <span>${properties.label || "Check this option"}</span>
      </label>`

    case "radio":
      return `<label class="component-${component.id} radio-component" style="${style} ${getPropertiesStyle(properties)}">
        <input type="radio" name="${properties.name || "radio-group"}" />
        <span>${properties.label || "Radio option"}</span>
      </label>`

    case "select":
      return `<select class="component-${component.id} select-component" style="${style} ${getPropertiesStyle(properties)}">
        <option value="">${properties.placeholder || "Select an option"}</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>`

    case "label":
      return `<label class="component-${component.id} label-component" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Label"}</label>`

    case "video":
      return `<div class="component-${component.id} video-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="video-placeholder">
          <div class="video-icon">▶</div>
          <div class="video-text">Video Player</div>
        </div>
      </div>`

    case "gallery":
      return `<div class="component-${component.id} gallery-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="gallery-grid">
          <div class="gallery-item"></div>
          <div class="gallery-item"></div>
          <div class="gallery-item"></div>
          <div class="gallery-item"></div>
        </div>
      </div>`

    case "slider":
      return `<div class="component-${component.id} slider-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="slider-placeholder">
          <div class="slider-icon">🖼️</div>
          <div class="slider-text">Image Slider</div>
        </div>
      </div>`

    case "modal":
      return `<div class="component-${component.id} modal-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="modal-content">
          <h3>Modal Dialog</h3>
          <p>This is a modal dialog component</p>
          <button class="modal-close">Close</button>
        </div>
      </div>`

    case "tooltip":
      return `<div class="component-${component.id} tooltip-component" style="${style} ${getPropertiesStyle(properties)}">
        <button class="tooltip-trigger">Hover me</button>
        <div class="tooltip-content">Tooltip content</div>
      </div>`

    case "dropdown":
      return `<div class="component-${component.id} dropdown-component" style="${style} ${getPropertiesStyle(properties)}">
        <button class="dropdown-trigger">
          <span>Dropdown</span>
          <span class="dropdown-arrow">▼</span>
        </button>
      </div>`

    case "pricing":
      return `<div class="component-${component.id} pricing-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="pricing-card">
          <div class="pricing-price">$29</div>
          <div class="pricing-title">Pro Plan</div>
          <ul class="pricing-features">
            <li>✓ Feature 1</li>
            <li>✓ Feature 2</li>
            <li>✓ Feature 3</li>
          </ul>
          <button class="pricing-button">Choose Plan</button>
        </div>
      </div>`

    case "testimonial":
      return `<div class="component-${component.id} testimonial-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="testimonial-card">
          <div class="testimonial-quote">"This is an amazing product that has transformed our business completely!"</div>
          <div class="testimonial-author">
            <div class="author-avatar"></div>
            <div class="author-info">
              <div class="author-name">John Doe</div>
              <div class="author-title">CEO, Company</div>
            </div>
          </div>
        </div>
      </div>`

    case "contact":
      return `<div class="component-${component.id} contact-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="contact-form">
          <h3>Contact Us</h3>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message" rows="3"></textarea>
          <button class="contact-submit">Send Message</button>
        </div>
      </div>`

    case "newsletter":
      return `<div class="component-${component.id} newsletter-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="newsletter-card">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest updates</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button class="newsletter-submit">Subscribe</button>
          </div>
        </div>
      </div>`

    case "social":
      return `<div class="component-${component.id} social-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="social-links">
          <a href="#" class="social-link facebook">f</a>
          <a href="#" class="social-link twitter">t</a>
          <a href="#" class="social-link linkedin">in</a>
        </div>
      </div>`

    default:
      return `<div class="component-${component.id} unknown-component" style="${style} ${getPropertiesStyle(properties)}">Unknown Component</div>`
  }
}

function getPropertiesStyle(properties: any): string {
  const styles = []

  if (properties.backgroundColor) styles.push(`background-color: ${properties.backgroundColor}`)
  if (properties.color) styles.push(`color: ${properties.color}`)
  if (properties.fontSize) styles.push(`font-size: ${properties.fontSize}px`)
  if (properties.fontFamily) styles.push(`font-family: ${properties.fontFamily}`)
  if (properties.borderRadius) styles.push(`border-radius: ${properties.borderRadius}px`)
  if (properties.padding) styles.push(`padding: ${properties.padding}px`)

  // Border
  if (properties.borderWidth) styles.push(`border-width: ${properties.borderWidth}px`)
  if (properties.borderColor) styles.push(`border-color: ${properties.borderColor}`)
  if (properties.borderStyle) styles.push(`border-style: ${properties.borderStyle}`)

  // Text alignment
  if (properties.textAlign) styles.push(`text-align: ${properties.textAlign}`)

  // Display and flexbox
  if (properties.display) styles.push(`display: ${properties.display}`)
  if (properties.flexDirection) styles.push(`flex-direction: ${properties.flexDirection}`)
  if (properties.justifyContent) styles.push(`justify-content: ${properties.justifyContent}`)
  if (properties.alignItems) styles.push(`align-items: ${properties.alignItems}`)

  return styles.join("; ")
}

function generateInlineCSS(project: any): string {
  let css = `
/* Base Component Styles */
.text-component { display: flex; align-items: center; justify-content: center; padding: 16px; }
.button-component { cursor: pointer; border: none; border-radius: 8px; font-weight: 500; transition: all 0.2s; }
.image-component { object-fit: cover; transition: transform 0.3s; }
.divider-component { border: none; margin: 16px 0; }
.section-component { padding: 32px; display: flex; align-items: center; justify-content: center; }
.card-component { padding: 24px; border-radius: 8px; }
.hero-component { display: flex; align-items: center; justify-content: center; text-align: center; }
.navigation-component { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; }
.footer-component { display: flex; align-items: center; justify-content: center; text-align: center; }
.input-component { border-radius: 8px; outline: none; transition: all 0.2s; }
.textarea-component { border-radius: 8px; outline: none; resize: none; transition: all 0.2s; }
.checkbox-component { display: flex; align-items: center; gap: 12px; cursor: pointer; }

/* Button Variants */
.button-primary { background: #2563eb; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.button-primary:hover { background: #1d4ed8; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transform: scale(1.05); }
.button-secondary { background: #6b7280; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.button-secondary:hover { background: #4b5563; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transform: scale(1.05); }
.button-outline { background: transparent; border: 2px solid #2563eb; color: #2563eb; }
.button-outline:hover { background: #2563eb; color: white; }
.button-ghost { background: transparent; color: #374151; }
.button-ghost:hover { background: #f3f4f6; color: #111827; }
.button-success { background: #059669; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.button-success:hover { background: #047857; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transform: scale(1.05); }
.button-danger { background: #dc2626; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.button-danger:hover { background: #b91c1c; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transform: scale(1.05); }
.button-warning { background: #d97706; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.button-warning:hover { background: #b45309; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transform: scale(1.05); }
.button-info { background: #0891b2; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.button-info:hover { background: #0e7490; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transform: scale(1.05); }

/* Divider Variants */
.divider-solid { border-top: 2px solid #d1d5db; }
.divider-dashed { border-top: 2px dashed #d1d5db; }
.divider-dotted { border-top: 2px dotted #d1d5db; }
.divider-gradient { background: linear-gradient(to right, transparent, #d1d5db, transparent); height: 1px; }
.divider-fancy { position: relative; }
.divider-fancy::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #d1d5db; transform: translateY(-50%); }

/* Section Variants */
.section-default { border: 2px dashed #d1d5db; background: #f9fafb; }
.section-card { border: 1px solid #e5e7eb; background: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 8px; }
.section-hero { background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; }
.section-dark { background: #1f2937; color: white; border: 1px solid #374151; }
.section-accent { background: linear-gradient(to right, #ec4899, #f97316); color: white; }

/* Card Variants */
.card-default { background: white; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
.card-elevated { background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-radius: 8px; }
.card-elevated:hover { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.card-gradient { background: linear-gradient(to bottom right, #dbeafe, #e0e7ff); border: 1px solid #bfdbfe; }
.card-dark { background: #1f2937; color: white; border: 1px solid #374151; }

/* Hero Variants */
.hero-default { background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; }
.hero-modern { background: linear-gradient(to right, #6366f1, #8b5cf6, #ec4899); color: white; }
.hero-dark { background: #111827; color: white; }
.hero-light { background: linear-gradient(to right, #f9fafb, #f3f4f6); color: #111827; }

/* Navigation Styles */
.nav-content { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.nav-logo { font-size: 1.25rem; font-weight: bold; color: #111827; }
.nav-links { display: flex; gap: 24px; }
.nav-links a { color: #6b7280; text-decoration: none; transition: color 0.2s; }
.nav-links a:hover { color: #111827; }

/* Footer Styles */
.footer-content { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.footer-logo { font-size: 1.25rem; font-weight: bold; }
.footer-copyright { font-size: 0.875rem; color: #9ca3af; }

/* Input Variants */
.input-default { border: 1px solid #d1d5db; }
.input-default:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
.input-modern { border: none; border-bottom: 2px solid #d1d5db; background: transparent; }
.input-modern:focus { border-bottom-color: #2563eb; box-shadow: none; }
.input-rounded { border: 1px solid #d1d5db; border-radius: 9999px; }
.input-rounded:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
.input-filled { border: none; background: #f3f4f6; }
.input-filled:focus { background: white; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

/* Textarea Variants */
.textarea-default { border: 1px solid #d1d5db; }
.textarea-default:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
.textarea-modern { border: none; border-bottom: 2px solid #d1d5db; background: transparent; }
.textarea-modern:focus { border-bottom-color: #2563eb; box-shadow: none; }
.textarea-filled { border: none; background: #f3f4f6; }
.textarea-filled:focus { background: white; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

/* Checkbox Variants */
.checkbox-default { padding: 0; }
.checkbox-modern { padding: 12px; border-radius: 8px; transition: background-color 0.2s; }
.checkbox-modern:hover { background: #f9fafb; }
.checkbox-card { padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; transition: border-color 0.2s; }
.checkbox-card:hover { border-color: #2563eb; }

/* Hover effects */
.image-component:hover { transform: scale(1.05); }
.hero-button { background: white; color: #2563eb; padding: 12px 24px; border-radius: 8px; font-weight: 500; border: none; cursor: pointer; transition: background-color 0.2s; }
.hero-button:hover { background: #f3f4f6; }
`

  // Generate specific CSS for each component
  project.pages.forEach((page: any) => {
    page.components.forEach((component: any) => {
      css += `
.component-${component.id} {
    ${getPropertiesStyle(component.properties)}
}
`
    })
  })

  return css
}

function generateCSS(project: any): string {
  let css = `/* Generated CSS for ${project.title} */

body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.container {
    position: relative;
    min-height: 100vh;
    background: white;
}

.page {
    position: relative;
    min-height: 100vh;
}

/* Component Base Styles */
.text-component { display: flex; align-items: center; justify-content: center; }
.button-component { cursor: pointer; border: none; border-radius: 4px; }
.image-component { object-fit: cover; }
.divider-component { border: none; border-top: 1px solid #ccc; }
.section-component { border: 2px dashed #ccc; background: #f9f9f9; }
.input-component { border: 1px solid #ccc; border-radius: 4px; outline: none; }
.textarea-component { border: 1px solid #ccc; border-radius: 4px; outline: none; resize: none; }
.checkbox-component { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.unknown-component { display: flex; align-items: center; justify-content: center; }

/* Hover effects */
.button-component:hover { opacity: 0.9; }
.input-component:focus { border-color: #007bff; }
.textarea-component:focus { border-color: #007bff; }

/* Component Specific Styles */
`

  // Generate CSS for each component
  project.pages.forEach((page: any) => {
    page.components.forEach((component: any) => {
      css += `
.component-${component.id} {
    ${getPropertiesStyle(component.properties)}
}
`
    })
  })

  return css
}
