import { RadioPlayer, PlayerStatus } from "discord-radio";
import type { VoiceBasedChannel } from "discord.js";
import { buildAudioUrl, DEFAULT_RECITER, type Reciter } from "../data/reciters.js";
import { SURAHS, type Surah } from "../data/surahs.js";

export interface GuildPlayerState {
  player: RadioPlayer;
  currentSurah: Surah | null;
  currentReciter: Reciter;
  autoplay: boolean;
}

/**
 * Manages RadioPlayer instances per guild.
 * Ensures one player per guild and tracks current surah/reciter state.
 * Supports 24/7 autoplay mode with automatic surah switching.
 */
class PlayerManager {
  private readonly players = new Map<string, GuildPlayerState>();

  /**
   * Gets or creates a player state for a guild.
   */
  public getOrCreate(guildId: string): GuildPlayerState {
    let state = this.players.get(guildId);
    if (!state) {
      const player = new RadioPlayer({
        defaultVolume: 100,
        autoLeave: false,
        selfDeaf: true,
        loop: false,
        ffmpeg: {
          path: "ffmpeg",
        },
      });

      player.on("error", (error) => {
        console.error(`[PlayerManager] Guild ${guildId} error:`, error.message);
      });

      player.on("finish", () => {
        this.handleFinish(guildId);
      });

      player.on("disconnect", () => {
        this.cleanup(guildId);
      });

      state = {
        player,
        currentSurah: null,
        currentReciter: DEFAULT_RECITER,
        autoplay: false,
      };
      this.players.set(guildId, state);
    }
    return state;
  }

  /**
   * Gets the existing player state for a guild, or null.
   */
  public get(guildId: string): GuildPlayerState | null {
    return this.players.get(guildId) ?? null;
  }

  /**
   * Plays a surah with the given reciter in a voice channel.
   */
  public async play(
    guildId: string,
    channel: VoiceBasedChannel,
    surah: Surah,
    reciter: Reciter,
    volume?: number,
  ): Promise<void> {
    const state = this.getOrCreate(guildId);
    const url = buildAudioUrl(reciter, surah.id);

    state.currentSurah = surah;
    state.currentReciter = reciter;

    await state.player.play(channel, url, volume !== undefined ? { volume } : undefined);
  }

  /**
   * Enables or disables 24/7 autoplay mode.
   * When enabled, the bot automatically plays the next surah when the current one finishes.
   */
  public setAutoplay(guildId: string, enabled: boolean): boolean {
    const state = this.players.get(guildId);
    if (!state) return false;
    state.autoplay = enabled;
    return true;
  }

  /**
   * Gets the next surah in sequence.
   */
  private getNextSurah(currentSurah: Surah): Surah {
    const nextId = currentSurah.id >= 114 ? 1 : currentSurah.id + 1;
    return SURAHS.find((s) => s.id === nextId) ?? SURAHS[0]!;
  }

  /**
   * Handles playback finish — auto-plays next surah if autoplay is enabled.
   */
  private handleFinish(guildId: string): void {
    const state = this.players.get(guildId);
    if (!state || !state.autoplay || !state.currentSurah) return;

    const channel = state.player.channel;
    if (!channel) return;

    const nextSurah = this.getNextSurah(state.currentSurah);

    if (!state.currentReciter.surahList.includes(nextSurah.id)) {
      console.warn(
        `[PlayerManager] Reciter ${state.currentReciter.englishName} does not have surah ${nextSurah.id}, skipping.`,
      );
      return;
    }

    const url = buildAudioUrl(state.currentReciter, nextSurah.id);
    state.currentSurah = nextSurah;

    state.player.play(channel, url).catch((error: unknown) => {
      console.error(`[PlayerManager] Autoplay failed for guild ${guildId}:`, error);
    });
  }

  /**
   * Stops playback for a guild.
   */
  public stop(guildId: string): boolean {
    const state = this.players.get(guildId);
    if (!state) return false;

    state.autoplay = false;
    state.player.stop();
    state.currentSurah = null;
    return true;
  }

  /**
   * Pauses playback for a guild.
   */
  public pause(guildId: string): boolean {
    const state = this.players.get(guildId);
    if (!state) return false;
    return state.player.pause();
  }

  /**
   * Resumes playback for a guild.
   */
  public resume(guildId: string): boolean {
    const state = this.players.get(guildId);
    if (!state) return false;
    return state.player.resume();
  }

  /**
   * Sets volume for a guild.
   */
  public setVolume(guildId: string, level: number): boolean {
    const state = this.players.get(guildId);
    if (!state) return false;
    state.player.setVolume(level);
    return true;
  }

  /**
   * Sets loop mode for a guild.
   */
  public setLoop(guildId: string, enabled: boolean): boolean {
    const state = this.players.get(guildId);
    if (!state) return false;
    state.player.setLoop(enabled);
    return true;
  }

  /**
   * Gets the playback duration in ms.
   */
  public getPlaybackDuration(guildId: string): number {
    const state = this.players.get(guildId);
    if (!state) return 0;
    return state.player.playbackDuration;
  }

  /**
   * Gets the current player status.
   */
  public getStatus(guildId: string): PlayerStatus {
    const state = this.players.get(guildId);
    if (!state) return PlayerStatus.Idle;
    return state.player.status;
  }

  /**
   * Cleans up player state for a guild.
   */
  private cleanup(guildId: string): void {
    const state = this.players.get(guildId);
    if (state) {
      state.currentSurah = null;
      state.autoplay = false;
    }
  }

  /**
   * Destroys a guild's player completely.
   */
  public destroy(guildId: string): void {
    const state = this.players.get(guildId);
    if (state) {
      state.player.destroy();
      this.players.delete(guildId);
    }
  }

  /**
   * Destroys all players (for graceful shutdown).
   */
  public destroyAll(): void {
    for (const [guildId] of this.players) {
      this.destroy(guildId);
    }
  }
}

/** Singleton player manager instance. */
export const playerManager = new PlayerManager();
