import muteDb from "../../database/schemas/mute";
import Mute from "./Mute";
import config from "../../config";
import discord from "discord.js";
import Client from "../../Client";
import { CronJob } from "cron";
import MuteApi from "../../database/schemas/muteApi";

class Moderation {
  private muteRoleId: string = config.muteRoleId;
  private muteRole!: discord.Role;
  private mutedMembers!: Mute[];
  private client: Client;
  private Jobs: Map<string, CronJob> = new Map();

  constructor(client: Client) {
    this.client = client;
    this.loadData();
  }

  isMuted(member: discord.GuildMember): boolean {
    return member.roles.cache.has(this.muteRoleId);
  }

  findMute(discordId: string) {
    return this.mutedMembers.find((mute) => mute.isThisUser(discordId));
  }

  async muteMember(
    member: discord.GuildMember,
    author: discord.GuildMember,
    duration: number
  ) {

    if (this.isMuted(member)) throw new Error(`<@${member.id}> Jau palaidotas 🥀`);

    const currentTime = new Date(Date.now());

    const data = {
      discordId: member.id,
      authorId: author.id,
      roleId: this.muteRoleId,
      mutedOn: currentTime,
      unMuteOn: new Date(currentTime.getTime() + duration),
      duration: duration,
    };

    const mute = new Mute(await muteDb.create(data));
    this.mutedMembers.push(mute);
    this.startCronJob(mute)
    await member.roles.add(this.muteRoleId);
  }

  async unMuteMember(discordId: string) {
    const guild = this.client.Guild;
    let member = guild.members.cache.get(discordId);
    if(!member) member = await guild.members.fetch(discordId);
    const memberMute = this.mutedMembers.filter((mute) =>
      mute.isThisUser(discordId)
    )[0];
    if (!memberMute) throw new Error(`<@${discordId}> Šis vartotojas gyvas`);
    this.mutedMembers = this.mutedMembers.filter(
      (mute) => !mute.isThisAuthor(discordId)
    );
    if (member) await member.roles.remove(memberMute.getData().roleId).catch((err) => console.error(err));
    // istrina is mute listo O.o
  }

  async startCronJob(mute: Mute) {
    const discordId = mute.getData().discordId;
    const job = new CronJob(mute.getEndDate(), async () => {
      try {
        await this.unMuteMember(mute.getData().discordId).catch(err => console.log(err));
      } catch (err) {
        console.log(err);
      }
    });
    job.start();
    this.Jobs.set(discordId, job);
  }

  // private async loop() {
  //   console.log(`LOOP = start`);
  //   if (!this.mutedMembers) return;
  //   console.log(this.mutedMembers);
  //   if (this.mutedMembers.length == 0) return;
  //   this.mutedMembers = this.mutedMembers.filter((muted) => {
  //     console.log(`LOOP =`);
  //     if (muted.getEndDate().getTime() <= Date.now()) {
  //       this.unMuteMember(muted.getData().discordId);
  //       return false;
  //     }
  //   });
  // }

  async loadData() {
    console.log(`Load Data`);
    const muteRole = this.client.Guild.roles.cache.get(this.muteRoleId);
    if (muteRole) this.muteRole = muteRole;
    else {
      // log error that role wasnt found O.o
    }
    this.mutedMembers = (
      await muteDb.find({ unMuteOn: { $gt: new Date(Date.now()) } })
    ).map((data) => {
      const muteObj = new Mute(data);
      this.startCronJob(muteObj);
      return new Mute(data);
    });
    console.log(this.mutedMembers);
    // muteDb.find(); // load active mutes O.o
  }
}

export default Moderation;
