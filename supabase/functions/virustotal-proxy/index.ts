import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const VIRUSTOTAL_API_KEY = Deno.env.get('VIRUSTOTAL_API_KEY')
const API_URL = 'https://www.virustotal.com/api/v3'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Ensure the API key is set
  if (!VIRUSTOTAL_API_KEY) {
    return new Response(JSON.stringify({ error: 'VIRUSTOTAL_API_KEY is not set.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  try {
    const { url, hash } = await req.json()
    let endpoint = ''
    let options = {}

    if (url) {
      // URL Scan
      endpoint = `${API_URL}/urls`
      options = {
        method: 'POST',
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${encodeURIComponent(url)}`,
      }
    } else if (hash) {
      // File Hash Scan
      endpoint = `${API_URL}/files/${hash}`
      options = {
        method: 'GET',
        headers: { 'x-apikey': VIRUSTOTAL_API_KEY },
      }
    } else {
      throw new Error('A URL or file hash must be provided.')
    }

    const vtResponse = await fetch(endpoint, options)
    const data = await vtResponse.json()

    // Handle case where VirusTotal has not seen the file before (404 Not Found)
    if (vtResponse.status === 404 && data.error?.code === 'NotFoundError') {
      return new Response(JSON.stringify({ 
        data: { 
          attributes: { 
            last_analysis_stats: {
              malicious: 0,
              suspicious: 0,
              undetected: 0,
              harmless: 0,
            },
            custom_status: 'not_found' 
          } 
        } 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, 
      })
    }

    if (!vtResponse.ok) {
      throw new Error(data.error?.message || 'VirusTotal API request failed.')
    }

    // For URL scans, the result is nested under an analysis ID. 
    if (url && data.data?.id) {
      const analysisId = data.data.id
      // Wait a moment for the analysis to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      const analysisResponse = await fetch(`${API_URL}/analyses/${analysisId}`, {
        headers: { 'x-apikey': VIRUSTOTAL_API_KEY },
      })
      const analysisData = await analysisResponse.json()
      return new Response(JSON.stringify(analysisData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
