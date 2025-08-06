import { useState, useEffect } from 'react'
import { Search, Grid, List } from 'lucide-react'
import Header from '../components/Header'
import BookmarkCard from '../components/BookmarkCard'
import AddBookmarkModal from '../components/AddBookmarkModal'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import { BookmarkService, type Bookmark } from '../services/bookmarks'
import { AuthService } from '../services/auth'
import type { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    // Get current user and load bookmarks
    const initializeData = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          await loadBookmarks(currentUser.id)
        }
      } catch (error) {
        console.error('Error initializing data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  useEffect(() => {
    // Filter bookmarks based on search query
    if (searchQuery.trim() === '') {
      setFilteredBookmarks(bookmarks)
    } else {
      const filtered = bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredBookmarks(filtered)
    }
  }, [bookmarks, searchQuery])

  const loadBookmarks = async (userId: string) => {
    try {
      const userBookmarks = await BookmarkService.getBookmarks(userId)
      setBookmarks(userBookmarks)
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    }
  }

  const handleAddBookmark = async (url: string) => {
    if (!user) return

    try {
      const newBookmark = await BookmarkService.saveBookmark(url, user.id)
      setBookmarks(prev => [newBookmark, ...prev])
    } catch (error) {
      throw error
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      await BookmarkService.deleteBookmark(id)
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id))
    } catch (error) {
      console.error('Error deleting bookmark:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner message="Loading your bookmarks..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userEmail={user?.email} 
        onAddBookmark={() => setIsModalOpen(true)} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookmarks.length > 0 ? (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {searchQuery 
                  ? `${filteredBookmarks.length} result${filteredBookmarks.length !== 1 ? 's' : ''} for "${searchQuery}"`
                  : `${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''} saved`
                }
              </p>
            </div>

            {/* Bookmarks Grid */}
            {filteredBookmarks.length > 0 ? (
              <div className={`gap-6 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'space-y-4'
              }`}>
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={handleDeleteBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            )}
          </>
        ) : (
          <EmptyState onAddBookmark={() => setIsModalOpen(true)} />
        )}
      </main>

      {/* Add Bookmark Modal */}
      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddBookmark}
      />
    </div>
  )
}