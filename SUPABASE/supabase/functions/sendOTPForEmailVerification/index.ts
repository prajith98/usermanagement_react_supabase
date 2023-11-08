import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
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
    // Sign in with OTP (One-Time Password) using the provided email.
    const { data, error } = await supabaseClient.auth.signInWithOtp(
      {
        email,
      });

    if (error) {
      // If there's an error, return a response with an error message and a status of 400.
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
   else {
      // return a response indicating that an OTP (One-Time Password) has been sent to the user.
      return new Response(JSON.stringify({ 'Status': 'OTP Sent' }), {
        headers: {  ...corsHeaders,'Content-Type': 'application/json' },
        status: 200,
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
