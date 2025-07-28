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

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Verify page ownership through project
    const page = await prisma.page.findFirst({
      where: {
        id: params.id,
        project: {
          userId: session.user.id,
        },
      },
    })

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    const updatedPage = await prisma.page.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedPage)
  } catch (error) {
    console.error("Error updating page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify page ownership and ensure it's not the home page
    const page = await prisma.page.findFirst({
      where: {
        id: params.id,
        project: {
          userId: session.user.id,
        },
      },
    })

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    if (page.isHomePage) {
      return NextResponse.json({ error: "Cannot delete home page" }, { status: 400 })
    }

    await prisma.page.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
