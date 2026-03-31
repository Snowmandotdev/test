declare module "discord-radio" {
  import type { VoiceBasedChannel } from "discord.js";
  import type { StreamType } from "@discordjs/voice";
  import { EventEmitter } from "node:events";

  export enum PlayerStatus {
    Idle = "idle",
    Connecting = "connecting",
    Playing = "playing",
    Paused = "paused",
    Destroyed = "destroyed",
  }

  export interface FFmpegOptions {
    path?: string;
    inputArgs?: string[];
    outputArgs?: string[];
  }

  export interface RadioPlayerOptions {
    defaultVolume?: number;
    autoLeave?: boolean;
    selfDeaf?: boolean;
    loop?: boolean;
    connectionTimeout?: number;
    ffmpeg?: FFmpegOptions;
  }

  export interface PlayOptions {
    volume?: number;
    inputType?: StreamType;
    ffmpeg?: Pick<FFmpegOptions, "inputArgs" | "outputArgs">;
  }

  export interface PlayerState {
    status: PlayerStatus;
    volume: number;
    channel: VoiceBasedChannel | null;
    connected: boolean;
    currentUrl: string | null;
    loop: boolean;
    playbackDuration: number;
  }

  export class RadioPlayerError extends Error {
    readonly code: string;
    constructor(message: string);
  }

  export class InvalidStateError extends RadioPlayerError {}
  export class ConnectionError extends RadioPlayerError {}
  export class ValidationError extends RadioPlayerError {}
  export class PlaybackError extends RadioPlayerError {}
  export class FFmpegError extends RadioPlayerError {}

  export interface RadioPlayerEvents {
    play: [url: string];
    stop: [];
    finish: [url: string];
    loop: [url: string, count: number];
    pause: [];
    resume: [];
    volumeChange: [volume: number];
    error: [error: RadioPlayerError];
    statusChange: [oldStatus: PlayerStatus, newStatus: PlayerStatus];
    destroy: [];
    connect: [channel: VoiceBasedChannel];
    disconnect: [];
  }

  export class RadioPlayer extends EventEmitter {
    constructor(options?: RadioPlayerOptions);

    readonly status: PlayerStatus;
    readonly volume: number;
    readonly currentUrl: string | null;
    readonly channel: VoiceBasedChannel | null;
    readonly isPlaying: boolean;
    readonly isPaused: boolean;
    readonly isConnected: boolean;
    readonly loop: boolean;
    readonly playbackDuration: number;

    play(channel: VoiceBasedChannel, url: string, options?: PlayOptions): Promise<void>;
    stop(): void;
    pause(): boolean;
    resume(): boolean;
    setVolume(level: number): void;
    setLoop(enabled: boolean): void;
    getState(): PlayerState;
    disconnect(): void;
    destroy(): void;

    on<K extends keyof RadioPlayerEvents>(event: K, listener: (...args: RadioPlayerEvents[K]) => void): this;
    once<K extends keyof RadioPlayerEvents>(event: K, listener: (...args: RadioPlayerEvents[K]) => void): this;
    emit<K extends keyof RadioPlayerEvents>(event: K, ...args: RadioPlayerEvents[K]): boolean;
    off<K extends keyof RadioPlayerEvents>(event: K, listener: (...args: RadioPlayerEvents[K]) => void): this;
  }
}
