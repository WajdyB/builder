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

    const { name, projectId } = await request.json()

    if (!name || !projectId) {
      return NextResponse.json({ error: "Name and projectId are required" }, { status: 400 })
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

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    const page = await prisma.page.create({
      data: {
        name,
        slug,
        projectId,
      },
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
