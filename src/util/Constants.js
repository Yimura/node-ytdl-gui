export const DownloadTypes = [
    {
        mime: 'video/mp4',
        type: 'highest',
        ext: '.mp4'
    },
    {
        mime: 'video/mp4',
        type: 'lowest',
        ext: '.mp4'
    },
    {
        mime: 'audio/mpeg',
        type: 'highestaudio',
        ext: '.mp3'
    }
];

export const HttpResponseCodes = {
    400: {
        status: 400,
        statusText: '400 Bad Request',
        message: 'The server could not understand the request due to invalid syntax of the URL or certain HEADERS were missing.'
    },
    401: {
        status: 401,
        statusText: '401 Unauthorized',
        message: 'The client failed to authenticate.'
    },
    403: {
        status: 403,
        statusText: '403 Forbidden',
        message: 'The client does not have access rights to the content.'
    },
    406: {
        status: 406,
        statusText: '406 Not Acceptable',
        message: 'After Processing the Request Body the server did not find the content that was needed to complete the request.'
    },
    413: {
        status: 413,
        statusText: '413 Payload Too Large',
        message: 'Request entity is larger than limits defined by server.'
    }
};

export const reduceFun = (accum, value) => {
    if (accum !== '') accum += ',';
	return accum + value;
};
