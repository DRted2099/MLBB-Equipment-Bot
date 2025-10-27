const { Client, Events, GatewayIntentBits, IntentsBitField, EmbedBuilder } = require('discord.js');
const path = require('node:path');
require('dotenv').config(path.join(__dirname,"..",".env"));

const { getEquipment } = require(path.join(__dirname,'functions','cache.js'));


const token = process.env.TOKEN;

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('clientReady', (c) => {
    console.log(`✅ ${c.user.tag} is online`);
})

client.on('interactionCreate', async (interaction) => {
    
    if(!interaction.isChatInputCommand) return;
    
    // console.log(interaction.commandName);

    try {
        
        await interaction.deferReply();

        //Every character thats not a letter or a number is removed from the string
        // the '/[]/' is the regex
        // '^' like the 'not' operator
        // 'a-z' all lower case 
        // '0-9' all numbers
        // 'g' for global, Regex stops at the first match, g makes it continue
        // 'i' for case-insensitive treats lower and uppercase the same

        const cleanString = str => str.replace(/[^a-z0-9]/gi, '').toLowerCase();

        const command_name = interaction.commandName // The main command name ie; 'physical_main', 'magic'
        const sub_name = interaction.options.getSubcommand(); //sub command ie; 'berserkers fury'

        let equipment_type = await getEquipment(command_name);
        
        if(command_name.includes("_main")){

            const equip = equipment_type.main;
            equipment_type = equip;

        } else if (command_name.includes("_primary")) {

            const equip = equipment_type.primary;
            equipment_type = equip;

        }

        const user_equipment = equipment_type.find((equipment) => {

            if (cleanString(equipment['Name']) === cleanString(sub_name)) {

                return equipment;
                
            }
        })

        const embed = new EmbedBuilder()
            .setThumbnail(user_equipment['Image'])
            .setTitle(sub_name)
            .setColor('Random')
            .addFields(
                {name: 'Unique Passive', value: `${user_equipment['Passive_Desc'].replace(/Unique/gi, "\n Unique")}`},
                // {name: '\u200B', value: '\u200B' }, // Blank field for spacing
                {name: 'Cost', value: `${user_equipment['Cost']}` },
                // {name: '\u200B', value: '\u200B' }, // Blank field for spacing
                {name: 'Stas', value: `${user_equipment['Stat']}`},
            )
        
        
        await interaction.followUp({ embeds: [embed] }); //can use .editReply() as well

        // returns a reply with the description, cost, and stat of the equipment
        // await interaction.editReply(
        // `Equipment: ${sub_name}\nEquipment Passive: ${user_equipment['Passive_Desc']}\nCost: ${ user_equipment['Cost']}\nStats: ${ user_equipment['Stat']}`
        // );
       


    } catch (error) {

        console.error('Error fetching equipment:', error);
        return interaction.editReply('There was an error while fetching the equipment information.');

    }       

});

client.login(token);