'use-strict';

var assert = require('assert');
var expect = require('expect');
var promiseFinally = require('promise.prototype.finally');

var ClassModel = require('../dist/models/ClassModel');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


promiseFinally.shim();

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error.message);
});

describe('Class Model Tests', function() {

    describe('Class Model Constructor', function() {

        it('Constructor excepts and sets parameters.', function() {
            console.log(ClassModel);

            var schema = {
                text: {
                    type: String,
                    required: true
                },
                singularRelationship: {
                    type: Schema.Types.ObjectId,
                    ref: 'OtherClass',
                    required: true
                },
                nonSingularRelationship: {
                    type: [Schema.Types.ObjectId],
                    ref: 'OtherClass'
                }
            }

            var classModel = new ClassModel({
                className: 'FakeClass',
                schema: schema
            });

            if (classModel.className != 'FakeClass')
                return false;
            if (classModel.schema != schema)
                return false;
            return true;
        });

    });

});