import { Bookmark, Plus, Sparkles } from 'lucide-react'

interface EmptyStateProps {
  onAddBookmark: () => void
}

export default function EmptyState({ onAddBookmark }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto">
            <Bookmark className="w-12 h-12 text-blue-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Start Your Collection
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Save any webpage and get instant AI-powered summaries. 
          Your bookmarks will appear here with intelligent insights.
        </p>

        {/* CTA */}
        <button
          onClick={onAddBookmark}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Your First Bookmark
        </button>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-semibold">AI</span>
            </div>
            <p className="text-gray-600">Smart summaries and metadata</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-teal-600 font-semibold">⚡</span>
            </div>
            <p className="text-gray-600">Instant metadata extraction</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 font-semibold">🔒</span>
            </div>
            <p className="text-gray-600">Secure & private collection</p>
          </div>
        </div>
      </div>
    </div>
  )
}