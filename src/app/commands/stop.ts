import type { CommandData, ChatInputCommand } from "commandkit";
import { GuildMember, MessageFlags } from "discord.js";
import { playerManager } from "../../services/player-manager.js";
import { stoppedContainer, errorContainer } from "../../services/components.js";

export const command: CommandData = {
  name: "stop",
  description: "Stop playback and leave the voice channel / إيقاف التشغيل ومغادرة القناة الصوتية",
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

  const stopped = playerManager.stop(interaction.guild.id);

  if (!stopped) {
    await interaction.reply({
      components: [errorContainer(t("errors.nothing_playing"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.reply({
    components: [stoppedContainer(t)],
    flags: MessageFlags.IsComponentsV2,
  });
};
