const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({
    region: 'us-east-1',
    accessKeyId: "AKIAUTIATMCNZZSH4XZV",
    secretAccessKey: "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"
});
const {
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");

const {marshall, unmarshall} = require("@aws-sdk/util-dynamodb");

module.exports = client;