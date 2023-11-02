import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ziftjprnoezvauotceqp.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZnRqcHJub2V6dmF1b3RjZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1NTExMDYsImV4cCI6MjAxMzEyNzEwNn0.tfELCWtR-xPJ0QBCPw9rLhp-9nIxF5Ql5-fSe5JJQAc'; // Replace with your Supabase API key

export const supabase = createClient(supabaseUrl, supabaseKey)