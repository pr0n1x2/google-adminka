const passwordJsonSchema = {
    'title': 'User',
    'description': 'User password',
    'type': 'object',
    'properties': {
        'password': {
            'description': 'User password',
            'type': 'string',
            "minLength": 6
        },
        'passwordRetype': {
            'description': 'User password',
            'type': 'string',
            'minLength': 6,
            'const': {
                "$data": "1/password"
            },
        }
    },
    'required': ['password', 'passwordRetype']
};

module.exports = passwordJsonSchema;