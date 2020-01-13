const noomman = require('noomman');
const ClassModel = noomman.ClassModel;
const MiraClassModel = require('../../src/models/MiraClassModel');

const AllAttributesClass = new ClassModel({
    className: 'AllAttributesClass',
    superClasses: [MiraClassModel],
    attributes: [
        {
            name: 'string',
            type: String,
        },
        {
            name: 'boolean',
            type: Boolean,
        },
        {
            name: 'number',
            type: Number,
        },
        {
            name: 'date',
            type: Date,
        },
        {
            name: 'strings',
            type: String,
            list: true,
        },
        {
            name: 'booleans',
            type: Boolean,
            list: true,
        },
        {
            name: 'numbers',
            type: Number,
            list: true,
        },
        {
            name: 'dates',
            type: Date,
            list: true,
        },
    ],
    nonStaticMethods: {
        displayAs: function() {
            return this.number + ' ' + this.string + ' ' + this.boolean;
        }
    }
});

const TreeClass = new ClassModel({
    className: 'TreeClass',
    superClasses: [MiraClassModel],
    attributes: [
        {
            name: 'name',
            type: String,
        },
    ],
    relationships: [
        {
            name: 'parent',
            toClass: 'TreeClass',
            mirrorRelationship: 'children',
            singular: true,
        },
        {
            name: 'children',
            toClass: 'TreeClass',
            mirrorRelationship: 'parent',
            singular: false,
        },
    ],
})

module.exports = {
    AllAttributesClass,
    TreeClass,
}