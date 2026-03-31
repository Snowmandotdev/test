# Quran Bot v2.0

A professional Quran recitation Discord bot built with [CommandKit](https://commandkit.js.org/), [discord.js v14](https://discord.js.org/), and [discord-radio v1.1.0](https://github.com/motaz-darawsha/discord-radio).

## Features

- **Quran Audio Streaming** - Stream Quran recitations directly in Discord voice channels
- **15 Popular Reciters** - Mishary Alafasy, Abdul Basit, Maher Al-Muaiqly, and more
- **All 114 Surahs** - Complete Quran coverage with Arabic and English names
- **Components V2 UI** - Modern Discord UI using `ContainerBuilder`, `TextDisplayBuilder`, `SeparatorBuilder` (no legacy EmbedBuilder)
- **MessageFlags** - Proper use of `MessageFlags.IsComponentsV2` and `MessageFlags.Ephemeral`
- **Internationalization (i18n)** - Full Arabic and English support via `@commandkit/i18n`
- **24/7 Autoplay** - Continuous playback with automatic surah switching
- **Loop Mode** - Repeat the current surah via discord-radio v1.1.0 loop support
- **Autocomplete** - Smart autocomplete for surah and reciter selection
- **Full Playback Controls** - Play, pause, resume, stop, volume, loop, autoplay
- **Strict TypeScript** - `strict: true` with `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`

## Commands

| Command | Description |
|---------|-------------|
| `/play <surah> [reciter] [volume]` | Play a Quran surah in your voice channel |
| `/stop` | Stop playback and leave the voice channel |
| `/pause` | Pause current playback |
| `/resume` | Resume paused playback |
| `/volume <level>` | Set volume (0-100) |
| `/nowplaying` | Show current playback info |
| `/reciters [page]` | List all available reciters |
| `/autoplay` | Toggle 24/7 autoplay mode |
| `/loop` | Toggle loop mode for the current surah |

## Setup

### Prerequisites

- Node.js v18 or higher (v24+ recommended for CommandKit)
- FFmpeg installed on your system
- A Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))

### Installation

```bash
npm install
```

### Configuration

```bash
cp .env.example .env
```

```env
DISCORD_TOKEN=your_discord_bot_token_here
DEV_GUILD_ID=your_dev_guild_id_here  # optional, for faster dev command registration
```

### Running

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

**Type Checking:**
```bash
npm run typecheck
```

## Project Structure

```
src/
  app.ts                         # Discord client setup
  commandkit.config.ts           # CommandKit + i18n plugin config
  app/
    commands/                    # Slash commands
      play.ts                    # Play surah with autocomplete
      stop.ts                    # Stop playback
      pause.ts                   # Pause playback
      resume.ts                  # Resume playback
      volume.ts                  # Volume control
      nowplaying.ts              # Current playback info
      reciters.ts                # List reciters
      autoplay.ts                # Toggle 24/7 mode
      loop.ts                    # Toggle loop mode
    events/
      clientReady/ready.ts       # Bot ready event
    locales/
      ar/                        # Arabic translations
      en-US/                     # English translations
  data/
    surahs.ts                    # 114 surahs metadata
    reciters.ts                  # 15 reciters with audio URLs
  services/
    components.ts                # Components V2 UI builders
    player-manager.ts            # RadioPlayer manager with autoplay
  types/
    discord-radio.d.ts           # discord-radio v1.1.0 type declarations
    i18n.d.ts                    # i18n type augmentation
```

## Reciters

1. مشاري راشد العفاسي - Mishary Rashid Alafasy
2. عبدالرحمن السديس - Abdurrahman As-Sudais
3. سعود الشريم - Saud Ash-Shuraim
4. ماهر المعيقلي - Maher Al-Muaiqly
5. عبدالباسط عبدالصمد - Abdul Basit Abdul Samad
6. هزاع البلوشي - Hazza Al-Balushi
7. أحمد العجمي - Ahmed Al-Ajmi
8. ياسر الدوسري - Yasser Ad-Dossari
9. ناصر القطامي - Nasser Al-Qatami
10. فارس عباد - Fares Abbad
11. إبراهيم الأخضر - Ibrahim Al-Akhdar
12. محمد صديق المنشاوي - Muhammad Siddiq Al-Minshawi
13. علي الحذيفي - Ali Al-Hudhaify
14. محمود خليل الحصري - Mahmoud Khalil Al-Hussary
15. سعد الغامدي - Saad Al-Ghamdi

## Audio Source

Audio streamed from [mp3quran.net](https://mp3quran.net/).

## Tech Stack

- **[CommandKit v1.2](https://commandkit.js.org/)** - Discord bot meta-framework
- **[discord.js v14.25](https://discord.js.org/)** - Discord API library
- **[discord-radio v1.1.0](https://github.com/motaz-darawsha/discord-radio)** - Audio streaming with FFmpeg, loop, finish events
- **[@commandkit/i18n](https://commandkit.dev/docs/guide/official-plugins/commandkit-i18n)** - Internationalization plugin
- **TypeScript 5.7** - Strict type safety

## License

MIT
