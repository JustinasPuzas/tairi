import discord from "discord.js";

class clan {
  members: Array<discord.GuildMember | discord.GuildMemberResolvable> = [];
  config: any;
  private joinRequests: any;

  constructor() {}

  inviteMember() {}

  removeRequestToJoin() {}

  requestToJoin() {
    // sent by anyone
  }

  loadData() {}
}

export default clan;
