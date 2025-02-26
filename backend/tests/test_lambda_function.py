import sys
import os
import json
import pytest
from unittest.mock import patch

# Proje kök dizinini sys.path'e ekliyoruz, böylece lambda_function.py import edilebiliyor.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from lambda_function import lambda_handler

# Ortak boş event ve context için fixture tanımlıyoruz.
@pytest.fixture
def empty_event_context():
    return {}, {}

@patch("lambda_function.table")
def test_lambda_handler_existing_item(mock_table, empty_event_context):
    event, context = empty_event_context
    # Test Senaryosu: DynamoDB tablosunda mevcut öğe var, count: 5
    # Beklenen: Fonksiyon, count'u 5'ten 6'ya çıkarmalı.
    print("Test: Existing item scenario - Starting with count 5; expecting increment to 6.")
    
    # Mevcut öğeyi simüle ediyoruz.
    mock_table.get_item.return_value = {"Item": {"id": "visitors", "count": 5}}
    
    response = lambda_handler(event, context)
    assert response["statusCode"] == 200, "Expected status code to be 200."

    body = json.loads(response["body"])
    expected = 6
    actual = body["count"]
    assert actual == expected, f"Expected count to be {expected}, but got {actual}."
    
    # update_item çağrısını kontrol ediyoruz.
    mock_table.update_item.assert_called_once_with(
        Key={"id": "visitors"},
        UpdateExpression="SET #c = :val",
        ExpressionAttributeNames={"#c": "count"},
        ExpressionAttributeValues={":val": expected}
    )
    print("Test passed: Existing item incremented correctly to 6.")

@patch("lambda_function.table")
def test_lambda_handler_no_existing_item(mock_table, empty_event_context):
    event, context = empty_event_context
    # Test Senaryosu: DynamoDB tablosunda öğe yok.
    # Beklenen: Fonksiyon, count'u 0 olarak başlatıp 1'e çıkarmalı.
    print("Test: No existing item scenario - No initial count; expecting initialization and increment to 1.")
    
    # Hiç öğe dönmüyorsa.
    mock_table.get_item.return_value = {}
    
    response = lambda_handler(event, context)
    assert response["statusCode"] == 200, "Expected status code to be 200."

    body = json.loads(response["body"])
    expected = 1
    actual = body["count"]
    assert actual == expected, f"Expected count to be {expected}, but got {actual}."
    
    # update_item çağrısını kontrol ediyoruz.
    mock_table.update_item.assert_called_once_with(
        Key={"id": "visitors"},
        UpdateExpression="SET #c = :val",
        ExpressionAttributeNames={"#c": "count"},
        ExpressionAttributeValues={":val": expected}
    )
    print("Test passed: No existing item initialized and incremented correctly to 1.")