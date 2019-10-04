require("@babel/polyfill");

const Attribute = require('../../dist/noomman/Attribute');

const TestingFunctions = require('./helpers/TestingFunctions');
const testForError = TestingFunctions.testForError;

describe('Attribute Tests', () => {

    describe('Attribute.constructor()', () => {

        describe('Constructor Validations', () => {

            it('Name is required.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute without a name.';
                const schema = {};

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Name must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with name set to something other than a string.';
                const schema = {
                    name: true
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Type is required.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute without a type.';
                const schema = {
                    name: 'name',
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Type must be a valid type.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with an invalid type. Type must be one of the following: Number,String,Boolean,Date.';
                const schema = {
                    name: 'name',
                    type: true,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('List must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with list set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    type: String,
                    list: 10,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Required must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with required set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    type: String,
                    required: 10,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Unique must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with unique set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    type: String,
                    unique: 0,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Sensitive must be a boolean.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with sensitive set to something other than a boolean.';
                const schema = {
                    name: 'name',
                    type: String,
                    sensitive: 1,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('Mutex must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with mutex set to something other than a string.';
                const schema = {
                    name: 'name',
                    type: String,
                    mutex: true,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

            it('RequiredGroup must be a String.', () => {
                const expectedErrorMessage = 'Attempt to create an attribute with requiredGroup set to something other than a string.';
                const schema = {
                    name: 'name',
                    type: String,
                    requiredGroup: 8,
                };

                testForError('new Attribute()', expectedErrorMessage, () => {
                    new Attribute(schema);
                });
            });

        });

        describe('Constructor Creates an Attribute', () => {

            it('Constructor sets all properties correctly.', () => {
                const schema = {
                    name: 'attribute',
                    type: String,
                    list: true,
                    required: true,
                    unique: true,
                    sensitive: true,
                    mutex: 'a',
                    requiredGroup: 'a',
                }
                const attribute = new Attribute(schema);

                for (const key of Object.keys(schema)) {
                    if (schema[key] !== attribute[key]) 
                        throw new Error('Property ' + key + ' not set on attribute.');
                }

            });

        });

    });

    describe('Attribute.validType()', ()=> {
        
        describe('Attributes Set to Wrong Type Return False', () => {

            describe('Boolean Attributes', () => {

                it('Boolean Attribute Set to Number, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.validType(1) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Boolean Attribute Set to Date, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.validType(new Date()) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Boolean Attribute Set to String, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.validType('') !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Boolean Attribute Set to Object, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.validType({}) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Boolean Attribute Set to undefined, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.validType() !== false) 
                        throw new Error('attribute.validType() returned true.');
                });
            });

            describe('Number Attributes', ()=> {

                it('Number Attribute Set to Boolean, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.validType(false) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Number Attribute Set to Date, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.validType(new Date()) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Number Attribute Set to String, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.validType('') !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Number Attribute Set to Object, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.validType({}) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Number Attribute Set to undefined, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.validType() !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

            });

            describe('String Attributes', () => {

                it('String Attribute Set to Boolean, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.validType(false) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('String Attribute Set to Number, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.validType(1) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('String Attribute Set to Date, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.validType(new Date()) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('String Attribute Set to Object, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.validType({}) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('String Attribute Set to undefined, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.validType() !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

            });

            describe('Date Attributes', ()=> {

                it('Date Attribute Set to Boolean, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.validType(true) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Date Attribute Set to Number, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.validType(1) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Date Attribute Set to String, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.validType('') !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Date Attribute Set to Object, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.validType({}) !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

                it('Date Attribute Set to undefined, returns false.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.validType() !== false) 
                        throw new Error('attribute.validType() returned true.');
                });

            });

        });

        describe('Attributes Set to Correct Type Return True', () => {

            describe('Boolean Attributes', () => {

                it('Boolean Attribute Set to false, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.validType(false) !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

                it('Boolean Attribute Set to true, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.validType(true) !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

                it('Boolean Attribute Set to null, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.validType(null) !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

            });

            describe('Number Attributes', ()=> {

                it('Number Attribute Set to Number, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.validType(1) !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

                it('Number Attribute Set to 0, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.validType(0) !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

                it('Number Attribute Set to null, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.validType(null) !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

            });

            describe('String Attributes', () => {

                it('String Attribute Set to String, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.validType('hello') !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

                it('String Attribute Set to empty string, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.validType('') !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

                it('String Attribute Set to null, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.validType(null) !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

            });

            describe('Date Attributes', ()=> {

                it('Date Attribute Set to Date, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.validType(new Date()) !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

                it('Date Attribute Set to null, returns true.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.validType(null) !== true) 
                        throw new Error('attribute.validType() returned false.');
                });

            });

        });

    });

    describe('Attribute.valid()', () => {

        describe('Non List Attributes', () => {

            describe('Boolean Attributes', () => {

                it('Boolean attribute set to boolean is valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.valid(false) !== true)
                        throw new Error('attribute.valid() returned false.');
                });

                it('Boolean attribute set to null is valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.valid(null) !== true)
                        throw new Error('attribute.valid() returned false.');
                });

                it('Boolean attribute set to string is not valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                    });

                    if (attribute.valid('false') !== false)
                        throw new Error('attribute.valid() returned true.');
                });

            });

            describe('Number Attributes', () => {

                it('Number attribute set to number is valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.valid(0) !== true)
                        throw new Error('attribute.valid() returned false.');
                });

                it('Number attribute set to null is valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.valid(null) !== true)
                        throw new Error('attribute.valid() returned false.');
                });

                it('Number attribute set to boolean is not valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                    });

                    if (attribute.valid(true) !== false)
                        throw new Error('attribute.valid() returned true.');
                });

            });

            describe('String Attributes', () => {

                it('String attribute set to string is valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.valid('') !== true)
                        throw new Error('attribute.valid() returned false.');
                });

                it('String attribute set to null is valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.valid(null) !== true)
                        throw new Error('attribute.valid() returned false.');
                });

                it('String attribute set to boolean is not valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                    });

                    if (attribute.valid(true) !== false)
                        throw new Error('attribute.valid() returned true.');
                });

            });

            describe('Date Attributes', () => {

                it('Date attribute set to date is valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.valid(new Date()) !== true)
                        throw new Error('attribute.valid() returned false.');
                });

                it('Date attribute set to null is valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.valid(null) !== true)
                        throw new Error('attribute.valid() returned false.');
                });

                it('Date attribute set to boolean is not valid.', () => {
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                    });

                    if (attribute.valid(true) !== false)
                        throw new Error('attribute.valid() returned true.');
                });

            });

        });

        describe('List Attributes', () => {

            describe('Boolean List Attributes', () => {

                it('Boolean List Attribute set to null returns false.', () => {
                    const value = null;
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Boolean List Attribute set to undefined returns false.', () => {
                    const value = undefined;
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Boolean List Attribute containing number returns false.', () => {
                    const value = [false, true, 0];
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Boolean List Attribute set to empty array returns true.', () => {
                    const value = [];
                    const expected = true;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Boolean List Attribute set to array of booleans returns true.', () => {
                    const value = [true, false, null];
                    const expected = true;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Boolean,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

            });

            describe('Number List Attributes', () => {

                it('Number List Attribute set to null returns false.', () => {
                    const value = null;
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Number List Attribute set to undefined returns false.', () => {
                    const value = undefined;
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Number List Attribute containing boolean returns false.', () => {
                    const value = [1, 2, true];
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Number List Attribute set to empty array returns true.', () => {
                    const value = [];
                    const expected = true;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Number List Attribute set to array of numbers returns true.', () => {
                    const value = [1, 2, null, 4];
                    const expected = true;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Number,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

            });

            describe('String List Attributes', () => {

                it('String List Attribute set to null returns false.', () => {
                    const value = null;
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('String List Attribute set to undefined returns false.', () => {
                    const value = undefined;
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('String List Attribute containing number returns false.', () => {
                    const value = ['1', '2', 3];
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('String List Attribute set to empty array returns true.', () => {
                    const value = [];
                    const expected = true;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('String List Attribute set to array of strings returns true.', () => {
                    const value = ['1', 'true', '2018-01-01'];
                    const expected = true;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: String,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

            });

            describe('Date List Attributes', () => {

                it('Date List Attribute set to null returns false.', () => {
                    const value = null;
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Date List Attribute set to undefined returns false.', () => {
                    const value = undefined;
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Date List Attribute containing number returns false.', () => {
                    const value = [new Date(), 12498309814];
                    const expected = false;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Date List Attribute set to empty array returns true.', () => {
                    const value = [];
                    const expected = true;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

                it('Date List Attribute set to array of dates returns true.', () => {
                    const value = [new Date(), new Date('1010-02-13'), null];
                    const expected = true;
                    const attribute = new Attribute({
                        name: 'attribute',
                        type: Date,
                        list: true,
                    });

                    if (attribute.valid(value) !== expected)
                        throw new Error('attribute.value() did not return ' + expected);
                });

            });

        });

    });

});
