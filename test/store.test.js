const store = require('../store.js');

const orderQuery = '{\r\n' +
'    "order_id": 1,\r\n' +
'    "petId": 100,\r\n' +
'    "quantity": 0,\r\n' +
'    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
'    "status": "placed",\r\n' +
'    "complete": true\r\n' +
'}';

// This are the tests for the POST /store/order resources and for the 
// function validateOrderQuery
describe('POST /store/order tests', function () {

    test('Ignore', async() => {
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: orderQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(200);
    });

    test('Order Query is well formed', async() => {
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: orderQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(200);
    });

    test('Order Query does not have a valid order_id', async () => {
    const badQuery = '{\r\n' +
    '    "order_id": "1",\r\n' +
    '    "petId": 100,\r\n' +
    '    "quantity": 0,\r\n' +
    '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
    '    "status": "placed",\r\n' +
    '    "complete": true\r\n' +
    '}';
    const event = {
        httpMethod: 'POST',
        path: '/store/order',
        body: badQuery
    };
    let result = await store.handler2(event);
    expect(result.statusCode).toBe(400);
    });

    test('Order Query does not have order_id', async () => {
        const badQuery = '{\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": 0,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('order_id is negative', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": -1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": 0,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('petId has wrong data type', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": "100",\r\n' +
        '    "quantity": 0,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('petId is negative', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": -100,\r\n' +
        '    "quantity": 0,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('petId is missing', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "quantity": 0,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('quantity is negative', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": -1,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('quantity has wrong data type', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": "0",\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('quantity is missing', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('shipDate has wrong data type', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": 1,\r\n' +
        '    "shipDate": 2,\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('shipDate is not a date', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": 1,\r\n' +
        '    "shipDate": "aaaaa",\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('shipDate is missing', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": 1,\r\n' +
        '    "status": "placed",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('status is with the wrong data type', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": 1,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": 3,\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('status is missing', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": 1,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "complete": true\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('complete is not a boolean', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": 1,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "complete",\r\n' +
        '    "complete": 2\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });

    test('complete is missing', async () => {
        const badQuery = '{\r\n' +
        '    "order_id": 1,\r\n' +
        '    "petId": 100,\r\n' +
        '    "quantity": 1,\r\n' +
        '    "shipDate": "2021-09-21T21:17:44.206Z",\r\n' +
        '    "status": "pending"\r\n' +
        '}';
        const event = {
            httpMethod: 'POST',
            path: '/store/order',
            body: badQuery
        };
        let result = await store.handler2(event);
        expect(result.statusCode).toBe(400);
    });
});

describe('POST /store/order tests', function () {

});