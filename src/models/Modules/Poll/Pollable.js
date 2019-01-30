/* 
 Class Model
 Model: Pollable
 Description: An abstract super class which with a relationship to a Poll. 
 Sub Classes: 
*/

// MongoDB and Mongoose Setup
var mongoose = require('mongoose');
var ClassModel = require('../../ClassModel');
var Schema = mongoose.Schema;
var ClassModel = require('../../ClassModel');

var Pollable = new ClassModel({
    className: 'Pollable',
    abstract: true,
    schema: {
        poll: {
            type: Schema.Types.ObjectId,
            ref: 'Poll',
            required: true
        }
    }
});

module.exports = Pollable;