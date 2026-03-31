import type { CommandData, ChatInputCommand } from "commandkit";
import { MessageFlags } from "discord.js";
import { playerManager } from "../../services/player-manager.js";
import { nowPlayingContainer, errorContainer } from "../../services/components.js";

export const command: CommandData = {
  name: "nowplaying",
  description: "Show what is currently playing / عرض ما يتم تشغيله حالياً",
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const { interaction } = ctx;
  const { t } = ctx.locale();

  if (!interaction.guild) {
    await interaction.reply({
      components: [errorContainer(t("errors.guild_only"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  const state = playerManager.get(interaction.guild.id);

  if (!state || !state.currentSurah) {
    await interaction.reply({
      components: [errorContainer(t("errors.nothing_playing"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  const statusKey = `nowplaying.status_${state.player.status}` as const;
  const statusText = t(statusKey);
  const playbackDuration = playerManager.getPlaybackDuration(interaction.guild.id);
  const loopEnabled = state.player.loop;

  await interaction.reply({
    components: [
      nowPlayingContainer(
        state.currentSurah,
        state.currentReciter,
        state.player.volume,
        statusText,
        playbackDuration,
        loopEnabled,
        t,
      ),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
};
