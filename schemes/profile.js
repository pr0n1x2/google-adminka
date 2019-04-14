const profileJsonSchema = {
    'title': 'Person',
    'description': 'Person profile',
    'type': 'object',
    'properties': {
        'name': {
            'description': 'User name',
            'type': 'string',
            'minLength': 2,
            'maxLength': 40
        },
        'surname': {
            'description': 'User surname',
            'type': 'string',
            "minLength": 2,
            'maxLength': 40
        },
        'email': {
            'description': 'User E-mail',
            'type': 'string',
            // Источник: https://json-schema.org/understanding-json-schema/reference/string.html#format
            'format': 'email'
        },
        'phone': {
            'description': 'User phone',
            'type': 'string',
            // Источник: https://json-schema.org/understanding-json-schema/reference/regular_expressions.html
            "pattern": "^\\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$"
        },
        'countryId': {
            'description': 'User country',
            'type': 'string',
        },
        'birthday': {
            'description': 'User birthday',
            'type': 'string',
            // Источник: https://json-schema.org/understanding-json-schema/reference/string.html#format
            'oneOf': [
                { 'enum': [ '' ] },
                { 'format': 'date' }
            ]
        },
        'aboutMe': {
            'description': 'About Me',
            'type': 'string',
        }
    },
    'required': ['name', 'surname', 'email', 'phone']
};

module.exports = profileJsonSchema;