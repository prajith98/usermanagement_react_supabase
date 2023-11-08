import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    console.log("from here");
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } }}
    )
    console.log("Client Created!");

    // Parse the JSON data from the request body to get the email.
    const { email } = await req.json();

    // Query the 'USERS' table in Supabase to check if the provided email exists.
    const { data: usersData, error } = await supabaseClient.from('USER').select('emailID').eq('emailID', email);
      
    if (error) {
      // If there's an error, return a response with an error message and a status of 400.
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (usersData[0]) {
      // If the user with the provided email exists, return a response indicating it's a 'Paid User'.
      return new Response(JSON.stringify({ 'Status': 'Paid User' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      // If the user with the provided email doesn't exist, return a response indicating it's an 'Unknown User'.
      return new Response(JSON.stringify({ 'Status': 'Unknown User' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

  } catch (error) {
    // If there's an unhandled error, return a response with an error message and a status of 400.
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
