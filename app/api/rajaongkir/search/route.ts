import { NextRequest, NextResponse } from "next/server"
import { searchDomesticDestination } from "@/lib/rajaongkir"

// GET /api/rajaongkir/search?q=jakarta&limit=10
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const results = await searchDomesticDestination(query, limit, offset)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error in search API:', error)
    return NextResponse.json(
      { error: 'Failed to search destinations' },
      { status: 500 }
    )
  }
}
