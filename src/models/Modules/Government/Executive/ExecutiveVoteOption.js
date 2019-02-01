/* 
 Class Model
 Model: Executive Vote Option
 Discriminator Super Class: Vote Definition
 Description: Represents a possible vote for a Executive Action. Because voting can be more than a simple 'Yay' or 'Nay', this class captures 
    all the posible properties of a vote, such as, does the vote count as positive or negative, does it count toward the total number of votes
    cast, etc.

 1 Way Relationships Targeting this Class: Individual Executive Vote has one Executive Vote Option
*/

// MongoDB and Mongoose Setup
var ClassModel = require('../../../ClassModel');

var VoteOption = require('../VoteOption');

var ExecutiveVoteOption = new ClassModel({
	className: 'ExecutiveVote',
	discriminatorSuperClass: VoteOption,
	schema: {}
});

module.exports = ExecutiveVoteOption;
