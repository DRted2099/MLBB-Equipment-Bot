const path = require('node:path');
const { physical, magic, defense, jungle, roam, movement, special, adaptive } = require(path.join(__dirname, 'table_data.js'));

const lastCallCache = {

  lastFunc: null,
  lastResult: null,

};

// Returns only Promises

function getEquipment(type) {

     // only calls the tables we need 
    const equipment_types = {

        'physical_main': physical, 'physical_primary': physical,
        'magic_main': magic, 'magic_primary': magic,
        'defense_main': defense, 'defense_primary': defense,
        'jungle': jungle,
        'roam': roam,
        'movement_main': movement, 'movement_primary': movement,
        'special': special,
        'adaptive_main': adaptive, 'adaptive_primary': adaptive

    };

    // Check if the data is cached
    // console.log(equipment_types[type](), lastCallCache.lastFunc)

    if(lastCallCache.lastFunc === equipment_types[type]) {

        console.log(`Using cached data for ${type} equipment`);
        return lastCallCache.lastResult;
    }

    console.log(`loading ${type} equipment data...`);

    // If not loading and cacheing data
    
    const result = equipment_types[type]();

    lastCallCache.lastFunc =  equipment_types[type];
    lastCallCache.lastResult = result;

    return result;
    
}

module.exports = {getEquipment}