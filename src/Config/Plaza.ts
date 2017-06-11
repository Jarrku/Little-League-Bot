import { AssignableRoles, ConfigOptions } from "../config";

const roles: AssignableRoles = {
  rank: [
    "Diamond +",
    "Platinum",
    "Gold",
    "Silver",
    "Bronze",
  ],
  region: [
    "NA",
    "EUW",
    "EUNE",
    "OCE",
    "BR",
    "LAN",
    "LAS",
    "CN",
    "KR",
    "TR",
    "GARENA",
  ],
  flavour: [
    "NLFG",
    "NPVS",
    "Coach",
    "Tournament",
    "Top",
    "Mid",
    "Jungle",
    "ADC",
    "Support",
  ],
  other: [],
};
const helpText =
  `These all are the available roles, add and remove them with \`!+\` and \`!-\` (More info in the pinned message).
** __Rank__ **
${roles.rank.join(", ")}

** __Region__ **
${roles.region.join(", ")}

** __Additional Roles__ **
${roles.flavour.join(", ")}`;

const getRolestring = (tier: string, server: string): string => {
  let roleString = ["DIAMOND", "MASTER", "CHALLENGER"].includes(tier) ? "Diamond +" : tier;

  roleString += `, ${server}`;
  return roleString;
};

const customOptions: ConfigOptions = {
  verifiedRoleName: "Verified",
  chatlogChannel: "chatlog",
  excludedLogChannels: ["chatlog", "modchat", "admin"],
  roleAssignmentChannel: "role-assignment",
  notInRoleAssignmentError: "Role/verify commands only work in #role-assignment to keep the other chats clean, sorry!",
  staff: ["admin", "Moderator"],
  staffOnlyMsg: "This command is *obviously* only for Moderators or Admins, nice try :^)",
  timeoutRoleName: "Timeout",
  modlogChannel: "mod-logs",
  rolehelpText: helpText,
  assignableRoles: roles,
  getRolestring,
  welcomeText: `Welcome to Little League!
Please read the rules in  #welcome and get yourself some roles in #role-assignment.
We hope you enjoy your stay!`,
};

export default customOptions;
