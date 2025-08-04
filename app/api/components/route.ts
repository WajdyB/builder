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

    const { type, properties, position, pageId, parentId } = await request.json()

    if (!type || !properties || !position || !pageId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify page ownership
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        project: {
          userId: session.user.id,
        },
      },
    })

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    const component = await prisma.component.create({
      data: {
        type,
        properties,
        pageId,
        parentId,
        x: properties?.x ?? 0,
        y: properties?.y ?? 0,
        width: properties?.width ?? 100,
        height: properties?.height ?? 100,
      },
    })

    return NextResponse.json(component)
  } catch (error) {
    console.error("Error creating component:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
