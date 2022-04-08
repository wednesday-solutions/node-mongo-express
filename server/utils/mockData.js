export const mockData = {
    MOCK_USER: {
        _id: 1,
        firstName: 'Jhon',
        lastName: 'Doe',
        email: 'doe@wednesday.is',
        authId: 'auth0|6241b09d4bd9006f9a45cf'
    },
    MOCK_USER_LOGIN: {
        data: {
            access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXV',
            scope: 'read:current_user',
            expires_in: 864009,
            token_type: 'Bearer'
        }
    },
    MOCK_ROLE: {
        data: {
            id: 'rol_XeIAH73iey2dLBNn',
            name: 'STORE_ADMIN',
            description: 'Can access endpoints related to users'
        }
    },
    MOCK_TOTAL_AMT: [
        {
            _id: null,
            totalPrice: 25000
        }
    ],
    MOCK_EARLIEST_CREATED_DATE: {
        createdAt: '1994-10-24',
        purchasedProducts: []
    },
    MOCK_TOTAL_COUNT: [
        {
            __id: null,
            totalOrder: 1500
        }
    ],
    MOCK_CATEGORIES: ['Sports', 'Automotive', 'Tools'],
    MOCK_ORDER: {
        purchasedProducts: [
            {
                name: 'Generic Cotton Sausages',
                price: 43000,
                category: 'Garden',
                quantity: 1,
                quantityAverage: 0,
                schema: 1,
                _id: '624c1ad1527d4e2840408142'
            }
        ],
        totalPrice: 43000
    },
    MOCK_ORDER_DETAILS: {
        purchasedProducts: [
            {
                name: 'Generic Cotton Sausages',
                price: 43000,
                category: 'Garden',
                quantity: 1,
                quantityAverage: 0,
                schema: 1
            }
        ],
        totalPrice: 43000,
        createdAt: '2022-04-06'
    },
    MOCK_UNSHARDED_REFERENCED_ORDERS: {
        data: [
            {
                _id: '624ae6bcae38f95bb8e0ea74',
                purchasedProducts: [],
                totalPrice: 100
            }
        ]
    }
};
