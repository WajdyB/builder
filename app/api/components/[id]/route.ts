import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { properties, x, y, width, height, zIndex } = await request.json()

    // Verify component ownership
    const component = await prisma.component.findFirst({
      where: {
        id: params.id,
        page: {
          project: {
            userId: session.user.id,
          },
        },
      },
    })

    if (!component) {
      return NextResponse.json({ error: "Component not found" }, { status: 404 })
    }

    const updatedComponent = await prisma.component.update({
      where: { id: params.id },
      data: {
        properties: properties || component.properties,
        x: x !== undefined ? x : component.x,
        y: y !== undefined ? y : component.y,
        width: width || component.width,
        height: height || component.height,
        zIndex: zIndex !== undefined ? zIndex : component.zIndex,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedComponent)
  } catch (error) {
    console.error("Error updating component:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify component ownership
    const component = await prisma.component.findFirst({
      where: {
        id: params.id,
        page: {
          project: {
            userId: session.user.id,
          },
        },
      },
    })

    if (!component) {
      return NextResponse.json({ error: "Component not found" }, { status: 404 })
    }

    await prisma.component.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting component:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
