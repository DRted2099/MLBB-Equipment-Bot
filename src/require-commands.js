const {REST, Routes, SlashCommandBuilder} = require('discord.js');
const path = require('node:path');
const fs = require("node:fs");
const { physical, magic, defense, jungle, roam, movement, special, adaptive, dbPool } = require(path.join(__dirname, 'functions', 'table_data.js'));
const { slashBuilder } = require(path.join(__dirname, 'slash_commands', 'slash_command_creator.js'));
require('dotenv').config();

const rest = new REST({ version: 10}).setToken(process.env.TOKEN);

(async () => {
    try {

        const 
        [
        physical_obj_main, physical_obj_primary,
        magic_obj_main, magic_obj_primary,
        def_main, def_primary,
        jungle_obj,
        roam_obj,
        movement_main, movement_primary,
        special_obj,
        adaptive_main, adaptive_primary
        ] = 
        await Promise.all([
            
            slashBuilder('physical_main', physical), 
            slashBuilder('physical_primary', physical, false),
            slashBuilder('magic_main', magic), 
            slashBuilder('magic_primary', magic, false),
            slashBuilder('defense_main', defense), 
            slashBuilder('defense_primary', defense, false),
            slashBuilder('jungle', jungle),
            slashBuilder('roam', roam),
            slashBuilder('movement_main', movement), 
            slashBuilder('movement_primary', movement, false),
            slashBuilder('special', special),
            slashBuilder('adaptive_main', adaptive), 
            slashBuilder('adaptive_primary', adaptive, false)
        ])
        // const physical_obj_main = await slashBuilder('physical_main', physical);
        // const physical_obj_primary = await slashBuilder('physical_primary', physical, false);

        // const magic_obj_main = await slashBuilder('magic_main', magic);
        // const magic_obj_primary = await slashBuilder('magic_primary', magic, false);

        // const def_main = await slashBuilder('defense_main', defense);
        // const def_primary = await slashBuilder('defense_primary', defense, false);

        // const jungle_obj = await slashBuilder('jungle', jungle);

        // const roam_obj = await slashBuilder('roam', roam);

        // const movement_main = await slashBuilder('movement_main', movement);
        // const movement_primary = await slashBuilder('movement_primary', movement, false);

        // const special_obj = await slashBuilder('special', special);

        // const adaptive_main = await slashBuilder('adaptive_main', adaptive);
        // const adaptive_primary = await slashBuilder('adaptive_primary', adaptive, false);


        console.log('registering slash commands....');

        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.GUILD_ID,
            ),

            {body: [
                physical_obj_main.toJSON(), physical_obj_primary.toJSON(), 
                magic_obj_main.toJSON(), magic_obj_primary.toJSON(),
                def_main.toJSON(), def_primary.toJSON(),
                jungle_obj.toJSON(),
                roam_obj.toJSON(),
                movement_main.toJSON(), movement_primary.toJSON(),
                special_obj.toJSON(),
                adaptive_main.toJSON(), adaptive_primary.toJSON()
            ],}
        )

        console.log('slash commands registered successfully!');
        await dbPool.end();
        
    } catch (error) {
        console.log(`there was an error: ${error}`);
    }

})();