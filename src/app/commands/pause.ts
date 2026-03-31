import type { CommandData, ChatInputCommand } from "commandkit";
import { GuildMember, MessageFlags } from "discord.js";
import { playerManager } from "../../services/player-manager.js";
import { pausedContainer, errorContainer } from "../../services/components.js";

export const command: CommandData = {
  name: "pause",
  description: "Pause the current playback / إيقاف مؤقت للتشغيل",
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

  const member = interaction.member;
  if (!(member instanceof GuildMember)) {
    await interaction.reply({
      components: [errorContainer(t("errors.no_member"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  if (!member.voice.channel) {
    await interaction.reply({
      components: [errorContainer(t("errors.no_voice"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  const paused = playerManager.pause(interaction.guild.id);

  if (!paused) {
    await interaction.reply({
      components: [errorContainer(t("errors.nothing_playing"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.reply({
    components: [pausedContainer(t)],
    flags: MessageFlags.IsComponentsV2,
  });
};
