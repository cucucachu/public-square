/* 
 Class Model: Judgement Option
 Discriminated Super Class: Vote Option
 Description: Represents a possible judgement for a Judicial Case. Because outcomes can be more than a simple 'Yay' or 'Nay', this class 
    captures all the posible properties of a judgement, such as, does the judgement count as positive or negative, does it count
    toward the total number of judgements cast, etc.

 1 Way Relationships Targeting this Class: Individual Judgement has one Judgement Option
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const VoteOption = require('../VoteOption');

const JudgementOption = new ClassModel({
	className: 'JudgementOption',
	superClasses: [VoteOption],
	useSuperClassCollection: true,
});

module.exports = JudgementOption;
