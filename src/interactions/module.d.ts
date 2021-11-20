import TextCommandApi from "./command";
import InteractionCommandApi from "./interaction";

interface CommandModuleApi {
    private ready: boolean;
    interactionCommand: InteractionCommandApi;
    textCommand: TextCommandApi;
}