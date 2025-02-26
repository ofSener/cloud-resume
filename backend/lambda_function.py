import json
import boto3
import decimal
import os

dynamodb = boto3.resource("dynamodb")
table_name = os.environ.get("TABLE_NAME", "ZiyaretciSayaci")
table = dynamodb.Table(table_name)

def decimal_to_int(obj):
    if isinstance(obj, decimal.Decimal):
        return int(obj)
    raise TypeError("Object of type Decimal is not JSON serializable")

def lambda_handler(event, context):
    try:
        # Get existing record
        resp = table.get_item(Key={"visitorID": "visitors"})
        item = resp.get("Item")
        if item:
            new_count = item["count"] + 1
        else:
            new_count = 1
            table.put_item(Item={"visitorID": "visitors", "count": decimal.Decimal(new_count)})

        # Update the count
        table.update_item(
            Key={"visitorID": "visitors"},
            UpdateExpression="SET #c = :val",
            ExpressionAttributeNames={"#c": "count"},
            ExpressionAttributeValues={":val": decimal.Decimal(new_count)},
        )

        # CORS için origin
        allowed_origin = os.environ.get("ALLOWED_ORIGIN", "*")

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": allowed_origin,
                "Access-Control-Allow-Methods": "GET"
            },
            "body": json.dumps({"count": new_count}, default=decimal_to_int)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": json.dumps({"error": str(e)})
        }
