/* 
 Class Model: Executive Vote Option
 Discriminator Super Class: Vote Definition
 Description: Represents a possible vote for a Executive Action. Because voting can be more than a simple 'Yay' or 'Nay', this class captures 
    all the posible properties of a vote, such as, does the vote count as positive or negative, does it count toward the total number of votes
    cast, etc.

 1 Way Relationships Targeting this Class: Individual Executive Vote has one Executive Vote Option
*/

const noomman = require('noomman');
const ClassModel = noomman.ClassModel;

const VoteOption = require('../VoteOption');

const ExecutiveVoteOption = new ClassModel({
	className: 'ExecutiveVoteOption',
	superClasses: [VoteOption],
	useSuperClassCollection: true,
});

module.exports = ExecutiveVoteOption;
