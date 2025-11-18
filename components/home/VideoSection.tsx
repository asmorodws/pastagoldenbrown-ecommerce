import VideoGallery from "@/components/VideoGallery"

export default function VideoSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Video</h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Pelajari cara membuat berbagai kreasi lezat dengan pasta Golden Brown
          </p>
        </div>

        <VideoGallery />
      </div>
    </section>
  )
}
