import axios from "axios";
import { LeaguePosition, RunePages, Summoner } from "../Interfaces/Riot";

const RIOT_TOKEN = process.env.RIOT_TOKEN;
const baseEndpoint = ".api.riotgames.com";

export const servers = {
  BR: "br1",
  EUNE: "eun1",
  EUW: "euw1",
  JP: "jp1",
  KR: "kr",
  LAN: "la1",
  LAS: "la2",
  NA: "na1",
  OCE: "oc1",
  TR: "tr1",
  RU: "ru",
};
const serverMap = new Map<string, string>(Object.entries(servers));

const riotApi = axios.create({
  headers: {
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": RIOT_TOKEN,
  },
});

export const fetchRank = async (server: string, summonerName: string, runepageName: string) => {
  try {
    const prefix = serverMap.get(server);
    if (!prefix) return `${server} is an incorrect prefix, please try a known value:\n${Object.keys(servers).join(", ")}`;

    const { id } = await getSummoner(prefix, summonerName);
    const [runepages, leagues] = await Promise.all([getRunepages(prefix, id), getLeagues(prefix, id)]);

    // name not found -> return;
    if (runepages.pages.findIndex((p) => p.name.toLowerCase() === runepageName) === -1) return `no runepage found with name: ${runepageName}`;

    // soloq not found -> return;
    const soloq = leagues.find((league) => league.queueType === "RANKED_SOLO_5x5");
    if (!soloq) return `couldn't find a soloqueue rank for ${summonerName}`;

    // only send back relevant data
    const { tier, rank } = soloq;
    return { tier, rank };
  } catch (err) {
    console.log(err);
    return `problems fetching data for ${summonerName}, are you sure it's the correct summonername and server?`;
  }
};

const getSummoner = (prefix: string, summonerName: string) => {
  return resolveUrl<Summoner>(`https://${prefix}${baseEndpoint}/lol/summoner/v3/summoners/by-name/${summonerName}`);
};

const getRunepages = (prefix: string, summonerId: number) => {
  return resolveUrl<RunePages>(`https://${prefix}${baseEndpoint}/lol/platform/v3/runes/by-summoner/${summonerId}`);
};

const getLeagues = (prefix: string, summonerId: number) => {
  return resolveUrl<LeaguePosition[]>(`https://${prefix}${baseEndpoint}/lol/league/v3/positions/by-summoner/${summonerId}`);
};

function resolveUrl<T>(url: string) {
  return new Promise<T>((resolve, reject) => {
    riotApi.request({
      url,
    }).then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}
