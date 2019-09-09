/* 
 Class Model
 Model: Confirmation Vote Option
 Discriminated Super Class: Vote Option
 Description: Represents a possible vote for a Nomination (or something else a legislature could vote on). Because voting can be more than a simple
    'Yay' or 'Nay', this class captures all the posible properties of a vote, such as, does the vote count as positive or negative, does it count
    toward the total number of votes cast, etc.

 1 Way Relationships Targeting this Class: Individual Confirmation Vote has one Confirmation Vote Option
*/

// MongoDB and Mongoose Setup
var ClassModel = require('../../../ClassModel');

var VoteOption = require('../VoteOption');

var ConfirmationVoteOption = new ClassModel({
	className: 'ConfirmationVoteOption',
	accessControlled: false,
	updateControlled: false,
	discriminatorSuperClass: VoteOption,
	schema: {}
});

module.exports = ConfirmationVoteOption;
