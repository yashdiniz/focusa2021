/**
 * Experimenting alleviation of cyclical dependencies.
 * Using dependency injection.
 * Reference: https://stackoverflow.com/a/62487603
 */
const types = {};
types.CourseType = require('./CourseType');
types.PostType = require('./PostType');
types.ProfileType = require('./ProfileType');
types.RoleType = require('./RoleType');
types.UserType = require('./UserType');

module.export = types;