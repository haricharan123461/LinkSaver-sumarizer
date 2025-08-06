import React from 'react'
import { Trash2, ExternalLink, Globe } from 'lucide-react'
import type { Bookmark } from '../services/bookmarks'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {bookmark.favicon ? (
              <img
                src={bookmark.favicon}
                alt="Site favicon"
                className="w-6 h-6 rounded-sm flex-shrink-0"
                onError={handleImageError}
              />
            ) : (
              <Globe className="w-6 h-6 text-gray-400 flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                {bookmark.title || 'Untitled'}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {new URL(bookmark.url).hostname}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => window.open(bookmark.url, '_blank')}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Open link"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(bookmark.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete bookmark"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {bookmark.description && (
        <div className="px-4 pb-2">
          <p className="text-sm text-gray-600 line-clamp-2">
            {bookmark.description}
          </p>
        </div>
      )}

      {/* AI Summary */}
      {bookmark.summary && (
        <div className="px-4 pb-3">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-md p-3 border-l-3 border-blue-400">
            <h4 className="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              AI Summary
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {bookmark.summary}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Saved {formatDate(bookmark.created_at)}
        </p>
      </div>
    </div>
  )
}