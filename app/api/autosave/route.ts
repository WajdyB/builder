import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, pageId, components } = await request.json()

    if (!projectId || !pageId || !components) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Delete existing components for this page
    await prisma.component.deleteMany({
      where: { pageId },
    })

    // Create new components
    if (components.length > 0) {
      await prisma.component.createMany({
        data: components.map((component: any) => ({
          id: component.id,
          type: component.type,
          properties: component.properties,
          x: component.properties.x || 0,
          y: component.properties.y || 0,
          width: String(component.properties.width || "auto"),
          height: String(component.properties.height || "auto"),
          zIndex: component.properties.zIndex || 0,
          pageId,
          parentId: component.parentId || null,
        })),
      })
    }

    // Update project timestamp
    await prisma.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error autosaving:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
