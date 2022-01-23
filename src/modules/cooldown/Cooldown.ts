import discord from 'discord.js';
import milToHR from 'pretty-ms';
import config from '../../config';

interface userCoolDown {
    discordId: string,
    date: Date,
}

class CoolDown {
    onCoolDown: Map<string, Map<string, Date>> = new Map();

    async isOnCoolDown(userId: string, channelId: string):Promise<boolean>{
        const channel = this.onCoolDown.get(channelId)
        if(!channel) return false;
        const user = channel.get(userId);
        if(!user) return false;
        if(user.getTime() + config.globalCoolDown > Date.now()){
            //await warn();
            return true;
        }
        return false
    }

    /**
     * for display command pass channelId
     * for user pass userId
     */
    async createCoolDown(userId: string, channelId: string){
        if(!this.onCoolDown.get(channelId)) {
            this.onCoolDown.set(channelId, new Map())
        }

        if(!this.onCoolDown.get(channelId)?.get(userId)){
            this.onCoolDown.get(channelId)?.set(userId, new Date(Date.now()))
        }
        setTimeout(() => {
            this.onCoolDown.get(channelId)?.delete(userId)
        }, config.globalCoolDown);
        //creates coolDown for channel and user
        //called from command
    }

    /**
     * 
     * used for premature cd removing
     */
    private deleteCoolDown(Id: string){
        //deletes coolDown for channel and user
        //called from command
    }

    // user each user after active display cmd 15 sec on close
    // channel one display command per channel
    // 
}

class Command {
    constructor(){

    }
}

class activeCommand extends Command {

}

class displayCommand extends Command {

}

export default CoolDown