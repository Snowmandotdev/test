import puppeteer from 'puppeteer';

export type PlaybackState = 'playing' | 'paused' | 'loading' | 'stopped' | 'buffering' | 'error';

interface SurahData {
    id: string;
    nameAr: string;
    nameEn: string;
    reader: string;
    verses: string;
    type: string;
    volume: string;
    state?: PlaybackState;
}

const STATE_CONFIG: Record<PlaybackState, {
    dotColor: string;
    dotGlow: string;
    label: string;
    icon: string;
    animated: boolean;
}> = {
    playing: {
        dotColor: '#27ae60',
        dotGlow: '#27ae60',
        label: 'يتم التشغيل الآن',
        icon: '▶',
        animated: true,
    },
    paused: {
        dotColor: '#f39c12',
        dotGlow: '#f39c12',
        label: 'متوقف مؤقتاً',
        icon: '⏸',
        animated: false,
    },
    loading: {
        dotColor: '#3498db',
        dotGlow: '#3498db',
        label: 'جاري التحميل...',
        icon: '⏳',
        animated: true,
    },
    buffering: {
        dotColor: '#9b59b6',
        dotGlow: '#9b59b6',
        label: 'جاري التخزين المؤقت...',
        icon: '⏳',
        animated: true,
    },
    stopped: {
        dotColor: '#95a5a6',
        dotGlow: 'transparent',
        label: 'متوقف',
        icon: '⏹',
        animated: false,
    },
    error: {
        dotColor: '#e74c3c',
        dotGlow: '#e74c3c',
        label: 'خطأ في التشغيل',
        icon: '⚠',
        animated: false,
    },
};

export class SurahImageGenerator {
    public static async generate(data: SurahData): Promise<Buffer> {
        const state = data.state ?? 'playing';
        const cfg = STATE_CONFIG[state];

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setViewport({
            width: 850,
            height: 400,
            deviceScaleFactor: 3,
        });

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                :root {
                    --bg: #e0e5ec;
                    --shadow-light: #ffffff;
                    --shadow-dark: #a3b1c6;
                    --accent: #b8860b;
                    --text: #4a4a4a;
                }
                body {
                    background-color: var(--bg);
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .horizontal-card {
                    width: 750px;
                    height: 280px;
                    background: var(--bg);
                    border-radius: 40px;
                    display: flex;
                    padding: 30px;
                    box-shadow: 20px 20px 60px var(--shadow-dark), 
                               -20px -20px 60px var(--shadow-light);
                    position: relative;
                    align-items: center;
                    gap: 40px;
                }
                .visual-side {
                    width: 220px;
                    height: 220px;
                    background: var(--bg);
                    border-radius: 30px;
                    box-shadow: inset 6px 6px 12px var(--shadow-dark), 
                                inset -6px -6px 12px var(--shadow-light);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid rgba(184, 134, 11, 0.1);
                }
                .surah-number {
                    font-size: 5rem;
                    font-weight: 900;
                    color: var(--accent);
                    line-height: 1;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                }
                .surah-label {
                    font-size: 14px;
                    color: #888;
                    margin-top: 5px;
                }
                .info-side {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }
                .top-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .title-group h1 {
                    margin: 0;
                    font-size: 2.8rem;
                    color: var(--text);
                    font-weight: 800;
                }
                .title-group p {
                    margin: 0;
                    color: var(--accent);
                    font-size: 1.2rem;
                    letter-spacing: 2px;
                }
                .badge {
                    padding: 8px 18px;
                    background: var(--bg);
                    border-radius: 15px;
                    box-shadow: 4px 4px 8px var(--shadow-dark), 
                                -4px -4px 8px var(--shadow-light);
                    font-size: 0.85rem;
                    color: var(--text);
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .reader-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin: 15px 0;
                }
                .reader-name {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #555;
                }
                .playback-area {
                    margin-top: 10px;
                }
                .progress-container {
                    width: 100%;
                    height: 12px;
                    background: var(--bg);
                    border-radius: 10px;
                    box-shadow: inset 4px 4px 8px var(--shadow-dark), 
                                inset -4px -4px 8px var(--shadow-light);
                    position: relative;
                    margin-bottom: 15px;
                }
                .progress-bar {
                    width: ${state === 'stopped' ? '0%' : data.volume};
                    height: 100%;
                    background: ${
                        state === 'paused'
                            ? 'linear-gradient(90deg, #f39c12, #f1c40f)'
                            : state === 'error'
                            ? 'linear-gradient(90deg, #e74c3c, #c0392b)'
                            : state === 'loading' || state === 'buffering'
                            ? 'linear-gradient(90deg, #3498db, #9b59b6)'
                            : 'linear-gradient(90deg, var(--accent), #ffd700)'
                    };
                    border-radius: 10px;
                    ${state === 'loading' || state === 'buffering' ? 'animation: pulse-bar 1.2s ease-in-out infinite;' : ''}
                }
                .stats-footer {
                    display: flex;
                    gap: 30px;
                    font-size: 0.9rem;
                    color: #777;
                }
                .stats-footer b {
                    color: var(--text);
                }
                .pulse-dot {
                    width: 10px;
                    height: 10px;
                    background: ${cfg.dotColor};
                    border-radius: 50%;
                    display: inline-block;
                    box-shadow: ${cfg.dotGlow !== 'transparent' ? `0 0 10px ${cfg.dotGlow}` : 'none'};
                    ${cfg.animated ? 'animation: blink 1.2s ease-in-out infinite;' : ''}
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                @keyframes pulse-bar {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
        </head>
        <body>
            <div class="horizontal-card" id="capture">
                <div class="visual-side">
                    <span class="surah-number">${data.id}</span>
                    <span class="surah-label">سورة ${data.nameAr}</span>
                </div>
                <div class="info-side">
                    <div class="top-meta">
                        <div class="title-group">
                            <h1>${data.nameAr}</h1>
                            <p>${data.nameEn.toUpperCase()}</p>
                        </div>
                        <div class="badge">
                            <span class="pulse-dot"></span>
                            ${cfg.label}
                        </div>
                    </div>
                    <div class="reader-info">
                        <span style="font-size: 1.5rem;">${state === 'error' ? '⚠️' : '🎙️'}</span>
                        <span class="reader-name">${data.reader}</span>
                    </div>
                    <div class="playback-area">
                        <div class="progress-container">
                            <div class="progress-bar"></div>
                        </div>
                        <div class="stats-footer">
                            <span>الآيات: <b>${data.verses}</b></span>
                            <span>النوع: <b>${data.type}</b></span>
                            <span>الصوت: <b>${data.volume}</b></span>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;

        await page.setContent(htmlContent);
        const element = await page.$('#capture');
        const buffer = await element?.screenshot({ type: 'png', omitBackground: true });
        await browser.close();
        return buffer as Buffer;
    }
}
