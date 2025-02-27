import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    response = table.update_item(
        Key={'visitorID': 'global_count'},
        UpdateExpression='ADD visitCount :inc',
        ExpressionAttributeValues={':inc': 1},
        ReturnValues='UPDATED_NEW'
    )
    new_count = response['Attributes']['visitCount']

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['ALLOWED_ORIGIN']
        },
        "body": json.dumps({"visitorCount": int(new_count)})
    }
