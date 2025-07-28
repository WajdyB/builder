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
      return `<div class="component-${component.id} text-component" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Text Element"}</div>`

    case "button":
      return `<button class="component-${component.id} button-component" style="${style} ${getPropertiesStyle(properties)}">${properties.text || "Button"}</button>`

    case "image":
      return `<img class="component-${component.id} image-component" src="${properties.src || "/placeholder.svg"}" alt="${properties.alt || "Image"}" style="${style} ${getPropertiesStyle(properties)}" />`

    case "divider":
      return `<hr class="component-${component.id} divider-component" style="${style} ${getPropertiesStyle(properties)}" />`

    case "section":
      return `<section class="component-${component.id} section-component" style="${style} ${getPropertiesStyle(properties)}">
        <div class="section-content">Section Container</div>
      </section>`

    case "input":
      return `<input class="component-${component.id} input-component" type="${properties.inputType || "text"}" placeholder="${properties.placeholder || "Input field"}" style="${style} ${getPropertiesStyle(properties)}" />`

    case "textarea":
      return `<textarea class="component-${component.id} textarea-component" placeholder="${properties.placeholder || "Textarea"}" rows="${properties.rows || 3}" style="${style} ${getPropertiesStyle(properties)}"></textarea>`

    case "checkbox":
      return `<label class="component-${component.id} checkbox-component" style="${style} ${getPropertiesStyle(properties)}">
        <input type="checkbox" />
        <span>${properties.label || "Checkbox"}</span>
      </label>`

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
/* Component Styles */
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
