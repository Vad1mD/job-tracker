'use strict';

const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const HTTP_STATUS_MESSAGES = {
    OK: 'OK',
    CREATED: 'Created',
    BAD_REQUEST: 'Bad Request',
    NOT_FOUND: 'Not Found',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    JOB_NAME_REQUIRED: 'Job name is required',
    ARGUMENTS_MUST_BE_AN_ARRAY: 'Arguments must be an array'
};

module.exports = {
    HTTP_STATUS_CODES,
    HTTP_STATUS_MESSAGES
};