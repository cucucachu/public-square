/*
 Module: Government
 Description: Groups the classes that describe the Government.
 Sub Modules: Appointment, Election, Nomination, Executive, Judge, Legislator 
*/

// SuperClasses
require('./VoteOption');
require('./GovernmentRole');
require('./PositionAcquisitionProcess');

// Classes
require('./EffectivePositionDefinition');
require('./Government');
require('./GovernmentInstitution');
require('./GovernmentOfficial');
require('./GovernmentPosition');
require('./GovernmentPower');
require('./Law');
require('./OccupiedPosition');
require('./PositionDefinition');
require('./TermDefinition');

// Sub Modules
require('./Appointment/AppointmentModule');
require('./Election/ElectionModule');
require('./Executive/ExecutiveModule');
require('./Judge/JudgeModule');
require('./Legislator/LegislatorModule');
require('./Nomination/NominationModule');