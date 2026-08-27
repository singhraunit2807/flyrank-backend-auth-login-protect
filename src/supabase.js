const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseKey } = require('./config');

const createSupabaseClient = (accessToken) => {
  const options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  };

  if (accessToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  return createClient(supabaseUrl, supabaseKey, options);
};

module.exports = { createSupabaseClient };
