import type { CommandData, ChatInputCommand } from "commandkit";
import { GuildMember, MessageFlags } from "discord.js";
import { playerManager } from "../../services/player-manager.js";
import { loopContainer, errorContainer } from "../../services/components.js";

export const command: CommandData = {
  name: "loop",
  description: "Toggle loop mode for the current surah / تفعيل/تعطيل تكرار السورة",
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

  if (!state) {
    await interaction.reply({
      components: [errorContainer(t("errors.nothing_playing"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  const newLoop = !state.player.loop;
  playerManager.setLoop(interaction.guild.id, newLoop);

  await interaction.reply({
    components: [loopContainer(newLoop, t)],
    flags: MessageFlags.IsComponentsV2,
  });
};
