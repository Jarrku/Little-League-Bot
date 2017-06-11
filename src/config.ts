import littleleagueConfig from "./Config/Littleleague";
import plazaConfig from "./Config/Plaza";

export interface AssignableRoles {
  rank: string[];
  region: string[];
  flavour: string[];
  other: string[];
}

export interface ConfigOptions {
  verifiedRoleName: string;
  chatlogChannel: string;
  excludedLogChannels: string[];
  roleAssignmentChannel: string;
  notInRoleAssignmentError: string;
  staff: string[];
  staffOnlyMsg: string;
  timeoutRoleName: string;
  modlogChannel: string;
  assignableRoles: AssignableRoles;
  rolehelpText: string;
  getRolestring: (tier: string, server: string, rank?: string) => string;
  welcomeText: string;
}

const littleleagueID = "314417120568147968";
const plazaID = "182235073171554304";

const getConfig = (id: string): ConfigOptions => {
  if (id === littleleagueID) return littleleagueConfig;
  return plazaConfig;
};

export default getConfig;
