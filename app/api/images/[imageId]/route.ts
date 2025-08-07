import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { imageId } = params

    // Get image from database
    const image = await prisma.image.findFirst({
      where: {
        id: imageId,
        project: {
          user: {
            email: session.user.email
          }
        }
      }
    })

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Return image with proper headers
    return new NextResponse(image.data, {
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": image.size.toString(),
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    })

  } catch (error) {
    console.error("Error serving image:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 