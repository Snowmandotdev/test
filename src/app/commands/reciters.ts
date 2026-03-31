import type { CommandData, ChatInputCommand } from "commandkit";
import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
import { getAllReciters } from "../../data/reciters.js";
import { recitersContainer } from "../../services/components.js";

const RECITERS_PER_PAGE = 5;

export const command: CommandData = {
  name: "reciters",
  description: "List available reciters / عرض قائمة القراء المتاحين",
  options: [
    {
      name: "page",
      description: "Page number / رقم الصفحة",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      min_value: 1,
    },
  ],
};

export const chatInput: ChatInputCommand = async (ctx) => {
  const { interaction } = ctx;
  const { t } = ctx.locale();

  const reciters = getAllReciters();
  const totalPages = Math.ceil(reciters.length / RECITERS_PER_PAGE);
  const page = Math.min(interaction.options.getInteger("page", false) ?? 1, totalPages);

  const start = (page - 1) * RECITERS_PER_PAGE;
  const end = start + RECITERS_PER_PAGE;
  const pageReciters = reciters.slice(start, end);

  await interaction.reply({
    components: [recitersContainer(pageReciters, page, totalPages, t)],
    flags: MessageFlags.IsComponentsV2,
  });
};
