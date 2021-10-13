const handler = require('../index.js');



// Empty input suit
describe('General inputs', function () {
    test('input is an empty request, should return code 404', async () => {
        const event = {};
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(404);
    });
});

// Pet query validation suite
describe('Query validation test suite', function () {
    test('fully-formed, valid input', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const response = {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: '{"Operation":"POST","Message":"Success","Item":{"pet_id":0,"category":{"id":0,"name":"cat"},"name":"whiskers","photoUrls":[],"tags":[],"status":"available"}}'
        }

        const result = await handler.handler(event);
        expect(result.statusCode).toBe(200);
    });

    test('Missing pet_id, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('pet_id has the wrong type, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": "0",
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('one missing attribute that is not pet_id, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": "0",
            }
        };
    });

    test('category is missing, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('category is empty, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": "0",
                "category": {

                },
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('category only has one element, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": "0",
                "category": {
                    "id": 0
                },
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('category has 2 elements, but one of them is incorrect', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "age": 1
                },
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('category.id has the wrong data type, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": "0",
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('category.name has the wrong data type, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": 0
                },
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('category has too many properties, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat",
                    "age": 2
                },
                "name": "whiskers",
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('name is missing, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat",
                    "age": 2
                },
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('name has wrong data type, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": 0,
                "photoUrls": [
                
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('photoUrls is missing, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('photoUrl has wrong type of data, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [
                    1023, 1201
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('photoUrl has wrong type of data on one item, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [
                    "10230", 1201
                ],
                "tags": [

                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('tags is missing, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [
                    
                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('tags.name is missing, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": 0
                    }
                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('tags.id is missing, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "name": "cat"
                    }
                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('tags.name is missing, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": 0
                    }
                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('one of the tags is not valid, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": 0,
                        "detail": "cat"
                    }
                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('tags.id has the wrong type, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "cat"
                    }
                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('tags.name has the wrong type, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": 1
                    }
                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('tags has too many properties, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string",
                        "detail": "meow"
                    }
                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('status is missing, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('status is available, should return 200', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "available"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(200);
    });

    test('status is pending, should return 200', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "pending"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(200);
    });

    test('status is sold, should return 200', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "sold"
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(200);
    });

    test('status is invalid, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": 3
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });

    test('too many properties, should return 405', async () => {
        const event = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "sold",
                "age": 3
            }
        };
        const result = await handler.handler(event);
        expect(result.statusCode).toBe(405);
    });
});

// Test suite for PUT /pet
describe('Updating pet test suite', function () {
    test('Updating a valid pet', async () => {
        const event1 = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "sold"
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(200);

        const event2 = {
            path: '/pet',
            httpMethod: 'PUT',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "dog"
                },
                "name": "bolt",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "available"
            }
        };
        const result2 = await handler.handler(event2);
        expect(result2.statusCode).toBe(200);
    });

    test('Valid inputs, second pet not there, but put operation creates one', async () => {
        const event1 = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "sold"
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(200);

        const event2 = {
            path: '/pet',
            httpMethod: 'PUT',
            body:{
                "pet_id": 100,
                "category": {
                    "id": 0,
                    "name": "dog"
                },
                "name": "bolt",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "available"
            }
        };
        const result2 = await handler.handler(event2);
        expect(result2.statusCode).toBe(200);
    });

    test('Invalid pet_id data type', async() => {
        const event1 = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "sold"
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(200);

        const event2 = {
            path: '/pet',
            httpMethod: 'PUT',
            body:{
                "pet_id": "1",
                "category": {
                    "id": 0,
                    "name": "dog"
                },
                "name": "bolt",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "available"
            }
        };
        const result2 = await handler.handler(event2);
        expect(result2.statusCode).toBe(400);
    });

    test('pet_id is a negative value, which is invalid', async() => {
        const event1 = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "sold"
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(200);

        const event2 = {
            path: '/pet',
            httpMethod: 'PUT',
            body:{
                "pet_id": -1,
                "category": {
                    "id": 0,
                    "name": "dog"
                },
                "name": "bolt",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "available"
            }
        };
        const result2 = await handler.handler(event2);
        expect(result2.statusCode).toBe(400);
    });

    test('update query is ill-formed', async() => {
        const event1 = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "sold"
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(200);

        const event2 = {
            path: '/pet',
            httpMethod: 'PUT',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "dog"
                },
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "available"
            }
        };
        const result2 = await handler.handler(event2);
        expect(result2.statusCode).toBe(405);
    });


});

describe('GET /pet/{petId} test suite', function () {
    test('valid get operation', async() => {
        const event1 = {
            path: '/pet/0',
            httpMethod: 'GET',
            queryStringParameters:{
                "pet_id": '0'
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(200);
    });
    test('pet_id cannot be converted to an int', async() => {
        const event1 = {
            path: '/pet/0',
            httpMethod: 'GET',
            queryStringParameters:{
                "pet_id": 'a'
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(404);
    });
    test('pet_id not found', async() => {
        const event1 = {
            path: '/pet/0',
            httpMethod: 'GET',
            queryStringParameters:{
                "pet_id": '500'
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(404);
    });
});

describe('finding pets by status test suite', function () {
    test('Getting all pets with certain status', async () => {
        const event1 = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 0,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "sold"
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(200);

        const event2 = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 1,
                "category": {
                    "id": 0,
                    "name": "dog"
                },
                "name": "bolt",
                "photoUrls": [

                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "available"
            }
        };
        const result2 = await handler.handler(event2);
        expect(result2.statusCode).toBe(200);

        const event3 = {
            path: '/pet/findByStatus',
            httpMethod: 'GET',
            body: {
                "status": "available"
            }
        };

        const result3 = await handler.handler(event3);
        expect(result3.statusCode).toBe(200);
        //TODO: check how result looks like.

    });
});

describe('POST /pet/{petId} test suite', function () {
    test('correct way to change form data', async () => {
        const event1 = {
            path: '/pet',
            httpMethod: 'POST',
            body:{
                "pet_id": 13,
                "category": {
                    "id": 0,
                    "name": "cat"
                },
                "name": "whiskers",
                "photoUrls": [
    
                ],
                "tags": [
                    {
                        "id": "0",
                        "name": "string"
                    }
                ],
                "status": "sold"
            }
        };
        const result1 = await handler.handler(event1);
        expect(result1.statusCode).toBe(200);
        
        const event2 = {
            path: '/pet/13',
            httpMethod: 'POST',
            body: {
                "pet_id": 13,
                "name": "whiskerson",
                "status": "available"
            }
        }
        const result2 = await handler.handler(event2);
        expect(result2.statusCode).toBe(200);
    });
});
























