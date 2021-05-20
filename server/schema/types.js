/*
 * Experimenting alleviation of cyclical dependencies.
 * Using dependency injection.
 * Reference: https://stackoverflow.com/a/62487603
*/
const { AuthenticationError, ForbiddenError, UserInputError,  } = require('apollo-server');

const CourseType = require('./CourseType');
const PostType = require('./PostType');
const ProfileType = require('./ProfileType');
const RoleType = require('./RoleType');
const UserType = require('./UserType');

const onError = (axiosError) => {
    const status = axiosError.response?.status;
    switch(status) {
        case 401:
        case 407: throw new AuthenticationError('User not authenticated. Refresh your session!');
        case 403: throw new ForbiddenError('Operation not allowed. What are you doing here?');
        case 404: throw new UserInputError('Invalid arguments.', {
            data: axiosError.response?.data,
            params: axiosError.config?.params,
        });
        default: {
            console.error(new Date(), axiosError);
            throw axiosError;  // also throw the error to the frontend.
        }
    }
}

module.exports = {
    CourseType, PostType, ProfileType, RoleType, UserType, onError
};