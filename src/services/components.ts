import {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
} from "discord.js";
import type { Surah } from "../data/surahs.js";
import type { Reciter } from "../data/reciters.js";

const QURAN_COLOR = 0x1b7a43;
const ERROR_COLOR = 0xe74c3c;
const INFO_COLOR = 0x3498db;
const WARN_COLOR = 0xf39c12;
const SUCCESS_COLOR = 0x2ecc71;

function separator(): SeparatorBuilder {
  return new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small);
}

export function playingContainer(
  surah: Surah,
  reciter: Reciter,
  volume: number,
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(QURAN_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("playing.title")}\n` +
        `**${surah.name}** - ${surah.englishName}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `> ${t("playing.reciter")}: **${reciter.name}** (${reciter.englishName})\n` +
        `> ${t("playing.surah")}: **#${surah.id}** - ${surah.verses} ${t("playing.verses")}\n` +
        `> ${t("playing.volume")}: **${volume}%**\n` +
        `> ${t("playing.type")}: **${surah.type === "meccan" ? t("playing.meccan") : t("playing.medinan")}**`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `-# ${t("common.footer")}`,
      ),
    );
}

export function stoppedContainer(
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(WARN_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("stopped.title")}\n${t("stopped.description")}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${t("common.footer")}`),
    );
}

export function pausedContainer(
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(WARN_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("paused.title")}\n${t("paused.description")}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${t("common.footer")}`),
    );
}

export function resumedContainer(
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(SUCCESS_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("resumed.title")}\n${t("resumed.description")}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${t("common.footer")}`),
    );
}

export function volumeContainer(
  volume: number,
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(INFO_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("volume.title")}\n${t("volume.set", { volume })}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${t("common.footer")}`),
    );
}

export function nowPlayingContainer(
  surah: Surah,
  reciter: Reciter,
  volume: number,
  statusText: string,
  playbackDuration: number,
  loopEnabled: boolean,
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  const durationSeconds = Math.round(playbackDuration / 1000);
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const durationStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return new ContainerBuilder()
    .setAccentColor(QURAN_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("nowplaying.title")}\n` +
        `**${surah.name}** - ${surah.englishName}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `> ${t("nowplaying.reciter")}: **${reciter.name}** (${reciter.englishName})\n` +
        `> ${t("nowplaying.surah")}: **#${surah.id}** - ${surah.verses} ${t("nowplaying.verses")}\n` +
        `> ${t("nowplaying.volume")}: **${volume}%**\n` +
        `> ${t("nowplaying.status")}: **${statusText}**\n` +
        `> ${t("nowplaying.duration")}: **${durationStr}**\n` +
        `> ${t("nowplaying.loop")}: **${loopEnabled ? t("nowplaying.loop_on") : t("nowplaying.loop_off")}**`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${t("common.footer")}`),
    );
}

export function recitersContainer(
  reciters: readonly { name: string; englishName: string; id: number }[],
  page: number,
  totalPages: number,
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  const list = reciters
    .map((r, i) => `**${(page - 1) * 5 + i + 1}.** ${r.name} - ${r.englishName}`)
    .join("\n");

  return new ContainerBuilder()
    .setAccentColor(INFO_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("reciters.title")}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(list || t("reciters.empty")),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `-# ${t("reciters.page", { page, totalPages })} | ${t("common.footer")}`,
      ),
    );
}

export function errorContainer(
  message: string,
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(ERROR_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("common.error_title")}\n${message}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${t("common.footer")}`),
    );
}

export function infoContainer(
  title: string,
  description: string,
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(INFO_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${title}\n${description}`),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${t("common.footer")}`),
    );
}

export function autoplayContainer(
  enabled: boolean,
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(enabled ? SUCCESS_COLOR : WARN_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("autoplay.title")}\n` +
        `${enabled ? t("autoplay.enabled") : t("autoplay.disabled")}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${t("common.footer")}`),
    );
}

export function loopContainer(
  enabled: boolean,
  t: (key: string, options?: Record<string, unknown>) => string,
): ContainerBuilder {
  return new ContainerBuilder()
    .setAccentColor(enabled ? SUCCESS_COLOR : WARN_COLOR)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## ${t("loop.title")}\n` +
        `${enabled ? t("loop.enabled") : t("loop.disabled")}`,
      ),
    )
    .addSeparatorComponents(separator())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${t("common.footer")}`),
    );
}
