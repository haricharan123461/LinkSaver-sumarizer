import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExtractRequest {
  url: string
}

interface PageMetadata {
  title: string
  description: string
  favicon: string
  summary: string
}

async function extractMetadata(url: string): Promise<Omit<PageMetadata, 'summary'>> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkSaver/1.0)',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const html = await response.text()
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
                      html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i)
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled'
    
    // Extract description
    const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i) ||
                     html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)
    const description = descMatch ? descMatch[1].trim() : ''
    
    // Extract favicon
    const faviconMatch = html.match(/<link[^>]*rel="(?:icon|shortcut icon)"[^>]*href="([^"]*)"[^>]*>/i)
    let favicon = faviconMatch ? faviconMatch[1] : '/favicon.ico'
    
    // Make favicon URL absolute
    if (favicon && !favicon.startsWith('http')) {
      const baseUrl = new URL(url).origin
      favicon = favicon.startsWith('/') ? `${baseUrl}${favicon}` : `${baseUrl}/${favicon}`
    }
    
    return {
      title,
      description,
      favicon: favicon || ''
    }
  } catch (error) {
    console.error('Error extracting metadata:', error)
    return {
      title: 'Untitled',
      description: '',
      favicon: ''
    }
  }
}

async function generateSummary(url: string): Promise<string> {
  try {
    const jinaApiKey = Deno.env.get('JINA_API_KEY')
    if (!jinaApiKey) {
      return 'Summary unavailable - API key not configured'
    }

    const response = await fetch('https://r.jina.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jinaApiKey}`,
      },
      body: JSON.stringify({
        url: url,
        target_length: 150
      })
    })

    if (!response.ok) {
      console.error(`Jina API error: ${response.status}`)
      return 'Summary unavailable'
    }

    const data = await response.json()
    return data.data?.content || 'No summary available'
  } catch (error) {
    console.error('Error generating summary:', error)
    return 'Summary unavailable'
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url }: ExtractRequest = await req.json()
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract metadata and generate summary in parallel
    const [metadata, summary] = await Promise.all([
      extractMetadata(url),
      generateSummary(url)
    ])

    const result: PageMetadata = {
      ...metadata,
      summary
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in extract-metadata function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})