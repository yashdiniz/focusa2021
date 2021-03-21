/**
 * Experimenting alleviation of cyclical dependencies.
 * Using dependency injection.
 * Reference: https://stackoverflow.com/a/62487603
 */
const CourseType = require('./CourseType');
const PostType = require('./PostType');
const ProfileType = require('./ProfileType');
const RoleType = require('./RoleType');
const UserType = require('./UserType');

module.exports = {
    CourseType, PostType, ProfileType, RoleType, UserType,
};