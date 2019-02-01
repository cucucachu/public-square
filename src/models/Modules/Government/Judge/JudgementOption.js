/* 
 Class Model
 Model: Judgement Option
 Discriminated Super Class: Vote Option
 Description: Represents a possible judgement for a Judicial Case. Because outcomes can be more than a simple 'Yay' or 'Nay', this class 
    captures all the posible properties of a judgement, such as, does the judgement count as positive or negative, does it count
    toward the total number of judgements cast, etc.

 1 Way Relationships Targeting this Class: Individual Judgement has one Judgement Option
*/

// MongoDB and Mongoose Setup
var ClassModel = require('../../../ClassModel');

var VoteOption = require('../VoteOption');

var JudgementOption = new ClassModel({
	className: 'JudgementOption',
	discriminatorSuperClass: VoteOption,
	schema: {}
});

module.exports = JudgementOption;
