import type { Client, ActivityType as ActivityTypeEnum } from "discord.js";
import { ActivityType } from "discord.js";

export default function ready(client: Client<true>): void {
  console.log(`[Quran Bot] Logged in as ${client.user.tag}`);
  console.log(`[Quran Bot] Serving ${client.guilds.cache.size} guild(s)`);

  client.user.setPresence({
    activities: [
      {
        name: "القرآن الكريم | /play",
        type: ActivityType.Listening as ActivityTypeEnum,
      },
    ],
    status: "online",
  });
}
