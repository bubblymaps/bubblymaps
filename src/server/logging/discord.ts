import { env } from '@/env';

export async function log(content: any) {
  if (!env.DISCORD_WEBHOOK_URL) return;

  try {
    await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
  } catch (e) {
    console.error('Failed to log to Discord', e);
  }
}

export async function logToDiscord(action: string, details: string, user: any) {
  if (!env.DISCORD_WEBHOOK_URL) return;

  try {
    const content = {
      embeds: [
        {
          title: `Moderation Action: ${action}`,
          description: details,
          color: 16711680,
          footer: {
            text: `Action performed by @${user.handle} (ID: ${user.id})`,
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await log(content);
  } catch (err) {
    console.error(err);
  }
}