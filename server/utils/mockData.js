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
