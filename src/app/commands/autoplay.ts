import type { CommandData, ChatInputCommand } from "commandkit";
import { GuildMember, MessageFlags } from "discord.js";
import { playerManager } from "../../services/player-manager.js";
import { autoplayContainer, errorContainer } from "../../services/components.js";

export const command: CommandData = {
  name: "autoplay",
  description: "Toggle 24/7 autoplay mode / تفعيل/تعطيل وضع التشغيل التلقائي",
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

  const state = playerManager.get(interaction.guild.id);

  if (!state || !state.currentSurah) {
    await interaction.reply({
      components: [errorContainer(t("errors.nothing_playing"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  const newAutoplay = !state.autoplay;
  playerManager.setAutoplay(interaction.guild.id, newAutoplay);

  await interaction.reply({
    components: [autoplayContainer(newAutoplay, t)],
    flags: MessageFlags.IsComponentsV2,
  });
};
