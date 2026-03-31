import type { CommandData, ChatInputCommand } from "commandkit";
import { ApplicationCommandOptionType, GuildMember, MessageFlags } from "discord.js";
import { playerManager } from "../../services/player-manager.js";
import { volumeContainer, errorContainer } from "../../services/components.js";

export const command: CommandData = {
  name: "volume",
  description: "Set the playback volume / ضبط مستوى الصوت",
  options: [
    {
      name: "level",
      description: "Volume level (0-100) / مستوى الصوت",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      min_value: 0,
      max_value: 100,
    },
  ],
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

  const level = interaction.options.getInteger("level", true);
  const success = playerManager.setVolume(interaction.guild.id, level);

  if (!success) {
    await interaction.reply({
      components: [errorContainer(t("errors.nothing_playing"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.reply({
    components: [volumeContainer(level, t)],
    flags: MessageFlags.IsComponentsV2,
  });
};
