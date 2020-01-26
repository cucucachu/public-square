/*
 Module: Geography
 Description: Groups the classes that define Geographic Areas and Addresses. 
*/

// Classes
const Address = require('./Address');
const GeographicArea = require('./GeographicArea');
const GeographicMap = require('./GeographicMap');
const MapType = require('./MapType');

module.exports = {
    Address,
    GeographicMap,
    GeographicArea,
    MapType,
}