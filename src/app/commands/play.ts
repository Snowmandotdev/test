import type { CommandData, ChatInputCommand, AutocompleteCommand } from "commandkit";
import { ApplicationCommandOptionType, GuildMember, MessageFlags } from "discord.js";
import { searchSurahs, getSurahById } from "../../data/surahs.js";
import { searchReciters, getReciterById, DEFAULT_RECITER } from "../../data/reciters.js";
import { playerManager } from "../../services/player-manager.js";
import { playingContainer, errorContainer } from "../../services/components.js";

export const command: CommandData = {
  name: "play",
  description: "Play a Quran surah in your voice channel / تشغيل سورة من القرآن الكريم",
  options: [
    {
      name: "surah",
      description: "Surah name or number / اسم السورة أو رقمها",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: "reciter",
      description: "Choose a reciter / اختر القارئ",
      type: ApplicationCommandOptionType.String,
      required: false,
      autocomplete: true,
    },
    {
      name: "volume",
      description: "Volume level 0-100 / مستوى الصوت",
      type: ApplicationCommandOptionType.Integer,
      required: false,
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

  const voiceChannel = member.voice.channel;
  if (!voiceChannel) {
    await interaction.reply({
      components: [errorContainer(t("errors.no_voice"), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  const surahInput = interaction.options.getString("surah", true);
  const reciterInput = interaction.options.getString("reciter", false);
  const volume = interaction.options.getInteger("volume", false) ?? undefined;

  const surahId = parseInt(surahInput, 10);
  const surah = !isNaN(surahId) ? getSurahById(surahId) : undefined;

  if (!surah) {
    await interaction.reply({
      components: [errorContainer(t("errors.surah_not_found", { input: surahInput }), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  let reciter = DEFAULT_RECITER;
  if (reciterInput) {
    const reciterId = parseInt(reciterInput, 10);
    const found = !isNaN(reciterId) ? getReciterById(reciterId) : undefined;
    if (found) {
      reciter = found;
    }
  }

  if (!reciter.surahList.includes(surah.id)) {
    await interaction.reply({
      components: [errorContainer(t("errors.reciter_no_surah", { reciter: reciter.name, surah: surah.name }), t)],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferReply();

  try {
    await playerManager.play(interaction.guild.id, voiceChannel, surah, reciter, volume);

    const state = playerManager.get(interaction.guild.id);
    const currentVolume = state?.player.volume ?? volume ?? 100;

    await interaction.editReply({
      components: [playingContainer(surah, reciter, currentVolume, t)],
      flags: MessageFlags.IsComponentsV2,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred.";
    await interaction.editReply({
      components: [errorContainer(t("errors.play_failed", { error: message }), t)],
      flags: MessageFlags.IsComponentsV2,
    });
  }
};

export const autocomplete: AutocompleteCommand = async ({ interaction }) => {
  const focused = interaction.options.getFocused(true);

  if (focused.name === "surah") {
    const results = searchSurahs(focused.value, 25);
    await interaction.respond(
      results.map((s) => ({
        name: `${s.id}. ${s.name} - ${s.englishName}`,
        value: s.id.toString(),
      })),
    );
  }

  if (focused.name === "reciter") {
    const results = searchReciters(focused.value, 25);
    await interaction.respond(
      results.map((r) => ({
        name: `${r.name} - ${r.englishName}`,
        value: r.id.toString(),
      })),
    );
  }
};
