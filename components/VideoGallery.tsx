'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import VideoPlayer from './VideoPlayer'

const allVideos = [
  { video: "/assets/video/rainbow rare cheesecake.mp4", title: "Rainbow Rare Cheesecake", category: "Cheesecake", color: "bg-blue-500" },
  { video: "/assets/video/moka hopyes roll cake.mp4", title: "Moka Hopyes Roll Cake", category: "Roll Cake", color: "bg-amber-500" },
  { video: "/assets/video/Rainbow - Roti Sobek.mp4", title: "Roti Sobek Rainbow", category: "Roti", color: "bg-orange-500" },
  { video: "/assets/video/tiramisu cake.mp4", title: "Tiramisu Cake", category: "Cake", color: "bg-amber-600" },
  { video: "/assets/video/brownies red velvet.mp4", title: "Brownies Red Velvet", category: "Brownies", color: "bg-red-600" },
  { video: "/assets/video/pandan layer cake.mp4", title: "Pandan Layer Cake", category: "Cake", color: "bg-green-600" },
  { video: "/assets/video/kue mangkok gula aren.mp4", title: "Kue Mangkok Gula Aren", category: "Kue Tradisional", color: "bg-yellow-600" },
  { video: "/assets/video/thai milky bun gula aren.mp4", title: "Thai Milky Bun", category: "Roti", color: "bg-orange-500" },
  { video: "/assets/video/burn cheese cake.mp4", title: "Burnt Cheese Cake", category: "Cheesecake", color: "bg-blue-500" },
]

export default function VideoGallery() {
  const [showAll, setShowAll] = useState(false)
  const displayedVideos = showAll ? allVideos : allVideos.slice(0, 8)

  return (
    <>
      {/* Video Gallery - Grid 4 Columns x 2 Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {displayedVideos.map((item, i) => (
          <div key={i}>
            <VideoPlayer 
              src={item.video}
              title={item.title}
              category={item.category}
              color={item.color}
            />
          </div>
        ))}
      </div>

      {/* CTA - Show All Videos or Shop */}
      <div className="text-center mt-12">
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {allVideos.length > 8 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {showAll ? (
                <>
                  Tampilkan Lebih Sedikit <ChevronUp className="w-5 h-5" />
                </>
              ) : (
                <>
                  Lihat Semua Video<ChevronDown className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
