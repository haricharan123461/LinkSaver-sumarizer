import { supabase } from './supabase'
// import Database type from the correct location or define it below if missing
// import { Database } from '../types/supabase' // <-- Update this path as needed

// If you don't have a Database type, you can define a minimal version here for bookmarks:
type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: string
          user_id: string
          url: string
          title: string
          description: string
          favicon: string
          summary: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          url: string
          title: string
          description: string
          favicon: string
          summary: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
export type BookmarkInsert = Database['public']['Tables']['bookmarks']['Insert']

interface PageMetadata {
  title: string
  description: string
  favicon: string
  summary: string
}

export class BookmarkService {
  static async extractMetadata(url: string): Promise<PageMetadata> {
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname.replace('www.', '')
      const pathParts = urlObj.pathname.split('/').filter(Boolean)
      const lastPart = pathParts[pathParts.length - 1] || domain

      const title = lastPart
        .replace(/[-_]/g, ' ')
        .replace(/\.(html|php|aspx?)$/i, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || domain

      const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
      const summary = await this.generateSimpleSummary(url, domain)

      return {
        title: title.length > 100 ? title.slice(0, 100) + '...' : title,
        description: `Content from ${domain}`,
        favicon,
        summary,
      }
    } catch (error) {
      console.error('Error extracting metadata:', error)
      const domain = new URL(url).hostname.replace('www.', '')
      return {
        title: domain,
        description: `Content from ${domain}`,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        summary: 'Summary will be available soon.',
      }
    }
  }

  static async generateSimpleSummary(url: string, domain: string): Promise<string> {
    const fetchWithRetry = async (retries: number): Promise<string> => {
      try {
        const response = await fetch(
          'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://r.jina.ai/' + encodeURIComponent(url)),
          {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          }
        )
  
        if (response.ok) {
          const text = await response.text()
          const sentences = text
            .split(/[.!?]+/)
            .filter((s) => s.trim().length > 20)
          const summary = sentences.slice(0, 2).join('. ').trim()
          return summary.length > 200
            ? summary.substring(0, 200) + '...'
            : summary + '.'
        } else {
          throw new Error(`Jina AI responded with status ${response.status}`)
        }
      } catch (err) {
        console.warn(`Error occurred: ${typeof err === 'object' && err !== null && 'message' in err ? (err as { message: string }).message : String(err)}`)
        if (retries > 0) {
          console.log(`Retrying... (${retries} retries left)`)
          return await fetchWithRetry(retries - 1)
        } else {
          console.error('Final Jina AI error:', err)
          return `Bookmark saved from ${domain}. This link contains content that may be useful for future reference.`
        }
      }
    }
  
    // Skip summary generation for known unsupported links
    if (
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.endsWith('.pdf')
    ) {
      return `Bookmark saved from ${domain}. (No summary available)`
    }
  
    return await fetchWithRetry(2)
  }
  
  static async saveBookmark(url: string, userId: string): Promise<Bookmark> {
    try {
      new URL(url)
    } catch {
      throw new Error('Invalid URL format')
    }

    const metadata = await this.extractMetadata(url)

    const bookmarkData: BookmarkInsert = {
      user_id: userId,
      url,
      title: metadata.title,
      description: metadata.description,
      favicon: metadata.favicon,
      summary: metadata.summary,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert(bookmarkData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getBookmarks(userId: string): Promise<Bookmark[]> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async deleteBookmark(id: string): Promise<void> {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) throw error
  }
}
