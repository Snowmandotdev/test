import type { CommandData, ChatInputCommand } from "commandkit";
import { GuildMember, MessageFlags } from "discord.js";
import { playerManager } from "../../services/player-manager.js";
import { resumedContainer, errorContainer } from "../../services/components.js";

export const command: CommandData = {
  name: "resume",
  description: "Resume paused playback / استئناف التشغيل",
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

  const resumed = playerManager.resume(interaction.guild.id);

  if (!resumed) {
    await interaction.reply({
      components: [errorContainer(t("errors.nothing_paused"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.reply({
    components: [resumedContainer(t)],
    flags: MessageFlags.IsComponentsV2,
  });
};
