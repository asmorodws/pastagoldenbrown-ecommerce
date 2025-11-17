import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

/**
 * API Endpoint untuk clear old cache entries
 * 
 * POST /api/admin/cache/clear
 * 
 * Query params:
 * - days: number (default: 60) - hapus cache lebih lama dari X hari
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check - hanya admin
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '60')

    console.log(`[Cache Clear] Clearing cache older than ${days} days`)

    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const result = await prisma.apiCache.deleteMany({
      where: {
        updatedAt: {
          lt: cutoffDate
        }
      }
    })

    console.log(`[Cache Clear] Deleted ${result.count} old cache entries`)

    return NextResponse.json({
      success: true,
      deleted_count: result.count,
      cutoff_date: cutoffDate.toISOString(),
      message: `Cleared ${result.count} cache entries older than ${days} days`
    })

  } catch (error) {
    console.error('[Cache Clear] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to clear cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
