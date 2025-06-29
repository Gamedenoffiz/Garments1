import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Parse the webhook payload
    const { type, table, record, old_record } = await req.json()

    // Only handle INSERT events on auth.users table
    if (type === 'INSERT' && table === 'users') {
      console.log('New user created:', record.id)

      // Extract user metadata
      const firstName = record.raw_user_meta_data?.first_name || ''
      const lastName = record.raw_user_meta_data?.last_name || ''

      // Create user profile
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: record.id,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error creating user profile:', error)
        throw error
      }

      console.log('User profile created successfully:', data)

      return new Response(
        JSON.stringify({ success: true, message: 'User profile created' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // For other events, just return success
    return new Response(
      JSON.stringify({ success: true, message: 'Event processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in handle-new-user function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})