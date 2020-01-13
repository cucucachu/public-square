/* 
 * MiraClassModel
 * Super class model that each noomman ClassModel should have in order to work with mira.
 * Contains methods used by mira.
 */

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const MiraClassModel = new ClassModel({
    className: 'MiraClassModel',
    abstract: true,
    nonStaticMethods: {
        displayAs,
    },
});

function displayAs() {
    return this.classModel.className + ': ' + this.id;
}

module.exports = MiraClassModel;