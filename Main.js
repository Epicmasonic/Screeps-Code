var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleStocker = require('role.stocker');

module.exports.loop = function () {
    
    console.log('===== NEXT TICK =====');
    console.log('Tick number: ' + Game.time);

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    // Make babys
    console.log('----- Creeps -----');
    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);
    
     if(builders.length < 3) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([MOVE,CARRY,WORK,CARRY,MOVE,WORK], newName, 
            {memory: {role: 'builder'}});
    }
    
    var stockers = _.filter(Game.creeps, (creep) => creep.memory.role == 'stocker');
    console.log('Stockers: ' + stockers.length);
    
     if(stockers.length < 1) {
        var newName = 'Stocker' + Game.time;
        console.log('Spawning new stocker: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([MOVE,CARRY,WORK], newName, 
            {memory: {role: 'stocker'}});
    }
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);
    
     if(upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([MOVE,CARRY,CARRY,MOVE,WORK], newName, 
            {memory: {role: 'upgrader'}});
    }
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([CARRY,MOVE,WORK], newName, 
            {memory: {role: 'harvester'}});
    }
    
    // End of babys
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

var tower = Game.getObjectById('61660ce68ebb6595d45b5055');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'stocker') {
            roleStocker.run(creep);
        }
    }
    
    console.log('----- Energy -----');
    
    const extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    console.log('Extensions available: ' + extensions.length);
    console.log('Max energy: ' + (extensions.length * 50 + 300));
}
