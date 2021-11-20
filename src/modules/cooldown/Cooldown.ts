import discord from 'discord.js';
import milToHR from 'pretty-ms';

class CoolDown {
    private coolDowns: Map<string, Date> = new Map();

    async checkCoolDown(userId: string, channelId: string, request: discord.CommandInteraction | discord.Message):Promise<boolean>{
        const userCoolDown = this.coolDowns.get(userId)
        const channelCoolDown = this.coolDowns.get(userId)

        if(userCoolDown){
            if(userCoolDown.getTime() < Date.now()){
                this.coolDowns.delete(userId)
                return false 
            }
            const timeLeft =userCoolDown.getTime() - Date.now()
            const response = await request.reply({content: `Galėsite naudotis komandandomis po ${milToHR(timeLeft)}\n arba pranykus šiai žinutei`}) as discord.Message;
            setTimeout( async ()=>{
                await response.delete().catch(err => console.log(err))
            }, timeLeft)
            // reply on cd for user aka you can use commands after
            return true
        }
        if(channelCoolDown){
            if(channelCoolDown.getTime() < Date.now()){
                this.coolDowns.delete(channelId)
                return false 
            }
            const timeLeft = channelCoolDown.getTime() - Date.now()
            const response = await request.reply({content: `Šią komandą bus galima naudoti po ${milToHR(timeLeft)}\n arba dabar kitame kanale`}) as discord.Message;
            setTimeout( async ()=>{
                await response.delete().catch(err => console.log(err))
            }, timeLeft)
            // reply on cd for user aka you can use commands after
            return true
        }
        // checks if there is active coolDown for channel and user
        // called before calling command
        return false
    }

    /**
     * for display command pass channelId
     * for user pass userId
     */
    createCoolDown(Id: string, end: Date){
        this.coolDowns.set(Id, end)
        //creates coolDown for channel and user
        //called from command
    }

    /**
     * 
     * used for premature cd removing
     */
    deleteCoolDown(Id: string){
        this.coolDowns.delete(Id)
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