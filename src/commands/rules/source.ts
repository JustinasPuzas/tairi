import rules from "./rules";

const rules_text = {
  definitions: [
    {
      Title: "Bausmės",
      Desc: "Bausmių paaiškinimai:",
      Color: "00FBFF",
      TitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.gif?size=1024",
      SubTitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.webp?",
      Contents: [
        {
          Name: "Įspėjimas",
          explain:
            "Gaunamas pažeidus kurią nors taisyklę, prieš pritaikydami bausmę neprivalo įspėti",
        },
        { Name: "Mute", explain: "Rašymo į daugumą teksto kanalų apribojimas" },
        {
          Name: "Keliamo turinio apribojimas",
          explain: "Draudimas kelti nuotraukas bei embedinti nuorodas",
        },
        { Name: "SoftBan", explain: "Išjungiami teksto kanalai" },
        { Name: "VoiceBan", explain: "Išjungiami voice kanalai" },
        { Name: "Kick", explain: "Visų papildomų rolių pašalinimas" },
        {
          Name: "Ban",
          explain:
            "Draudimas prisijungti į Centriukas 24/7 serverį nenustatytam laikui, rekomenduojama prašyti unban po mėnesio",
        },
      ],
    },
    {
      Title: "Nusižengimai",
      Desc: "Galimų nusižengimų taisyklėms paaiškinimai:",
      Color: "FF00FF",
      TitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.gif?size=1024",
      SubTitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.webp?",
      Contents: [
        {
          Name: "Active Spam",
          explain:
            ": Daugiau negu 3 emoji iš eilės arba daugiau nei 5 žinutės iš eilės arba daugiau nei vienas codeblock per 5min arba daugiau negu 3 nuotraukos (linkai) per 1min (jei metama pvz: tekstas, emoji ,tekstas tai emoji skaičiuojamas kaip tekstas) (iš eilės reiškia neįsiterpus kitam vartotojui *Botai nelaikomi vartotojais ir jų įsiterpimas neturi reikšmės*",
        },
        {
          Name: "Passive Spam",
          explain:
            ": Daugiau nei 5 tokios pačio turinio žinutės arba su minimaliais pakitimais per 1h *išimtys taikomos eventų metu*",
        },
        { Name: "Gore", explain: "" },
        { Name: "Child Porn", explain: "Vaikų pornografija under 18" },
        { Name: "Doxing", explain: "Privačios informacijos atskleidimas" },
        { Name: "Raiding", explain: "" },
        {
          Name: "Voice Spam",
          explain: "Dažnas prisijungimas/atsijungimas į voice kanalus",
        },
      ],
    },
  ],
  rules: [
    {
      Title: "Discord T.O.S",
      Desc: "Discord taisyklės galioja visuose kanaluose.",
      Color: "FF0000",
      TitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.gif?size=1024",
      SubTitlePicURL:
        "https://cdn.discordapp.com/attachments/903377699819634788/908835950627545169/discordTOS.png",
      Contents: [
        {
          Name: "Doxing",
          explain:
            "Draudžiama atskleisti ir platinti vartotojų privačią ar identifikuojančią informaciją.",
          Punishments: "Ban",
        },
        {
          Name: "Spam",
          explain: "Draudžiamas Active / Passive spam",
          Punishments: "Įspėjimas | Mute",
        },
        {
          Name: "Gore",
          explain: "Draudžiama Gore turinys",
          Punishments: "Mute | Ban",
        },
        {
          Name: "Child pornography",
          explain:
            "Draudžiamas pornografinis turinys susijęs su nepilnamečiais.",
          Punishments: "Mute | Ban",
        },
      ],
    },
    {
      Title: "Lounge  T.O.S",
      Desc: "Lounge taisyklės ir bausmės už jų nesilaikymą, šios taisyklės galioja visuose kanaluose išskyrus kanalus su speciolimis taisyklėmis",
      Color: "00FF00",
      TitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.gif?size=1024",
      SubTitlePicURL:
        "https://cdn.discordapp.com/attachments/903377699819634788/908843709171388446/Lounge.png",
      Contents: [
        {
          Name: "Discord serverių Reklama",
          explain:
            "Draudžiama reklamuoti kitus discord serverius text, voice ar direct messages",
          Punishments: "Ban",
        },
        {
          Name: "Apribojimų apeidinėjimas",
          explain:
            "Draudžiama apeidinėti chat, voice ar kitus apribojimus susikuriant kitą paskyrą ir prisijungiant į serverį. Bausmė priklauso nuo turėtų apribojimų",
          Punishments: "Ban",
        },
        {
          Name: "Profilio nuotrauka",
          explain:
            "Draudžiama naudoti nuotraukas kurios pažeidžia Discord T.O.S ar Lounge T.O.S pvz: gore, porn ir kita...",
          Punishments: "Įspėjimas | Kick | Ban",
        },
        {
          Name: "Vartotojo vardas",
          explain:
            "Draudžiama kopijuoti kitų slapyvardžius / pavadinimus  ar naudoti necenzūrinius žodžius savo slapyvardyje / pavadinime.",
          Punishments: "Įspėjimas | Mute | Kick | Ban",
        },
        {
          Name: "Kanalai",
          explain:
            "Privaloma laikytis nurodytos kanalų paskirties bei taisyklių jei kanalas neturi išimčių jam taikomos bendrosios taisyklės",
          Punishments: "Įspėjimas | Mute | Ban",
        },
      ],
    },
    {
      Title: "Lounge Text kanalų T.O.S",
      Desc: "Taisyklės Teksto kanalams",
      Color: "0000FF",
      TitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.gif?size=1024",
      SubTitlePicURL:
        "https://cdn.discordapp.com/attachments/903377699819634788/908850327132962876/L-txt.png",
      Contents: [
        {
          Name: "Įžeidimai",
          explain:
            "Draudžiama įžeidinėti ar kitaip kenkti kitiems serverio nariams.",
          Punishments: "Įspėjimas | Mute | Ban",
        },
        {
          Name: "Provokacijos",
          explain:
            "Draudžiama provokuoti kitus vartotojus nusižengti taisyklėms.",
          Punishments: "Įspėjimas | Mute | Ban",
        },
        {
          Name: "Grasinimai",
          explain:
            "Draudžiama grasinti susidoroti ar kitaip pakenkti kitam vartotojui.",
          Punishments: "Įspėjimas | Mute | Ban",
        },
        {
          Name: "Pornografija",
          explain:
            "Draudžiama kelti pornografinio ar erotinio turinio nuotraukas.",
          Punishments: "Įspėjimas | Mute",
        },
        {
          Name: "Tag Spam",
          explain: "Draudžiama Taginti vartotoją jei jis to nepageidauja",
          Punishments: "Įspėjimas | Mute | Ban",
        },
        {
          Name: "Kalba",
          explain:
            "Rekomenduojama bendrauti lietuvių kalba, tačiau kitų kalbų įterpimai nėra draudžiami, Bendravimas tik užsienio kalba bus baudžiamas",
          Punishments: "Įspėjimas | Mute",
        },
        {
          Name: "Fake Admin / Mod",
          explain:
            "Draudžiama apsimetinėti Administratoriumi / Moderatoriumi ar atlikti veiksmus skirtus tik jiems pvz: duoti įspėjimus",
          Punishments: "Įspėjimas | Mute",
        },
        {
          Name: "Prekyba Narkotinėmis medžiagomis",
          explain:
            "Draudžiama skelbti jog parduodate ar perkate narkotines medžiagas ar joms vartoti skirtas priemones, diskusijos apie jų poveikius ar patirtis nėra draudžiamos, tačiau negalima kalbėti apie tai kur jas pirkote ar kur tai butu galima padaryti.",
          Punishments: "Įspėjimas | Mute | Ban",
        },
      ],
    },
    {
      Title: "Lounge Voice Kanalų T.O.S",
      Desc: "Taisyklės Voice kanalams ir jų text kanalams, kanalo savininkas gali pasirinkti papildomas taisykles savo kanalams",
      Color: "FF00FF",
      TitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.gif?size=1024",
      SubTitlePicURL:
        "https://cdn.discordapp.com/attachments/903377699819634788/908849204363935775/L-voice.png",
      Contents: [
        {
          Name: "Voice Move spaming",
          explain:
            "Draudžiama greitai keisti voice kanalus ar prisijungti / atsijungti siekiant trugdyti kitiems vartotojams bendrauti.",
          Punishments: "Įspėjimas | LOCK",
        },
      ],
    },
    {
      Title: "Lounge Mods",
      Desc: "Lounge Moderatoriai",
      Color: "0000FF",
      TitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.gif?size=1024",
      SubTitlePicURL:
        "https://cdn.discordapp.com/attachments/903377699819634788/908845353061732442/L-Mods.png",
      Contents: [
        // {
        //   Name: "Pagalba",
        //   explain: "Draudžiama kurti tickets ne pagal paskirtį",
        //   Punishments: "Įspėjimas | SoftBan | LOCK",
        // },
        {
          Name: "False mute",
          explain:
            "Jei nežinote už ką gavote apribojimą, susisiekite su Administracija Priežūra",
          Punishments: "",
        },
        {
          Name: "Mod direct messages",
          explain:
            "Moderatorius gali taikyti serverio taisykles savo dms t.y. jeigu įžeidinėjate moderatorių per dms jis gali jums paskirti mute už įžeidimus ir t.t.",
          Punishments: "",
        },
      ],
    },
    {
      Title: "Papildoma informacija",
      Desc: "Papildoma informacija",
      Color: "0000FF",
      TitlePicURL:
        "https://cdn.discordapp.com/icons/882026297117782056/a_993e66459e17ef699878803f925d779a.gif?size=1024",
      SubTitlePicURL:
        "https://cdn.discordapp.com/attachments/903377699819634788/908849918754578462/L-info.png",
      Contents: [
        {
          Name: "Bausmės",
          explain:
            "Jei taisyklėms nusižengia keli vartotojai tuo pačiu metu bausmė gali būti taikoma tik pirmiesiems pradėjusiems arba tiems kurie po įspėjimo ir toliau nusiženginėjo taisyklėms",
          Punishments: "",
        },
      ],
    },
  ],
};

export default rules_text;
