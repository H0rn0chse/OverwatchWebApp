export type Role = "Support" | "Tank" | "DPS";
export type Teamsize = 1 | 2 | 3 | 4 | 5 | 6;
export type WLD = "Win" | "Loss" | "Draw";

export interface Entry {
    id: number,
    sortId: number,
    session: number,
    sr: number,
    diff: number,
    role: Role,
    size: Teamsize,
    season: string,
    wasDefault: boolean,
    wld: WLD
};

export interface GroupStatEntry {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number,
    6: number
}

export interface Stats {
    // General
    enhancedEntries: Entry[],
    gamesPlayed: number,
    startSr: number,
    seasonHigh: number,
    seasonLow: number,
    win: number,
    loss: number,
    draw: number,
    winStreak: number,
    lossStreak: number,
    currentSr: number,
    srGain: number,
    winRate: number,
    srLoss: number,
    srWin: number,
    srAvg: number,
    // Group
    gamesPlayedGroup: GroupStatEntry,
    winGroup: GroupStatEntry,
    lossGroup: GroupStatEntry,
    drawGroup: GroupStatEntry,
    winRateGroup: GroupStatEntry,
    // Session
    sessionStart: number,
    sessionCurrent: number,
    sessionWin: number,
    sessionLoss: number,
    sessionDraw: number,
}