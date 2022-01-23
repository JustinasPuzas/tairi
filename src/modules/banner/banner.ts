import BoosterPage from "./pages/booster";
import nodeHtmlToImage from 'node-html-to-image'
import discord from "discord.js"

class Banner {
    booster: BoosterPage = new BoosterPage;

    async execute(user: discord.User){
        const image = await nodeHtmlToImage({
            output: './image.png',
            html: this.booster.page(),
            content: {name: user.username, avatar: user.avatarURL()},
            transparent: true,
          })
        console.log("DONE")
        return image;
    }
}

export default Banner;