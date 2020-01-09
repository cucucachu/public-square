const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const AllAttributesClass = new ClassModel({
    className: 'AllAttributesClass',
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
    ]
});

const TreeClass = new ClassModel({
    className: 'TreeClass',
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