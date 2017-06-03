type TIER = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "MASTER" | "CHALLENGER";
type QUEUE_TYPE = "RANKED_SOLO_5x5" | "RANKED_FLEX_SR";
type RANK = "V" | "IV" | "III" | "II" | "I";

export interface Summoner {
  profileIconId: number;
  name: string;
  summonerLevel: number;
  revisionDate: number;
  id: number;
  accountId: number;
}

export interface LeaguePosition {
  rank: RANK;
  queueType: QUEUE_TYPE;
  hotStreak: boolean;
  miniSeries: MiniSeries;
  wins: number;
  losses: number;
  veteran: boolean;
  playerOrTeamId: string;
  leagueName: string;
  playerOrTeamName: string;
  inactive: boolean;
  freshBlood: boolean;
  tier: TIER;
  leaguePoints: string;
}

interface MiniSeries {
  wins: number;
  losses: number;
  target: number;
  progress: string;
}

export interface RunePages {
  pages: RunePage[];
  summonerId: number;
}

interface RunePage {
  current: boolean;
  slots: RuneSlot[];
  name: string;
  id: number;
}

interface RuneSlot {
  runeSlotId: number;
  runeId: number;
}
