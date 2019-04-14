const loginJsonSchema = {
    'title': 'Login',
    'description': 'Authorization on the site',
    'type': 'object',
    'properties': {
        'email': {
            'description': 'User E-mail',
            'type': 'string',
            // Источник: https://json-schema.org/understanding-json-schema/reference/string.html#format
            'format': 'email'
        },
        'password': {
            'description': 'User password',
            'type': 'string',
            "minLength": 6
        },
    },
    'required': ['email', 'password']
};

module.exports = loginJsonSchema;