/* 
 * noomman.js
 * The main file for noomman. Imports and exports all portions of noomman which 
 *    should be made available to users of this library. Noomman code should be 
 *    required through this file, rather than individually, except by internal 
 *    noomman files.
 */ 

const ClassModel = require('./ClassModel');
const Instance = require('./Instance');
const InstanceSet = require('./InstanceSet');
const NoommanErrors = require('./NoommanErrors');
const database = require('./database');

module.exports = {
    ClassModel,
    Instance,
    InstanceSet,
    NoommanErrors,
    connect: database.connect,
    close: database.close,
	connected: database.connected,
	ObjectId: database.ObjectId,
    ObjectIdFromHexString: database.ObjectIdFromHexString,
}