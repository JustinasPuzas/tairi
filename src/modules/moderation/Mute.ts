import MuteApi from "../../database/schemas/muteApi";
import Moderation from "./Moderation";

class Mute{
    private data: MuteApi;

    constructor(data: MuteApi){
        this.data = data;
    }
    
    getData(){
        return this.data
    }

    getEndDate(){
        return this.data.unMuteOn;
    }

    isThisUser(discordId: string):boolean{
        return this.data.discordId == discordId
    }

    isThisAuthor(authorId: string):boolean{
        return this.data.authorId == authorId;
    }
}

export default Mute;