const noomman = require('noomman');
const Instance = noomman.Instance;

const MiraClassModel = require('../src/models/MiraClassModel');
const MiraClassModels = require('./helpers/MiraClassModels');
const TreeClass = MiraClassModels.TreeClass;
const AllAttributesClass = MiraClassModels.AllAttributesClass;

describe('ClassModel - MiraClassModel', () => {

    describe('displayAs()', () => {

        it('Default value of "className: id" for ClassModels that do not override displayAs() method.', () => {
            const instance = new Instance(TreeClass);

            if (instance.displayAs() !== instance.classModel.className + ': ' + instance.id) {
                throw new Error('Default displayAs() is incorrect.');
            }
        });

        it('displayAs() can be overridden.', () => {
            const instance = new Instance(AllAttributesClass);
            instance.assign({
                number: 1,
                string: 'string',
                boolean: true,
            });

            if (instance.displayAs() !== '1 string true') {
                throw new Error('displayAs() is not as expected.');
            }

        });

    });
});
