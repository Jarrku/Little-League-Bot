import axios from "axios";
import { LeaguePosition, RunePages, Summoner } from "./RiotInterfaces";

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
  baseURL: "https://",
  headers: {
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": RIOT_TOKEN,
  },
});

export const fetchRank = async (server: string, summonerName: string) => {
  // SERVER BLANK ATM get serverurl
  try {
    const prefix = serverMap.get(server);
    if (!prefix) return;
    const summoner = await getSummoner(prefix, summonerName);
    return;
  } catch (err) {
    console.log(err);
    return;
  }
};

const getSummoner = async (prefix: string, summonerName: string): Promise<Summoner> => {
  return new Promise<Summoner>((resolve, reject) => {
    riotApi.request({
      url: `${prefix}${baseEndpoint}/lol/summoner/v3/summoners/by-name/${summonerName}`,
    }).then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
};

/** https://{ENDPOINT}/lol/league/v3/positions/by-summoner/{summonerID}
 *
 * headers:
 * "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
 *  "X-Riot-Token": "RGAPI-e55f7dcc-0e9a-47e6-acfd-8cd0b6cff0ee",
 *  return: LeaguePosition[]
 *
 * /lol/platform/v3/runes/by-summoner/{summonerId}
 * returns: RunePages
 *
 *  /lol/summoner/v3/summoners/by-name/{summonerName}
 * returns Summoner
 */
