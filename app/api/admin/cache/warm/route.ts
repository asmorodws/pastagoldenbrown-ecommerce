import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { 
  warmEssentialCache, 
  warmOriginCache,
  warmPopularCities,
  warmPopularSearches 
} from '@/lib/rajaongkir-cache-warmer'

/**
 * API Endpoint untuk warming RajaOngkir cache
 * 
 * POST /api/admin/cache/warm
 * 
 * Query params:
 * - type: 'all' | 'popular' | 'searches' | 'origin'
 * - origin_city_id: number (required jika type='origin')
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check - hanya admin yang bisa warm cache
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'
    const originCityId = searchParams.get('origin_city_id')

    console.log(`[Cache Warm] Request from admin: ${session.user.email}, type: ${type}`)

    let message = ''
    const startTime = Date.now()

    switch (type) {
      case 'all':
        await warmEssentialCache()
        message = 'All essential cache warmed successfully'
        break

      case 'popular':
        await warmPopularCities()
        message = 'Popular cities cache warmed successfully'
        break

      case 'searches':
        await warmPopularSearches()
        message = 'Popular searches cache warmed successfully'
        break

      case 'origin':
        if (!originCityId) {
          return NextResponse.json(
            { error: 'origin_city_id is required for type=origin' },
            { status: 400 }
          )
        }
        await warmOriginCache(parseInt(originCityId))
        message = `Origin cache warmed for city ID: ${originCityId}`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: all, popular, searches, or origin' },
          { status: 400 }
        )
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      message,
      duration_ms: duration,
      type,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Cache Warm] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to warm cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint untuk check cache status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    
    // Get cache statistics
    const totalEntries = await prisma.apiCache.count()
    
    const cacheByEndpoint = await prisma.apiCache.groupBy({
      by: ['endpoint'],
      _count: {
        endpoint: true
      },
      orderBy: {
        _count: {
          endpoint: 'desc'
        }
      }
    })

    const recentCache = await prisma.apiCache.findMany({
      select: {
        endpoint: true,
        updatedAt: true,
        ttl: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json({
      success: true,
      statistics: {
        total_entries: totalEntries,
        by_endpoint: cacheByEndpoint.map(item => ({
          endpoint: item.endpoint,
          count: item._count.endpoint
        })),
        recent_cache: recentCache.map(item => ({
          endpoint: item.endpoint,
          updated_at: item.updatedAt,
          ttl_seconds: item.ttl,
          age_seconds: Math.floor((Date.now() - item.updatedAt.getTime()) / 1000)
        }))
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Cache Status] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get cache status' },
      { status: 500 }
    )
  }
}
