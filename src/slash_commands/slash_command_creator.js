const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { json } = require('node:stream/consumers');
const {physical, magic} = require(path.join(__dirname, '..', 'functions','table_data.js'));


async function slashBuilder(commandName, callback, main_key = true){
    
    try {

        let equip_names = await callback();

        if("main" in equip_names && "primary" in equip_names) {

            
            if(main_key === true){

                const equip_names_new = equip_names.main;
                 equip_names = equip_names_new;
                
            } else {

                const equip_names_new = equip_names.primary
                equip_names = equip_names_new;

            }

        }
            // const equip_names_new = (equip_names.main * (main_key === true)) +
            //     (equip_names.primary * (main_key !== true));


        const slash_command = new SlashCommandBuilder()
            .setName(commandName)
            .setDescription(`Get information about a piece of ${commandName}`)

        equip_names.forEach(obj => {
            
            if (typeof obj['Name'] !== 'string' || obj['Name'].trim().length === 0) {

                console.warn(`[WARNING]: Skipping invalid name found in database: '${obj['Name']}'.`);
                return null;
            }
            
            // Step 1: Ensure name is a string and handle non-string values
            const nameAsString = String(obj['Name']);
            
            // Step 2: Replace spaces with hyphens to create a valid command name
            const commandName = nameAsString.toLowerCase().replace(/\s+/g, '-');
            
            // Step 3: Trim any extra hyphens and handle special characters
            const nameHyphen = commandName.replace(/[^a-z0-9-]/g, '');

            // Step 4: Ensure the command name is not too long and does not contain consecutive hyphens
            const cleanedName = nameHyphen.replace(/--+/g, '-');

            // Step 5: Truncate to 32 characters
            const finalCommandName = cleanedName.substring(0, 32);

            const mainDescription = `A command for ${obj['Name']}`; // Description text

            // Step 6: Truncate description to 100 characters if necessary
            const finalMainDescription = mainDescription.length > 100 
                ? mainDescription.substring(0, 97) + '...'
                : mainDescription;

            if (!finalCommandName) {
                console.warn(`[WARNING]: Skipping name: "${obj['Name']}" resulted in an empty command name after processing.`);
                return null;
            }

            // console.log(finalCommandName, finalMainDescription)
            

            slash_command.addSubcommand(sub =>
                sub
                .setName(finalCommandName)
                .setDescription(finalMainDescription)
                // .addStringOption(option =>
                //     option  
                //     .setName('Passive')
                //     .setDescription('Passive of the item')
                //     .setRequired(false)
                // )
                
            );

            // console.log(slash_command)

        });

        // console.log(slash_command.length);

        if (slash_command.length === 0) {

            console.log('No valid commands to deploy.');
            return;

        }

        return slash_command;
        
    } catch (error) {
        console.log(`there was an error: ${error}`);
    }

};

// (async () => {

//     const physical_obj = await slashBuilder('physical-equipment',true, magic);
//     console.log(physical_obj);

// })();


module.exports = { slashBuilder };