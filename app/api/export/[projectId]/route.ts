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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; }
        .container { max-width: 100%; margin: 0 auto; }
        .page { width: 100%; min-height: 100vh; position: relative; }
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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; }
        .container { max-width: 100%; margin: 0 auto; }
        .page { width: 100%; min-height: 100vh; position: relative; }
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
  
  // Use responsive layout instead of absolute positioning
  const width = properties.width || "auto"
  const height = properties.height || "auto"
  const margin = properties.margin || "0"
  const padding = properties.padding || "0"
  
  const style = `width: ${width}px; height: ${height}px; margin: ${margin}px; padding: ${padding}px;`

  switch (type) {
    case "text":
      return `<div class="component-${component.id} text-component" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Your compelling text here"}</div>`

    case "heading":
      const headingLevel = properties.headingLevel || "h1"
      return `<${headingLevel} class="component-${component.id} heading-component" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Your Heading"}</${headingLevel}>`

    case "paragraph":
      return `<p class="component-${component.id} paragraph-component" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Your paragraph text goes here. This is a longer text block that can contain multiple sentences and provide more detailed information to your readers."}</p>`

    case "link":
      const linkClass = `link-${properties.linkStyle || "default"}`
      return `<a class="component-${component.id} link-component ${linkClass}" href="${properties.href || "#"}" target="${properties.target || "_self"}" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Click here"}</a>`

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
      const sectionContent = properties.sectionContent || "default"
      
      const renderSectionContent = () => {
        switch (sectionContent) {
          case "custom":
            return `
              <div class="section-content">
                <h2>${properties.sectionTitle || "Section Container"}</h2>
                <p>${properties.sectionDescription || "Perfect for organizing your content"}</p>
              </div>
            `
          case "empty":
            return ""
          case "default":
          default:
            return `
              <div class="section-content">
                <h2>Section Container</h2>
                <p>Perfect for organizing your content</p>
              </div>
            `
        }
      }
      
      return `<section class="component-${component.id} section-component ${sectionClass}" style="${style} ${getPropertiesStyle(properties)}">
        ${renderSectionContent()}
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
      const heroContent = properties.heroContent || "default"
      
      const renderHeroContent = () => {
        switch (heroContent) {
          case "custom":
            return `
              <div class="hero-content">
                <h1>${properties.heroTitle || "Hero Section"}</h1>
                <p>${properties.heroDescription || "Create stunning hero sections for your website"}</p>
                ${properties.heroButtonText ? `<button class="hero-button">${properties.heroButtonText}</button>` : ''}
              </div>
            `
          case "empty":
            return ""
          case "default":
          default:
            return `
              <div class="hero-content">
                <h1>${properties.heading || "Hero Section"}</h1>
                <p>${properties.subheading || "Create stunning hero sections for your website"}</p>
                ${properties.buttonText ? `<button class="hero-button">${properties.buttonText}</button>` : ''}
              </div>
            `
        }
      }
      
      return `<div class="component-${component.id} hero-component ${heroClass}" style="${style} ${getPropertiesStyle(properties)}">
        ${renderHeroContent()}
      </div>`

    case "navigation":
      const navContent = properties.navContent || "default"
      
      const renderNavContent = () => {
        switch (navContent) {
          case "custom":
            const customMenuItems = properties.customMenuItems ? 
              properties.customMenuItems.split(',').map((item: string) => item.trim()) : 
              ['Home', 'About', 'Services', 'Contact']
            return `
              <div class="nav-content">
                <div class="nav-logo">${properties.navLogoText || "Logo"}</div>
                <div class="nav-links">
                  ${customMenuItems.map((item: string) => `<a href="#">${item}</a>`).join('')}
                </div>
              </div>
            `
          case "empty":
            return ""
          case "default":
          default:
            const menuItems = properties.menuItems ? 
              properties.menuItems.split(',').map((item: string) => item.trim()) : 
              ['Home', 'About', 'Services', 'Contact']
            return `
              <div class="nav-content">
                <div class="nav-logo">${properties.logoText || "Logo"}</div>
                <div class="nav-links">
                  ${menuItems.map((item: string) => `<a href="#">${item}</a>`).join('')}
                </div>
              </div>
            `
        }
      }
      
      return `<nav class="component-${component.id} navigation-component" style="${style} ${getPropertiesStyle(properties)}">
        ${renderNavContent()}
      </nav>`

    case "footer":
      const footerStyle = properties.footerStyle || "default"
      const footerContent = properties.footerContent || "default"
      const footerClass = `footer-${footerStyle}`
      
      const renderFooterContent = () => {
        switch (footerContent) {
          case "custom":
            return `
              <div class="footer-content">
                <div class="footer-logo">${properties.footerCompanyName || "Your Company"}</div>
                <div class="footer-copyright">${properties.footerCopyrightText || "© 2024 All rights reserved"}</div>
                ${properties.footerAdditionalText ? `<div class="footer-additional">${properties.footerAdditionalText}</div>` : ''}
              </div>
            `
          case "empty":
            return ""
          case "default":
          default:
            return `
              <div class="footer-content">
                <div class="footer-logo">${properties.companyName || "Your Company"}</div>
                <div class="footer-copyright">${properties.copyrightText || "© 2024 All rights reserved"}</div>
                ${properties.additionalText ? `<div class="footer-additional">${properties.additionalText}</div>` : ''}
              </div>
            `
        }
      }
      
      return `<footer class="component-${component.id} footer-component ${footerClass}" style="${style} ${getPropertiesStyle(properties)}">
        ${renderFooterContent()}
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

    case "form":
      const formStyle = properties.formStyle || "default"
      const formClass = `form-${formStyle}`
      const formFields = properties.formFields ? 
        properties.formFields.split(',').map((field: string) => field.trim()) : 
        ['Name', 'Email', 'Message']
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 300
      const componentHeight = parseInt(properties.height) || 250
      const paddingScale = Math.min(componentWidth / 400, componentHeight / 300, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const titleSize = Math.max(12, Math.floor(18 * paddingScale))
      const labelSize = Math.max(10, Math.floor(14 * paddingScale))
      const inputPadding = Math.max(6, Math.floor(12 * paddingScale))
      const buttonPadding = Math.max(4, Math.floor(8 * paddingScale))
      const fieldSpacing = Math.max(8, Math.floor(16 * paddingScale))
      
      const formFieldsHTML = formFields.map((field: string) => {
        if (field.toLowerCase() === 'message') {
          return `
            <div class="form-field" style="margin-bottom: ${fieldSpacing}px;">
              <label class="form-label" style="font-size: ${labelSize}px;">${field}</label>
              <textarea placeholder="Enter your ${field.toLowerCase()}" rows="${Math.max(2, Math.floor(3 * paddingScale))}" class="form-textarea" style="padding: ${inputPadding}px; font-size: ${labelSize}px;"></textarea>
            </div>
          `
        } else {
          return `
            <div class="form-field" style="margin-bottom: ${fieldSpacing}px;">
              <label class="form-label" style="font-size: ${labelSize}px;">${field}</label>
              <input type="${field.toLowerCase() === 'email' ? 'email' : 'text'}" placeholder="Enter your ${field.toLowerCase()}" class="form-input" style="padding: ${inputPadding}px; font-size: ${labelSize}px;" />
            </div>
          `
        }
      }).join('')
      
      return `<div class="component-${component.id} form-component ${formClass}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="form-container" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <h3 class="form-title" style="font-size: ${titleSize}px; margin-bottom: ${fieldSpacing}px;">${properties.formTitle || "Contact Form"}</h3>
          <div class="form-fields" style="display: flex; flex-direction: column; gap: ${fieldSpacing}px;">
            ${formFieldsHTML}
          </div>
          <button class="form-button" style="padding: ${buttonPadding}px ${buttonPadding * 2}px; font-size: ${labelSize}px; margin-top: ${fieldSpacing}px;">${properties.submitText || "Submit"}</button>
        </div>
      </div>`

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
      const pricingStyle = properties.pricingStyle || "default"
      const isPopular = properties.isPopular === 'true'
      const currency = properties.currency || '$'
      const period = properties.period || '/month'
      const features = properties.features ? 
        properties.features.split(',').map((feature: string) => feature.trim()) : 
        ['Feature 1', 'Feature 2', 'Feature 3']
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 250
      const componentHeight = parseInt(properties.height) || 300
      const paddingScale = Math.min(componentWidth / 250, componentHeight / 300, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const priceSize = Math.max(16, Math.floor(24 * paddingScale))
      const planNameSize = Math.max(14, Math.floor(18 * paddingScale))
      const featureSize = Math.max(10, Math.floor(14 * paddingScale))
      const buttonPadding = Math.max(4, Math.floor(8 * paddingScale))
      
      const pricingVariants = {
        default: "pricing-card-default",
        featured: "pricing-card-featured",
        minimal: "pricing-card-minimal",
        card: "pricing-card-shadow",
        modern: "pricing-card-modern",
        dark: "pricing-card-dark"
      }
      
      return `<div class="component-${component.id} pricing-component ${pricingVariants[String(pricingStyle) as keyof typeof pricingVariants]} ${isPopular ? 'pricing-popular' : ''}" style="${style} ${getPropertiesStyle(properties)}">
        ${isPopular ? '<div class="pricing-badge">Most Popular</div>' : ''}
        <div class="pricing-card" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <div class="pricing-price" style="font-size: ${priceSize}px; font-weight: bold; margin-bottom: 8px;">
            <span style="font-size: ${Math.max(12, Math.floor(16 * paddingScale))}px; font-weight: normal;">${currency}</span>
            ${properties.price || "29"}
            <span style="font-size: ${Math.max(12, Math.floor(16 * paddingScale))}px; font-weight: normal;">${period}</span>
          </div>
          <div class="pricing-title" style="font-size: ${planNameSize}px; font-weight: 600; margin-bottom: 16px;">
            ${properties.planName || "Pro Plan"}
          </div>
          ${properties.description ? `<div class="pricing-description" style="font-size: ${Math.max(10, Math.floor(12 * paddingScale))}px; margin-bottom: 16px; color: #666;">${properties.description}</div>` : ''}
          <ul class="pricing-features" style="font-size: ${featureSize}px; margin-bottom: 24px; flex: 1;">
            ${features.map((feature: string) => `<li style="display: flex; align-items: center; margin-bottom: 8px;"><span style="color: #10b981; margin-right: 8px;">✓</span>${feature}</li>`).join('')}
          </ul>
          <button class="pricing-button" style="padding: ${buttonPadding}px ${buttonPadding * 2}px; font-size: ${featureSize}px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">${properties.buttonText || "Choose Plan"}</button>
        </div>
      </div>`

    case "testimonial":
      const testimonialStyle = properties.testimonialStyle || "default"
      const rating = parseInt(properties.rating) || 5
      const showRating = properties.showRating === 'true'
      const showAvatar = properties.showAvatar !== 'false'
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 300
      const componentHeight = parseInt(properties.height) || 200
      const paddingScale = Math.min(componentWidth / 300, componentHeight / 200, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const quoteSize = Math.max(12, Math.floor(16 * paddingScale))
      const authorSize = Math.max(12, Math.floor(14 * paddingScale))
      const titleSize = Math.max(10, Math.floor(12 * paddingScale))
      const avatarSize = Math.max(24, Math.floor(40 * paddingScale))
      
      const testimonialVariants = {
        default: "testimonial-card-default",
        card: "testimonial-card-shadow",
        minimal: "testimonial-card-minimal",
        quote: "testimonial-card-quote",
        modern: "testimonial-card-modern",
        dark: "testimonial-card-dark",
        featured: "testimonial-card-featured"
      }
      
      const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => 
          `<span style="color: ${i < rating ? '#fbbf24' : '#d1d5db'}; font-size: ${Math.max(10, Math.floor(12 * paddingScale))}px;">★</span>`
        ).join('')
      }
      
      return `<div class="component-${component.id} testimonial-component ${testimonialVariants[String(testimonialStyle) as keyof typeof testimonialVariants]}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="testimonial-card" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          ${showRating ? `<div style="display: flex; justify-content: center; margin-bottom: 12px; font-size: ${Math.max(10, Math.floor(12 * paddingScale))}px;">${renderStars(rating)}</div>` : ''}
          <div class="testimonial-quote" style="font-style: italic; margin-bottom: 16px; color: #374151; font-size: ${quoteSize}px;">
            "${properties.quote || "This is an amazing product that has transformed our business. Highly recommended!"}"
          </div>
          <div style="display: flex; align-items: center;">
            ${showAvatar ? `<div style="width: ${avatarSize}px; height: ${avatarSize}px; background: #d1d5db; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
              <span style="color: #6b7280; font-weight: 600; font-size: ${Math.max(12, Math.floor(14 * paddingScale))}px;">
                ${properties.authorName ? properties.authorName.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>` : ''}
            <div>
              <div class="testimonial-author" style="font-weight: 600; color: #111827; font-size: ${authorSize}px;">
                ${properties.authorName || "John Doe"}
              </div>
              ${properties.authorTitle ? `<div class="testimonial-title" style="color: #6b7280; font-size: ${titleSize}px;">${properties.authorTitle}</div>` : ''}
            </div>
          </div>
        </div>
      </div>`

    case "contact":
      const contactStyle = properties.contactStyle || "default"
      const showTitle = properties.showTitle !== 'false'
      const showDescription = properties.showDescription === 'true'
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 400
      const componentHeight = parseInt(properties.height) || 300
      const paddingScale = Math.min(componentWidth / 400, componentHeight / 300, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const titleSize = Math.max(16, Math.floor(20 * paddingScale))
      const labelSize = Math.max(12, Math.floor(14 * paddingScale))
      const inputSize = Math.max(12, Math.floor(14 * paddingScale))
      const inputPadding = Math.max(6, Math.floor(12 * paddingScale))
      const buttonPadding = Math.max(4, Math.floor(8 * paddingScale))
      const spacing = Math.max(4, Math.floor(8 * paddingScale))
      
      const contactVariants = {
        default: "contact-form-default",
        card: "contact-form-shadow",
        minimal: "contact-form-minimal",
        modern: "contact-form-modern",
        dark: "contact-form-dark",
        featured: "contact-form-featured"
      }
      
      return `<div class="component-${component.id} contact-component ${contactVariants[String(contactStyle) as keyof typeof contactVariants]}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="contact-form" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          ${showTitle ? `<div style="font-weight: bold; margin-bottom: 8px; text-align: center; font-size: ${titleSize}px;">${properties.title || "Contact Us"}</div>` : ''}
          ${showDescription && properties.description ? `<div style="color: #666; margin-bottom: 16px; text-align: center; font-size: ${Math.max(10, Math.floor(12 * paddingScale))}px;">${properties.description}</div>` : ''}
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-size: ${labelSize}px; font-weight: 500; margin-bottom: 4px;">${properties.nameLabel || "Name"}</label>
              <input type="text" placeholder="${properties.namePlaceholder || "Enter your name"}" style="width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: ${inputPadding}px; font-size: ${inputSize}px; outline: none;" />
            </div>
            <div>
              <label style="display: block; font-size: ${labelSize}px; font-weight: 500; margin-bottom: 4px;">${properties.emailLabel || "Email"}</label>
              <input type="email" placeholder="${properties.emailPlaceholder || "Enter your email"}" style="width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: ${inputPadding}px; font-size: ${inputSize}px; outline: none;" />
            </div>
            <div>
              <label style="display: block; font-size: ${labelSize}px; font-weight: 500; margin-bottom: 4px;">${properties.messageLabel || "Message"}</label>
              <textarea placeholder="${properties.messagePlaceholder || "Enter your message"}" rows="3" style="width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: ${inputPadding}px; font-size: ${inputSize}px; outline: none; resize: none;"></textarea>
            </div>
            <button style="padding: ${buttonPadding}px ${buttonPadding * 2}px; font-size: ${inputSize}px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; margin-top: ${spacing}px;">${properties.submitText || "Send Message"}</button>
          </div>
        </div>
      </div>`

    case "newsletter":
      const newsletterStyle = properties.newsletterStyle || "default"
      const showTitle = properties.showTitle !== 'false'
      const showDescription = properties.showDescription !== 'false'
      const showSocialLinks = properties.showSocialLinks === 'true'
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 400
      const componentHeight = parseInt(properties.height) || 200
      const paddingScale = Math.min(componentWidth / 400, componentHeight / 200, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const titleSize = Math.max(16, Math.floor(20 * paddingScale))
      const descriptionSize = Math.max(12, Math.floor(14 * paddingScale))
      const inputSize = Math.max(12, Math.floor(14 * paddingScale))
      const inputPadding = Math.max(6, Math.floor(12 * paddingScale))
      const buttonPadding = Math.max(4, Math.floor(8 * paddingScale))
      
      const newsletterVariants = {
        default: "newsletter-card-default",
        card: "newsletter-card-shadow",
        minimal: "newsletter-card-minimal",
        modern: "newsletter-card-modern",
        dark: "newsletter-card-dark",
        featured: "newsletter-card-featured",
        gradient: "newsletter-card-gradient"
      }
      
      return `<div class="component-${component.id} newsletter-component ${newsletterVariants[String(newsletterStyle) as keyof typeof newsletterVariants]}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="newsletter-card" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          ${showTitle ? `<div style="font-weight: bold; margin-bottom: 8px; text-align: center; font-size: ${titleSize}px;">${properties.title || "Subscribe to Our Newsletter"}</div>` : ''}
          ${showDescription ? `<div style="color: #666; margin-bottom: 16px; text-align: center; font-size: ${descriptionSize}px;">${properties.description || "Stay updated with our latest news and updates"}</div>` : ''}
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
            <input type="email" placeholder="${properties.emailPlaceholder || "Enter your email"}" style="flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: ${inputPadding}px; font-size: ${inputSize}px; outline: none;" />
            <button style="padding: ${buttonPadding}px ${buttonPadding * 2}px; font-size: ${inputSize}px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">${properties.buttonText || "Subscribe"}</button>
          </div>
          ${showSocialLinks ? `<div style="display: flex; justify-content: center; gap: 16px; margin-top: 16px;">
            <a href="#" style="color: #9ca3af; font-size: 18px; text-decoration: none;">📧</a>
            <a href="#" style="color: #9ca3af; font-size: 18px; text-decoration: none;">📱</a>
            <a href="#" style="color: #9ca3af; font-size: 18px; text-decoration: none;">💬</a>
          </div>` : ''}
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

    case "statistics":
      const statsStyle = properties.statsStyle || "default"
      const showTitle = properties.showTitle !== 'false'
      const showDescription = properties.showDescription === 'true'
      const layout = properties.layout || 'grid'
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 400
      const componentHeight = parseInt(properties.height) || 200
      const paddingScale = Math.min(componentWidth / 400, componentHeight / 200, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const titleSize = Math.max(16, Math.floor(20 * paddingScale))
      const numberSize = Math.max(20, Math.floor(32 * paddingScale))
      const labelSize = Math.max(12, Math.floor(14 * paddingScale))
      const descriptionSize = Math.max(10, Math.floor(12 * paddingScale))
      
      const stats = [
        {
          number: properties.stat1Number || "1000+",
          label: properties.stat1Label || "Happy Customers",
          description: properties.stat1Description || "Satisfied clients worldwide"
        },
        {
          number: properties.stat2Number || "50+",
          label: properties.stat2Label || "Projects Completed",
          description: properties.stat2Description || "Successful project deliveries"
        },
        {
          number: properties.stat3Number || "24/7",
          label: properties.stat3Label || "Support Available",
          description: properties.stat3Description || "Round the clock assistance"
        },
        {
          number: properties.stat4Number || "99%",
          label: properties.stat4Label || "Satisfaction Rate",
          description: properties.stat4Description || "Customer satisfaction score"
        }
      ]
      
      const layoutStyles = {
        grid: "display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;",
        list: "display: flex; flex-direction: column; gap: 16px;",
        horizontal: "display: flex; flex-wrap: wrap; gap: 16px;"
      }
      
      const statsVariants = {
        default: "stats-card-default",
        card: "stats-card-shadow",
        minimal: "stats-card-minimal",
        modern: "stats-card-modern",
        dark: "stats-card-dark",
        featured: "stats-card-featured",
        gradient: "stats-card-gradient"
      }
      
      return `<div class="component-${component.id} statistics-component ${statsVariants[String(statsStyle) as keyof typeof statsVariants]}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="statistics-card" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          ${showTitle ? `<div style="font-weight: bold; margin-bottom: 16px; text-align: center; font-size: ${titleSize}px;">${properties.title || "Our Statistics"}</div>` : ''}
          ${showDescription && properties.description ? `<div style="color: #666; margin-bottom: 24px; text-align: center; font-size: ${descriptionSize}px;">${properties.description}</div>` : ''}
          <div style="${layoutStyles[String(layout) as keyof typeof layoutStyles]}">
            ${stats.map((stat, index) => `
              <div style="text-align: center;">
                <div style="font-weight: bold; color: #2563eb; margin-bottom: 4px; font-size: ${numberSize}px;">${stat.number}</div>
                <div style="font-weight: 600; margin-bottom: 4px; font-size: ${labelSize}px;">${stat.label}</div>
                ${stat.description ? `<div style="color: #666; font-size: ${Math.max(8, Math.floor(10 * paddingScale))}px;">${stat.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>`

    case "faq":
      const faqStyle = properties.faqStyle || "default"
      const showAnswers = properties.showAnswers === 'true'
      const showIcons = properties.showIcons !== 'false'
      
      // Calculate dynamic sizing for export
      const faqComponentWidth = parseInt(properties.width) || 300
      const faqComponentHeight = parseInt(properties.height) || 200
      const faqPaddingScale = Math.min(faqComponentWidth / 300, faqComponentHeight / 200, 1.5)
      const faqPadding = Math.max(8, Math.floor(16 * faqPaddingScale))
      const questionSize = Math.max(12, Math.floor(16 * faqPaddingScale))
      const answerSize = Math.max(12, Math.floor(14 * faqPaddingScale))
      const iconSize = Math.max(24, Math.floor(40 * faqPaddingScale))
      
      const faqVariants = {
        default: "faq-card-default",
        card: "faq-card-shadow",
        minimal: "faq-card-minimal",
        modern: "faq-card-modern",
        dark: "faq-card-dark",
        featured: "faq-card-featured"
      }
      
      const questions = properties.questions || ['Question 1', 'Question 2', 'Question 3']
      const answers = properties.answers || ['Answer 1', 'Answer 2', 'Answer 3']
      
      return `<div class="component-${component.id} faq-component ${faqVariants[String(faqStyle) as keyof typeof faqVariants]}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="faq-card" style="padding: ${faqPadding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          ${questions.map((question: string, index: number) => `
            <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="font-weight: 600; margin-bottom: 8px; font-size: ${questionSize}px;">${question}</div>
              ${showAnswers ? `<div style="color: #666; font-size: ${answerSize}px; padding: ${faqPadding}px;">${answers[index] || "This is the answer to the question."}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>`

    case "tabs":
      const tabsStyle = properties.tabsStyle || "default"
      const tabItems = properties.tabItems ? 
        properties.tabItems.split(',').map((item: string) => item.trim()) : 
        ['Tab 1', 'Tab 2', 'Tab 3']
      
      return `<div class="component-${component.id} tabs-component tabs-${tabsStyle}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="tabs-content">
          ${tabItems.map((item: string, index: number) => `
            <button class="tab-item ${index === 0 ? 'active' : ''}">${item}</button>
          `).join('')}
        </div>
      </div>`

    case "accordion":
      const accordionStyle = properties.accordionStyle || "default"
      const accordionItems = properties.accordionItems ? 
        properties.accordionItems.split(',').map((item: string) => item.trim()) : 
        ['Section 1', 'Section 2', 'Section 3']
      
      return `<div class="component-${component.id} accordion-component accordion-${accordionStyle}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="accordion-content">
          ${accordionItems.map((item: string, index: number) => `
            <div class="accordion-item">
              <button class="accordion-trigger">
                <span>${item}</span>
                <span class="accordion-arrow">▼</span>
              </button>
            </div>
          `).join('')}
        </div>
      </div>`

    case "modal":
      const modalStyle = properties.modalStyle || "default"
      return `<div class="component-${component.id} modal-component modal-${modalStyle}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="modal-content">
          <div class="modal-header">
            <h3>${properties.title || "Modal Dialog"}</h3>
          </div>
          <div class="modal-body">
            <p>${properties.content || "This is a modal dialog component"}</p>
          </div>
          <div class="modal-footer">
            <button class="modal-close">${properties.buttonText || "Close"}</button>
          </div>
        </div>
      </div>`

    case "tooltip":
      const tooltipStyle = properties.tooltipStyle || "default"
      return `<div class="component-${component.id} tooltip-component tooltip-${tooltipStyle}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="tooltip-wrapper">
          <button class="tooltip-trigger">${properties.triggerText || "Hover me"}</button>
          <div class="tooltip-content">${properties.tooltipText || "Tooltip content"}</div>
        </div>
      </div>`

    case "dropdown":
      const dropdownStyle = properties.dropdownStyle || "default"
      const dropdownItems = properties.dropdownItems ? 
        properties.dropdownItems.split(',').map((item: string) => item.trim()) : 
        ['Option 1', 'Option 2', 'Option 3']
      
      return `<div class="component-${component.id} dropdown-component dropdown-${dropdownStyle}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="dropdown-wrapper">
          <button class="dropdown-trigger">
            <span>${properties.triggerText || "Dropdown"}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="dropdown-menu">
            ${dropdownItems.map((item: string, index: number) => `
              <button class="dropdown-item">${item}</button>
            `).join('')}
          </div>
        </div>
      </div>`

    case "video":
      const videoStyle = properties.videoStyle || "default"
      return `<div class="component-${component.id} video-component video-${videoStyle}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="video-placeholder">
          <div class="video-icon">▶</div>
          <div class="video-title">${properties.videoTitle || "Video Player"}</div>
          ${properties.videoDescription ? `<div class="video-description">${properties.videoDescription}</div>` : ''}
        </div>
      </div>`

    case "gallery":
      const galleryStyle = properties.galleryStyle || "default"
      return `<div class="component-${component.id} gallery-component gallery-${galleryStyle}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="gallery-grid">
          <div class="gallery-item"></div>
          <div class="gallery-item"></div>
          <div class="gallery-item"></div>
          <div class="gallery-item"></div>
        </div>
      </div>`

    case "slider":
      const sliderStyle = properties.sliderStyle || "default"
      return `<div class="component-${component.id} slider-component slider-${sliderStyle}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="slider-placeholder">
          <div class="slider-icon">🖼️</div>
          <div class="slider-title">${properties.sliderTitle || "Image Slider"}</div>
          ${properties.sliderDescription ? `<div class="slider-description">${properties.sliderDescription}</div>` : ''}
        </div>
      </div>`

    case "icon":
      const iconStyle = properties.iconStyle || "default"
      const iconSize = properties.iconSize || "default"
      return `<div class="component-${component.id} icon-component icon-${iconStyle} icon-${iconSize}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="icon-content">
          ${properties.iconName ? `<span class="icon-text">${properties.iconName}</span>` : '<span class="icon-placeholder">Icon</span>'}
        </div>
      </div>`

    case "pricing":
      const pricingStyle = properties.pricingStyle || "default"
      const isPopular = properties.isPopular === 'true'
      const currency = properties.currency || '$'
      const period = properties.period || '/month'
      const features = properties.features ? 
        properties.features.split(',').map((feature: string) => feature.trim()) : 
        ['Feature 1', 'Feature 2', 'Feature 3']
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 250
      const componentHeight = parseInt(properties.height) || 300
      const paddingScale = Math.min(componentWidth / 250, componentHeight / 300, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const priceSize = Math.max(16, Math.floor(24 * paddingScale))
      const planNameSize = Math.max(14, Math.floor(18 * paddingScale))
      const featureSize = Math.max(10, Math.floor(14 * paddingScale))
      const buttonPadding = Math.max(4, Math.floor(8 * paddingScale))
      
      const pricingVariants = {
        default: "pricing-card-default",
        featured: "pricing-card-featured",
        minimal: "pricing-card-minimal",
        card: "pricing-card-shadow",
        modern: "pricing-card-modern",
        dark: "pricing-card-dark"
      }
      
      return `<div class="component-${component.id} pricing-component ${pricingVariants[String(pricingStyle) as keyof typeof pricingVariants]} ${isPopular ? 'pricing-popular' : ''}" style="${style} ${getPropertiesStyle(properties)}">
        ${isPopular ? '<div class="pricing-badge">Most Popular</div>' : ''}
        <div class="pricing-card" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <div class="pricing-price" style="font-size: ${priceSize}px; font-weight: bold; margin-bottom: 8px;">
            <span style="font-size: ${Math.max(12, Math.floor(16 * paddingScale))}px; font-weight: normal;">${currency}</span>
            ${properties.price || "29"}
            <span style="font-size: ${Math.max(12, Math.floor(16 * paddingScale))}px; font-weight: normal;">${period}</span>
          </div>
          <div class="pricing-title" style="font-size: ${planNameSize}px; font-weight: 600; margin-bottom: 16px;">
            ${properties.planName || "Pro Plan"}
          </div>
          ${properties.description ? `<div class="pricing-description" style="font-size: ${Math.max(10, Math.floor(12 * paddingScale))}px; margin-bottom: 16px; color: #666;">${properties.description}</div>` : ''}
          <ul class="pricing-features" style="font-size: ${featureSize}px; margin-bottom: 24px; flex: 1;">
            ${features.map((feature: string) => `<li style="display: flex; align-items: center; margin-bottom: 8px;"><span style="color: #10b981; margin-right: 8px;">✓</span>${feature}</li>`).join('')}
          </ul>
          <button class="pricing-button" style="padding: ${buttonPadding}px ${buttonPadding * 2}px; font-size: ${featureSize}px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">${properties.buttonText || "Choose Plan"}</button>
        </div>
      </div>`

    case "testimonial":
      const testimonialStyle = properties.testimonialStyle || "default"
      const rating = parseInt(properties.rating) || 5
      const showRating = properties.showRating === 'true'
      const showAvatar = properties.showAvatar !== 'false'
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 300
      const componentHeight = parseInt(properties.height) || 200
      const paddingScale = Math.min(componentWidth / 300, componentHeight / 200, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const quoteSize = Math.max(12, Math.floor(16 * paddingScale))
      const authorSize = Math.max(12, Math.floor(14 * paddingScale))
      const titleSize = Math.max(10, Math.floor(12 * paddingScale))
      const avatarSize = Math.max(24, Math.floor(40 * paddingScale))
      
      const testimonialVariants = {
        default: "testimonial-card-default",
        card: "testimonial-card-shadow",
        minimal: "testimonial-card-minimal",
        quote: "testimonial-card-quote",
        modern: "testimonial-card-modern",
        dark: "testimonial-card-dark",
        featured: "testimonial-card-featured"
      }
      
      const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => 
          `<span style="color: ${i < rating ? '#fbbf24' : '#d1d5db'}; font-size: ${Math.max(10, Math.floor(12 * paddingScale))}px;">★</span>`
        ).join('')
      }
      
      return `<div class="component-${component.id} testimonial-component ${testimonialVariants[String(testimonialStyle) as keyof typeof testimonialVariants]}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="testimonial-card" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          ${showRating ? `<div style="display: flex; justify-content: center; margin-bottom: 12px; font-size: ${Math.max(10, Math.floor(12 * paddingScale))}px;">${renderStars(rating)}</div>` : ''}
          <div class="testimonial-quote" style="font-style: italic; margin-bottom: 16px; color: #374151; font-size: ${quoteSize}px;">
            "${properties.quote || "This is an amazing product that has transformed our business. Highly recommended!"}"
          </div>
          <div style="display: flex; align-items: center;">
            ${showAvatar ? `<div style="width: ${avatarSize}px; height: ${avatarSize}px; background: #d1d5db; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
              <span style="color: #6b7280; font-weight: 600; font-size: ${Math.max(12, Math.floor(14 * paddingScale))}px;">
                ${properties.authorName ? properties.authorName.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>` : ''}
            <div>
              <div class="testimonial-author" style="font-weight: 600; color: #111827; font-size: ${authorSize}px;">
                ${properties.authorName || "John Doe"}
              </div>
              ${properties.authorTitle ? `<div class="testimonial-title" style="color: #6b7280; font-size: ${titleSize}px;">${properties.authorTitle}</div>` : ''}
            </div>
          </div>
        </div>
      </div>`

    case "contact":
      const contactStyle = properties.contactStyle || "default"
      const showTitle = properties.showTitle !== 'false'
      const showDescription = properties.showDescription === 'true'
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 400
      const componentHeight = parseInt(properties.height) || 300
      const paddingScale = Math.min(componentWidth / 400, componentHeight / 300, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const titleSize = Math.max(16, Math.floor(20 * paddingScale))
      const labelSize = Math.max(12, Math.floor(14 * paddingScale))
      const inputSize = Math.max(12, Math.floor(14 * paddingScale))
      const inputPadding = Math.max(6, Math.floor(12 * paddingScale))
      const buttonPadding = Math.max(4, Math.floor(8 * paddingScale))
      const spacing = Math.max(4, Math.floor(8 * paddingScale))
      
      const contactVariants = {
        default: "contact-form-default",
        card: "contact-form-shadow",
        minimal: "contact-form-minimal",
        modern: "contact-form-modern",
        dark: "contact-form-dark",
        featured: "contact-form-featured"
      }
      
      return `<div class="component-${component.id} contact-component ${contactVariants[String(contactStyle) as keyof typeof contactVariants]}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="contact-form" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          ${showTitle ? `<div style="font-weight: bold; margin-bottom: 8px; text-align: center; font-size: ${titleSize}px;">${properties.title || "Contact Us"}</div>` : ''}
          ${showDescription && properties.description ? `<div style="color: #666; margin-bottom: 16px; text-align: center; font-size: ${Math.max(10, Math.floor(12 * paddingScale))}px;">${properties.description}</div>` : ''}
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="display: block; font-size: ${labelSize}px; font-weight: 500; margin-bottom: 4px;">${properties.nameLabel || "Name"}</label>
              <input type="text" placeholder="${properties.namePlaceholder || "Enter your name"}" style="width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: ${inputPadding}px; font-size: ${inputSize}px; outline: none;" />
            </div>
            <div>
              <label style="display: block; font-size: ${labelSize}px; font-weight: 500; margin-bottom: 4px;">${properties.emailLabel || "Email"}</label>
              <input type="email" placeholder="${properties.emailPlaceholder || "Enter your email"}" style="width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: ${inputPadding}px; font-size: ${inputSize}px; outline: none;" />
            </div>
            <div>
              <label style="display: block; font-size: ${labelSize}px; font-weight: 500; margin-bottom: 4px;">${properties.messageLabel || "Message"}</label>
              <textarea placeholder="${properties.messagePlaceholder || "Enter your message"}" rows="3" style="width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: ${inputPadding}px; font-size: ${inputSize}px; outline: none; resize: none;"></textarea>
            </div>
            <button style="padding: ${buttonPadding}px ${buttonPadding * 2}px; font-size: ${inputSize}px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; margin-top: ${spacing}px;">${properties.submitText || "Send Message"}</button>
          </div>
        </div>
      </div>`

    case "newsletter":
      const newsletterStyle = properties.newsletterStyle || "default"
      const showTitle = properties.showTitle !== 'false'
      const showDescription = properties.showDescription !== 'false'
      const showSocialLinks = properties.showSocialLinks === 'true'
      
      // Calculate dynamic sizing for export
      const componentWidth = parseInt(properties.width) || 400
      const componentHeight = parseInt(properties.height) || 200
      const paddingScale = Math.min(componentWidth / 400, componentHeight / 200, 1.5)
      const padding = Math.max(8, Math.floor(16 * paddingScale))
      const titleSize = Math.max(16, Math.floor(20 * paddingScale))
      const descriptionSize = Math.max(12, Math.floor(14 * paddingScale))
      const inputSize = Math.max(12, Math.floor(14 * paddingScale))
      const inputPadding = Math.max(6, Math.floor(12 * paddingScale))
      const buttonPadding = Math.max(4, Math.floor(8 * paddingScale))
      
      const newsletterVariants = {
        default: "newsletter-card-default",
        card: "newsletter-card-shadow",
        minimal: "newsletter-card-minimal",
        modern: "newsletter-card-modern",
        dark: "newsletter-card-dark",
        featured: "newsletter-card-featured",
        gradient: "newsletter-card-gradient"
      }
      
      return `<div class="component-${component.id} newsletter-component ${newsletterVariants[String(newsletterStyle) as keyof typeof newsletterVariants]}" style="${style} ${getPropertiesStyle(properties)}">
        <div class="newsletter-card" style="padding: ${padding}px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          ${showTitle ? `<div style="font-weight: bold; margin-bottom: 8px; text-align: center; font-size: ${titleSize}px;">${properties.title || "Subscribe to Our Newsletter"}</div>` : ''}
          ${showDescription ? `<div style="color: #666; margin-bottom: 16px; text-align: center; font-size: ${descriptionSize}px;">${properties.description || "Stay updated with our latest news and updates"}</div>` : ''}
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
            <input type="email" placeholder="${properties.emailPlaceholder || "Enter your email"}" style="flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: ${inputPadding}px; font-size: ${inputSize}px; outline: none;" />
            <button style="padding: ${buttonPadding}px ${buttonPadding * 2}px; font-size: ${inputSize}px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">${properties.buttonText || "Subscribe"}</button>
          </div>
          ${showSocialLinks ? `<div style="display: flex; justify-content: center; gap: 16px; margin-top: 16px;">
            <a href="#" style="color: #9ca3af; font-size: 18px; text-decoration: none;">📧</a>
            <a href="#" style="color: #9ca3af; font-size: 18px; text-decoration: none;">📱</a>
            <a href="#" style="color: #9ca3af; font-size: 18px; text-decoration: none;">💬</a>
          </div>` : ''}
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

  // Font weight and line height
  if (properties.fontWeight) styles.push(`font-weight: ${properties.fontWeight}`)
  if (properties.lineHeight) styles.push(`line-height: ${properties.lineHeight}`)

  // Margin and spacing
  if (properties.margin) styles.push(`margin: ${properties.margin}px`)
  if (properties.marginTop) styles.push(`margin-top: ${properties.marginTop}px`)
  if (properties.marginBottom) styles.push(`margin-bottom: ${properties.marginBottom}px`)
  if (properties.marginLeft) styles.push(`margin-left: ${properties.marginLeft}px`)
  if (properties.marginRight) styles.push(`margin-right: ${properties.marginRight}px`)

  // Z-index for layering
  if (properties.zIndex) styles.push(`z-index: ${properties.zIndex}`)

  // Responsive width
  if (properties.width && properties.width > 0) {
    if (properties.width >= 1200) {
      styles.push(`width: 100%; max-width: 1200px; margin: 0 auto;`)
    } else {
      styles.push(`width: ${properties.width}px;`)
    }
  }

  // Height
  if (properties.height && properties.height > 0) {
    styles.push(`height: ${properties.height}px;`)
  }

  return styles.join("; ")
}

function generateInlineCSS(project: any): string {
  let css = `
/* Responsive Layout */
.container { max-width: 100%; margin: 0 auto; padding: 0 20px; }
.page { width: 100%; min-height: 100vh; position: relative; }

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
.footer-additional { font-size: 0.75rem; color: #9ca3af; margin-top: 8px; }

/* Footer Variants */
.footer-default { background: #1f2937; color: white; }
.footer-minimal { background: #f3f4f6; color: #111827; border-top: 1px solid #e5e7eb; }
.footer-modern { background: linear-gradient(to right, #111827, #1f2937); color: white; }
.footer-dark { background: #000000; color: white; }

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

/* Heading Styles */
.heading-component h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
.heading-component h2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
.heading-component h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
.heading-component h4 { font-size: 1.25rem; font-weight: 500; line-height: 1.4; }
.heading-component h5 { font-size: 1.125rem; font-weight: 500; line-height: 1.5; }
.heading-component h6 { font-size: 1rem; font-weight: 500; line-height: 1.5; }

/* Link Styles */
.link-component { text-decoration: none; transition: all 0.2s; }
.link-default { color: #2563eb; text-decoration: underline; }
.link-default:hover { color: #1d4ed8; }
.link-button { display: inline-block; background: #2563eb; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; }
.link-button:hover { background: #1d4ed8; }
.link-outline { display: inline-block; border: 1px solid #2563eb; color: #2563eb; padding: 8px 16px; border-radius: 8px; text-decoration: none; }
.link-outline:hover { background: #2563eb; color: white; }
.link-minimal { color: #6b7280; text-decoration: underline; }
.link-minimal:hover { color: #111827; }
.link-accent { color: #7c3aed; text-decoration: underline; }
.link-accent:hover { color: #5b21b6; }

/* Responsive Design */
@media (max-width: 768px) {
  .container { padding: 0 16px; }
  .nav-links { gap: 16px; }
  .hero-component h1 { font-size: 2rem; }
  .hero-component p { font-size: 1rem; }
  .heading-component h1 { font-size: 2rem; }
  .heading-component h2 { font-size: 1.75rem; }
  .heading-component h3 { font-size: 1.5rem; }
  .heading-component h4 { font-size: 1.25rem; }
  .heading-component h5 { font-size: 1.125rem; }
  .heading-component h6 { font-size: 1rem; }
}

@media (max-width: 480px) {
  .container { padding: 0 12px; }
  .nav-links { flex-direction: column; gap: 8px; }
  .hero-component h1 { font-size: 1.5rem; }
  .hero-component p { font-size: 0.875rem; }
}

/* New Component Styles */
.form-component { padding: 24px; }
.form-content { max-width: 500px; margin: 0 auto; }
.form-field { margin-bottom: 16px; }
.form-field label { display: block; margin-bottom: 8px; font-weight: 500; color: #374151; }
.form-field input, .form-field textarea { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; outline: none; transition: border-color 0.2s; }
.form-field input:focus, .form-field textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
.form-submit { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
.form-submit:hover { background: #1d4ed8; }

.tabs-component { padding: 16px; }
.tabs-content { display: flex; gap: 4px; }
.tab-item { padding: 8px 16px; border: none; background: transparent; color: #6b7280; font-weight: 500; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.tab-item.active { background: #2563eb; color: white; }
.tab-item:hover:not(.active) { background: #f3f4f6; color: #111827; }

.accordion-component { padding: 16px; }
.accordion-content { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.accordion-item { border-bottom: 1px solid #e5e7eb; }
.accordion-item:last-child { border-bottom: none; }
.accordion-trigger { width: 100%; padding: 16px; background: none; border: none; text-align: left; font-weight: 500; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background-color 0.2s; }
.accordion-trigger:hover { background: #f9fafb; }
.accordion-arrow { transition: transform 0.2s; }

.modal-component { display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%; }
.modal-header { padding: 24px 24px 0; }
.modal-body { padding: 16px 24px; }
.modal-footer { padding: 0 24px 24px; }
.modal-close { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }

.tooltip-component { display: flex; align-items: center; justify-content: center; }
.tooltip-wrapper { position: relative; }
.tooltip-trigger { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
.tooltip-content { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px; padding: 8px 12px; background: #1f2937; color: white; border-radius: 6px; font-size: 14px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
.tooltip-wrapper:hover .tooltip-content { opacity: 1; }

.dropdown-component { display: flex; align-items: center; justify-content: center; }
.dropdown-wrapper { position: relative; }
.dropdown-trigger { padding: 8px 16px; background: white; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.dropdown-menu { position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden; }
.dropdown-item { width: 100%; padding: 8px 16px; background: none; border: none; text-align: left; cursor: pointer; transition: background-color 0.2s; }
.dropdown-item:hover { background: #f9fafb; }

.video-component { display: flex; align-items: center; justify-content: center; }
.video-placeholder { width: 100%; height: 100%; background: #f3f4f6; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.video-icon { font-size: 48px; color: #9ca3af; margin-bottom: 8px; }
.video-title { font-weight: 500; color: #6b7280; }
.video-description { font-size: 14px; color: #9ca3af; margin-top: 4px; }

.gallery-component { padding: 16px; }
.gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; height: 100%; }
.gallery-item { background: #f3f4f6; border-radius: 8px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; }

.slider-component { display: flex; align-items: center; justify-content: center; }
.slider-placeholder { width: 100%; height: 100%; background: #f3f4f6; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.slider-icon { font-size: 48px; color: #9ca3af; margin-bottom: 8px; }
.slider-title { font-weight: 500; color: #6b7280; }
.slider-description { font-size: 14px; color: #9ca3af; margin-top: 4px; }

.icon-component { display: flex; align-items: center; justify-content: center; }
.icon-content { display: flex; align-items: center; justify-content: center; }
.icon-text { font-size: 24px; }
.icon-placeholder { color: #9ca3af; }

.pricing-component { padding: 24px; }
.pricing-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; text-align: center; }
.pricing-price { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
.pricing-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
.pricing-features { list-style: none; margin: 0 0 24px; padding: 0; }
.pricing-features li { margin-bottom: 8px; display: flex; align-items: center; justify-content: center; }
.feature-check { color: #059669; margin-right: 8px; }
.pricing-button { padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
.pricing-button:hover { background: #1d4ed8; }

.testimonial-component { padding: 24px; }
.testimonial-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; }
.testimonial-quote { font-style: italic; color: #6b7280; margin-bottom: 16px; }
.testimonial-author { display: flex; align-items: center; }
.author-avatar { width: 40px; height: 40px; background: #d1d5db; border-radius: 50%; margin-right: 12px; }
.author-name { font-weight: 600; }
.author-title { font-size: 14px; color: #6b7280; }

.contact-component { padding: 24px; }
.contact-form { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; }
.contact-form h3 { margin-bottom: 16px; }
.contact-form input, .contact-form textarea { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 16px; outline: none; }
.contact-form input:focus, .contact-form textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
.contact-submit { padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; }

.newsletter-component { padding: 24px; }
.newsletter-card { background: linear-gradient(to right, #2563eb, #7c3aed); color: white; border-radius: 8px; padding: 24px; text-align: center; }
.newsletter-card h3 { margin-bottom: 8px; }
.newsletter-card p { margin-bottom: 16px; opacity: 0.9; }
.newsletter-form { display: flex; gap: 8px; }
.newsletter-form input { flex: 1; padding: 12px; border: none; border-radius: 8px; color: #111827; }
.newsletter-submit { padding: 12px 24px; background: white; color: #2563eb; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; }

/* Component Variants */
.form-default { background: white; border: 1px solid #e5e7eb; border-radius: 8px; }
.form-card { background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-radius: 8px; }
.form-minimal { background: transparent; border: 1px solid #e5e7eb; border-radius: 8px; }
.form-floating { background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

.tabs-default { border-bottom: 1px solid #e5e7eb; }
.tabs-modern { background: #f9fafb; border-radius: 8px; padding: 4px; }
.tabs-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 4px; }

.accordion-default { border: 1px solid #e5e7eb; border-radius: 8px; }
.accordion-modern { background: white; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border-radius: 8px; }
.accordion-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }

.modal-default { background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.modal-modern { background: white; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
.modal-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

.tooltip-default { background: #1f2937; color: white; border-radius: 6px; }
.tooltip-modern { background: #2563eb; color: white; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.tooltip-light { background: white; color: #111827; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

.dropdown-default { background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.dropdown-modern { background: white; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
.dropdown-minimal { background: white; border: 1px solid #e5e7eb; border-radius: 6px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }

.video-default { background: #f3f4f6; border-radius: 8px; }
.video-modern { background: linear-gradient(to bottom right, #f9fafb, #f3f4f6); border-radius: 8px; }
.video-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }

.gallery-default { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.gallery-modern { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.gallery-masonry { column-count: 2; column-gap: 16px; }

.slider-default { background: #f3f4f6; border-radius: 8px; }
.slider-modern { background: linear-gradient(to right, #f9fafb, #f3f4f6); border-radius: 8px; }
.slider-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }

.icon-default { color: #6b7280; }
.icon-primary { color: #2563eb; }
.icon-secondary { color: #6b7280; }
.icon-accent { color: #7c3aed; }
.icon-success { color: #059669; }
.icon-warning { color: #d97706; }
.icon-danger { color: #dc2626; }

.icon-small { font-size: 16px; }
.icon-default { font-size: 24px; }
.icon-large { font-size: 32px; }
.icon-xl { font-size: 48px; }

.pricing-default { background: white; border: 1px solid #e5e7eb; border-radius: 8px; }
.pricing-featured { background: #2563eb; color: white; border: 1px solid #2563eb; border-radius: 8px; transform: scale(1.05); }
.pricing-minimal { background: transparent; border: 1px solid #e5e7eb; border-radius: 8px; }
.pricing-card { background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-radius: 8px; }

.testimonial-default { background: white; border: 1px solid #e5e7eb; border-radius: 8px; }
.testimonial-card { background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-radius: 8px; }
.testimonial-minimal { background: transparent; border: 1px solid #e5e7eb; border-radius: 8px; }
.testimonial-quote { background: #f9fafb; border-left: 4px solid #2563eb; padding: 16px; }

.contact-default { background: white; border: 1px solid #e5e7eb; border-radius: 8px; }
.contact-card { background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-radius: 8px; }
.contact-minimal { background: transparent; border: 1px solid #e5e7eb; border-radius: 8px; }
.contact-floating { background: white; border: 1px solid #e5e7eb; border-radius: 8px; }

.newsletter-default { background: linear-gradient(to right, #2563eb, #7c3aed); color: white; border-radius: 8px; }
.newsletter-gradient { background: linear-gradient(to right, #6366f1, #8b5cf6, #ec4899); color: white; border-radius: 8px; }
.newsletter-minimal { background: #f9fafb; border: 1px solid #e5e7eb; color: #111827; border-radius: 8px; }
.newsletter-card { background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); color: #111827; border-radius: 8px; }
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

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; }
.container { max-width: 100%; margin: 0 auto; padding: 0 20px; }
.page { width: 100%; min-height: 100vh; position: relative; }

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

/* Responsive Design */
@media (max-width: 768px) {
  .container { padding: 0 16px; }
}

@media (max-width: 480px) {
  .container { padding: 0 12px; }
}

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
