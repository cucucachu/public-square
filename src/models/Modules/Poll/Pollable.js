/* 
 Class Model: Pollable
 Description: An abstract super class which with a relationship to a Poll. 
 Sub Classes: 
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const Pollable = new ClassModel({
    className: 'Pollable',
    abstract: true,
    relationships: [
        {
            name: 'poll',
            toClass: 'Poll',
            mirrorRelationship: 'pollable',
            singular: true,
            required: true,
        }
    ],
});

module.exports = Pollable;