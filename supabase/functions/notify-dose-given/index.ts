import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { family_id, given_by, animal_name, medication_name } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get all family members except the giver
  const { data: members } = await supabase
    .from('family_member')
    .select('user_id')
    .eq('family_id', family_id)
    .neq('user_id', given_by)

  if (!members?.length) return new Response('no members', { status: 200 })

  // Get their push tokens
  const userIds = members.map(m => m.user_id)
  const { data: tokens } = await supabase
    .from('push_tokens')
    .select('token')
    .in('user_id', userIds)
console.log(`[DEBUG] Found ${members?.length || 0} family members. User IDs: ${userIds}`);
console.log(`[DEBUG] Found ${tokens?.length || 0} active push tokens.`);

  if (!tokens?.length) {
    console.log('[DEBUG] Exiting early: No tokens found to send notifications to.');
    return new Response('no tokens', { status: 200 })
  }
  console.log(`[DEBUG] Sending ${messages.length} push notifications via Expo...`);

  // Send push notifications via Expo
  const messages = tokens.map(({ token }) => ({
    to: token,
    title: '✅ Medication given',
    body: `${animal_name} was given ${medication_name}`,
  }))

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  })

  return new Response('ok', { status: 200 })
})
