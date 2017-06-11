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
  `
These all are the available roles, add and remove them with \`!+\` and \`!-\` (More info in the pinned message).
** __Rank__ **
${roles.rank.join(", ")}

** __Region__ **
${roles.region.join(", ")}

** __Access to flavour channels__ **
${roles.flavour.join(", ")}`;

const getRolestring = (tier: string, server: string, rank: string): string => {
  let roleString = "";
  if (tier === "DIAMOND") {
    switch (rank) {
      case "I":
        roleString = "Diamond 1"; break;
      case "II":
        roleString = "Diamond 2"; break;
      case "III":
        roleString = "Diamond 3"; break;
      case "IV":
        roleString = "Diamond 4"; break;
      case "V":
        roleString = "Diamond 5"; break;
    }
  } else if (tier === "PLATINUM") {
    switch (rank) {
      case "I":
      case "II":
        roleString = "Platinum 1-2"; break;
      case "III":
      case "IV":
      case "V":
        roleString = "Platinum 3-5"; break;
    }
  } else {
    roleString = tier;
  }
  roleString += `, ${server}`;
  return roleString;
};

const customOptions: ConfigOptions = {
  verifiedRoleName: "Verified",
  chatlogChannel: "talk-log-pogpog",
  excludedLogChannels: ["talk-log-pogpog", "admin", "botpogpog", "arths-bot-test-channel", "moderator", "staff"],
  roleAssignmentChannel: "role-assignment",
  notInRoleAssignmentError: "Role/verify commands only work in #role-assignment to keep the other chats clean, sorry!",
  staff: ["admin", "moderator"],
  staffOnlyMsg: "This command is *obviously* only for Moderators or Admins, nice try :^)",
  timeoutRoleName: "silenced",
  modlogChannel: "mod-logs",
  assignableRoles: roles,
  rolehelpText: helpText,
  getRolestring,
  welcomeText: `Welcome to Little League!
Please read the rules in  #welcome and get yourself some roles in #role-assignment.
We hope you enjoy your stay!`,
};

export default customOptions;
