import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

    const spec = {
        openapi: '3.0.0',

        info: {
            title: 'Bubbly Maps API',
            version: 'v6',
            description: 'API for Bubbly Maps - a community-driven water fountain and bubbler mapping platform',
            contact: {
                name: 'Linus Kang',
                email: 'linus@kang.software'
            },
            license: {
                name: 'CC BY-NC 4.0',
                url: 'https://creativecommons.org/licenses/by-nc/4.0/'
            }
        },

        servers: [
            {
                url: '/',
                description: 'Current server'
            }
        ],

        tags: [
            {
                name: 'General',
                description: 'General API information and documentation'
            },
            {
                name: 'Auth',
                description: 'Authentication related endpoints (NextAuth.js)'
            },
            {
                name: 'Account',
                description: 'Current user account management'
            },
            {
                name: 'Users',
                description: 'User profile endpoints'
            },
            {
                name: 'Waypoints',
                description: 'Water fountain/bubbler waypoint management'
            },
            {
                name: 'Reviews',
                description: 'Waypoint review management'
            },
            {
                name: 'Bounding Boxes',
                description: 'Geographic bounding box management'
            },
            {
                name: 'Stats',
                description: 'Platform statistics'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    description: 'API token authentication (Bearer token)'
                },
                sessionAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'next-auth.session-token',
                    description: 'NextAuth.js session cookie authentication'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: { type: 'string', description: 'Error message' }
                    },
                    required: ['success', 'error']
                },
                AppInfo: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        version: { type: 'string', description: 'Application version' },
                        api: { type: 'string', description: 'API version' },
                        license: { type: 'string', example: 'CC BY-NC 4.0' },
                        author: { type: 'string', example: 'Linus Kang (mail@linus.id.au)' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'User ID' },
                        username: { type: 'string', description: 'User handle/username' },
                        displayName: { type: 'string', description: 'Display name' },
                        handle: { type: 'string', description: 'User handle' },
                        bio: { type: 'string', nullable: true, description: 'User biography' },
                        image: { type: 'string', nullable: true, description: 'Profile image URL' },
                        xp: { type: 'integer', description: 'User experience points' },
                        verified: { type: 'boolean', description: 'Whether user is verified' },
                        moderator: { type: 'boolean', description: 'Whether user is a moderator' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                UserSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        displayName: { type: 'string' }
                    }
                },
                Waypoint: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Waypoint ID' },
                        name: { type: 'string', description: 'Waypoint name' },
                        latitude: { type: 'number', format: 'double', minimum: -90, maximum: 90 },
                        longitude: { type: 'number', format: 'double', minimum: -180, maximum: 180 },
                        description: { type: 'string', nullable: true },
                        amenities: { type: 'array', items: { type: 'string' } },
                        image: { type: 'string', nullable: true, description: 'Image URL' },
                        maintainer: { type: 'string', nullable: true },
                        region: { type: 'string', nullable: true },
                        verified: { type: 'boolean' },
                        approved: { type: 'boolean' },
                        addedByUserId: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                WaypointSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        latitude: { type: 'number', format: 'double' },
                        longitude: { type: 'number', format: 'double' }
                    }
                },
                WaypointInput: {
                    type: 'object',
                    required: ['name', 'latitude', 'longitude'],
                    properties: {
                        name: { type: 'string', description: 'Waypoint name' },
                        latitude: { type: 'number', format: 'double', minimum: -90, maximum: 90 },
                        longitude: { type: 'number', format: 'double', minimum: -180, maximum: 180 },
                        description: { type: 'string' },
                        amenities: { type: 'array', items: { type: 'string' } },
                        image: { type: 'string', description: 'Image URL' },
                        maintainer: { type: 'string' },
                        region: { type: 'string' }
                    }
                },
                WaypointUpdate: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        latitude: { type: 'number', format: 'double', minimum: -90, maximum: 90 },
                        longitude: { type: 'number', format: 'double', minimum: -180, maximum: 180 },
                        description: { type: 'string' },
                        amenities: { type: 'array', items: { type: 'string' } },
                        image: { type: 'string' },
                        maintainer: { type: 'string' },
                        region: { type: 'string' }
                    }
                },
                WaypointLog: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        bubblerId: { type: 'integer' },
                        userId: { type: 'string', nullable: true },
                        action: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE'] },
                        oldData: { type: 'object', nullable: true },
                        newData: { type: 'object', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        user: { $ref: '#/components/schemas/UserSummary' }
                    }
                },
                Review: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        bubblerId: { type: 'integer' },
                        userId: { type: 'string' },
                        rating: { type: 'integer', minimum: 1, maximum: 5 },
                        comment: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                handle: { type: 'string' },
                                displayName: { type: 'string' },
                                image: { type: 'string' },
                                verified: { type: 'boolean' },
                                moderator: { type: 'boolean' }
                            }
                        }
                    }
                },
                ReviewInput: {
                    type: 'object',
                    required: ['bubblerId', 'rating'],
                    properties: {
                        bubblerId: { type: 'integer', description: 'Waypoint/bubbler ID' },
                        rating: { type: 'integer', minimum: 1, maximum: 5 },
                        comment: { type: 'string' }
                    }
                },
                BoundingBox: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        color: { type: 'string', nullable: true },
                        coordinates: {
                            type: 'array',
                            items: {
                                type: 'array',
                                items: {
                                    type: 'array',
                                    items: { type: 'number' },
                                    minItems: 2,
                                    maxItems: 2
                                }
                            },
                            description: 'GeoJSON polygon coordinates'
                        },
                        properties: { type: 'object' },
                        active: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                BoundingBoxInput: {
                    type: 'object',
                    required: ['name', 'coordinates'],
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                        color: { type: 'string' },
                        coordinates: {
                            type: 'array',
                            items: {
                                type: 'array',
                                items: {
                                    type: 'array',
                                    items: { type: 'number' },
                                    minItems: 2,
                                    maxItems: 2
                                }
                            }
                        },
                        properties: { type: 'object' },
                        active: { type: 'boolean' }
                    }
                },
                AccountUpdate: {
                    type: 'object',
                    properties: {
                        handle: { type: 'string', pattern: '^[a-z0-9_]{5,20}$', description: 'Username (5-20 chars, lowercase alphanumeric and underscores)' },
                        displayname: { type: 'string', description: 'Display name' },
                        bio: { type: 'string', description: 'User biography' },
                        picture: { type: 'string', description: 'Profile picture URL' }
                    }
                },
                Stats: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        totalWaypoints: { type: 'integer' },
                        totalVerifiedWaypoints: { type: 'integer' },
                        totalUsers: { type: 'integer' },
                        totalReviews: { type: 'integer' },
                        totalContributions: { type: 'integer' }
                    }
                }
            }
        },

        paths: {
            '/api': {
                get: {
                    tags: ['General'],
                    summary: 'Get API information',
                    description: 'Returns basic information about the Bubbly Maps API including version and license.',
                    operationId: 'getApiInfo',
                    responses: {
                        '200': {
                            description: 'API information retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AppInfo' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/openapi': {
                get: {
                    tags: ['General'],
                    summary: 'Get OpenAPI specification',
                    description: 'Returns the OpenAPI 3.0 specification for this API.',
                    operationId: 'getOpenApiSpec',
                    responses: {
                        '200': {
                            description: 'OpenAPI specification retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: { type: 'object' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/auth/{...nextauth}': {
                get: {
                    tags: ['Auth'],
                    summary: 'NextAuth.js authentication endpoint',
                    description: 'Handles authentication via NextAuth.js. Supports multiple OAuth providers.',
                    operationId: 'nextAuthGet',
                    parameters: [
                        {
                            name: '...nextauth',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                            description: 'NextAuth.js route segments (e.g., signin, signout, callback/provider)'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Authentication response'
                        },
                        '302': {
                            description: 'Redirect to authentication provider or callback'
                        },
                        '500': {
                            description: 'Internal server error'
                        }
                    }
                },
                post: {
                    tags: ['Auth'],
                    summary: 'NextAuth.js authentication endpoint (POST)',
                    description: 'Handles authentication callbacks and form submissions via NextAuth.js.',
                    operationId: 'nextAuthPost',
                    parameters: [
                        {
                            name: '...nextauth',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                            description: 'NextAuth.js route segments'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Authentication response'
                        },
                        '302': {
                            description: 'Redirect after authentication'
                        },
                        '500': {
                            description: 'Internal server error'
                        }
                    }
                }
            },

            '/api/account': {
                patch: {
                    tags: ['Account'],
                    summary: 'Update account settings',
                    description: 'Update the authenticated user\'s account settings including handle, display name, bio, and profile picture.',
                    operationId: 'updateAccount',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AccountUpdate' }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Account updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            user: { $ref: '#/components/schemas/User' }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - invalid input or validation error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized - user not authenticated',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Account'],
                    summary: 'Upload profile picture',
                    description: 'Upload a new profile picture for the authenticated user. Image is uploaded to S3.',
                    operationId: 'uploadProfilePicture',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        file: {
                                            type: 'string',
                                            format: 'binary',
                                            description: 'Image file to upload'
                                        }
                                    },
                                    required: ['file']
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Profile picture uploaded successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            url: { type: 'string', description: 'URL of the uploaded image' }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - no file uploaded',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Get all users',
                    description: 'Retrieve a list of all users with basic information (id, username, displayName).',
                    operationId: 'getAllUsers',
                    responses: {
                        '200': {
                            description: 'List of users retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            license: { type: 'string', example: 'CC BY-NC 4.0' },
                                            users: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/UserSummary' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/users/{id}': {
                get: {
                    tags: ['Users'],
                    summary: 'Get user by ID',
                    description: 'Retrieve detailed information about a specific user including their contributions. Sensitive data (email, sessions) is redacted.',
                    operationId: 'getUserById',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                            description: 'User ID'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'User retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            license: { type: 'string', example: 'CC BY-NC 4.0' },
                                            user: { $ref: '#/components/schemas/User' },
                                            contributions: { type: 'array', items: { type: 'object' } }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - missing or invalid user ID',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/waypoints': {
                get: {
                    tags: ['Waypoints'],
                    summary: 'Get all waypoints',
                    description: 'Retrieve a list of all waypoints with basic location data (id, name, latitude, longitude).',
                    operationId: 'getAllWaypoints',
                    responses: {
                        '200': {
                            description: 'List of waypoints retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            license: { type: 'string', example: 'CC BY-NC 4.0' },
                                            author: { type: 'string' },
                                            waypoints: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/WaypointSummary' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Waypoints'],
                    summary: 'Create a new waypoint',
                    description: 'Create a new water fountain/bubbler waypoint. Requires authentication and sufficient XP.',
                    operationId: 'createWaypoint',
                    security: [{ sessionAuth: [] }, { bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WaypointInput' }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'Waypoint created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            result: { $ref: '#/components/schemas/Waypoint' }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - missing required fields or invalid coordinates',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden - insufficient XP',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/waypoints/{id}': {
                get: {
                    tags: ['Waypoints'],
                    summary: 'Get waypoint by ID',
                    description: 'Retrieve detailed information about a specific waypoint including its change logs.',
                    operationId: 'getWaypointById',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'Waypoint ID'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Waypoint retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            license: { type: 'string', example: 'CC BY-NC 4.0' },
                                            waypoint: { $ref: '#/components/schemas/Waypoint' },
                                            logs: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/WaypointLog' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - invalid waypoint ID',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '404': {
                            description: 'Waypoint not found',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                patch: {
                    tags: ['Waypoints'],
                    summary: 'Update a waypoint',
                    description: 'Update an existing waypoint. Requires authentication and sufficient XP. Moderators and API token holders can update additional fields (approved, verified).',
                    operationId: 'updateWaypoint',
                    security: [{ sessionAuth: [] }, { bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'Waypoint ID'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WaypointUpdate' }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Waypoint updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            updatedWaypoint: { $ref: '#/components/schemas/Waypoint' }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - invalid waypoint ID or data',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden - insufficient XP',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: ['Waypoints'],
                    summary: 'Delete a waypoint',
                    description: 'Delete a waypoint. Requires API token authentication (admin only).',
                    operationId: 'deleteWaypoint',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'Waypoint ID'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Waypoint deleted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - invalid waypoint ID',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized - API token required',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/waypoints/search': {
                get: {
                    tags: ['Waypoints'],
                    summary: 'Search waypoints',
                    description: 'Search for waypoints by name or other criteria.',
                    operationId: 'searchWaypoints',
                    parameters: [
                        {
                            name: 'q',
                            in: 'query',
                            required: true,
                            schema: { type: 'string' },
                            description: 'Search query string'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Search results retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            license: { type: 'string', example: 'CC BY-NC 4.0' },
                                            waypoints: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Waypoint' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - missing search query',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/reviews': {
                get: {
                    tags: ['Reviews'],
                    summary: 'Get reviews',
                    description: 'Retrieve reviews filtered by userId or bubblerId. One of these query parameters is required.',
                    operationId: 'getReviews',
                    parameters: [
                        {
                            name: 'userId',
                            in: 'query',
                            required: false,
                            schema: { type: 'string' },
                            description: 'Filter reviews by user ID'
                        },
                        {
                            name: 'bubblerId',
                            in: 'query',
                            required: false,
                            schema: { type: 'integer' },
                            description: 'Filter reviews by waypoint/bubbler ID'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Reviews retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            license: { type: 'string', example: 'CC BY-NC 4.0' },
                                            reviews: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Review' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - must provide userId or bubblerId',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Reviews'],
                    summary: 'Create a review',
                    description: 'Create a new review for a waypoint. Requires authentication. Awards XP to the user.',
                    operationId: 'createReview',
                    security: [{ sessionAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ReviewInput' }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Review created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            review: { $ref: '#/components/schemas/Review' }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - missing required fields',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: ['Reviews'],
                    summary: 'Delete a review',
                    description: 'Delete a review. Users can only delete their own reviews unless they are moderators.',
                    operationId: 'deleteReview',
                    security: [{ sessionAuth: [] }, { bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'query',
                            required: true,
                            schema: { type: 'integer' },
                            description: 'Review ID to delete'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Review deleted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            review: { $ref: '#/components/schemas/Review' }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - missing review ID',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden - cannot delete another user\'s review',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '404': {
                            description: 'Review not found',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/boundingboxes': {
                get: {
                    tags: ['Bounding Boxes'],
                    summary: 'Get all bounding boxes',
                    description: 'Retrieve all active bounding boxes for the map.',
                    operationId: 'getAllBoundingBoxes',
                    responses: {
                        '200': {
                            description: 'Bounding boxes retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            license: { type: 'string', example: 'CC BY-NC 4.0' },
                                            boundingBoxes: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/BoundingBox' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Bounding Boxes'],
                    summary: 'Create a bounding box',
                    description: 'Create a new bounding box. Requires API token or moderator privileges.',
                    operationId: 'createBoundingBox',
                    security: [{ sessionAuth: [] }, { bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/BoundingBoxInput' }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'Bounding box created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            boundingBox: { $ref: '#/components/schemas/BoundingBox' }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request - missing required fields or invalid format',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '401': {
                            description: 'Unauthorized - requires API token or moderator privileges',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },

            '/api/stats': {
                get: {
                    tags: ['Stats'],
                    summary: 'Get platform statistics',
                    description: 'Retrieve platform-wide statistics including total waypoints, users, reviews, and contributions.',
                    operationId: 'getStats',
                    responses: {
                        '200': {
                            description: 'Statistics retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Stats' }
                                }
                            }
                        },
                        '500': {
                            description: 'Internal server error',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return NextResponse.json(
        spec,
        { status: 200 }
    )

}