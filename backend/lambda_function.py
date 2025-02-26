import json
import boto3
import decimal
import os

# Initialize DynamoDB
dynamodb = boto3.resource("dynamodb")
table_name = os.environ.get("TABLE_NAME", "resume-visitor_count")
table = dynamodb.Table(table_name)

# Helper function to convert Decimal to int
def decimal_to_int(obj):
    if isinstance(obj, decimal.Decimal):
        return int(obj)  # Convert decimal to int for JSON response
    raise TypeError

def lambda_handler(event, context):
    try:
        # Fetch the existing count
        response = table.get_item(Key={"id": "visitors"})
        item = response.get("Item")

        if item:
            new_count = item["count"] + 1
        else:
            new_count = 1  # Initialize count if table is empty

            # İlk ziyaretçiyi eklemek için kayıt oluştur
            table.put_item(Item={"id": "visitors", "count": decimal.Decimal(new_count)})

        # Update the count in DynamoDB
        table.update_item(
            Key={"id": "visitors"},
            UpdateExpression="SET #c = :val",
            ExpressionAttributeNames={"#c": "count"},
            ExpressionAttributeValues={":val": decimal.Decimal(new_count)},
        )

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://ofsener.com",  # CORS header for frontend requests
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET"
            },
            "body": json.dumps({"count": new_count}, default=decimal_to_int),
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