import unittest
import decimal
from unittest.mock import patch, MagicMock
import lambda_function

class TestLambdaFunction(unittest.TestCase):

    @patch('boto3.resource')
    def test_lambda_handler_new_visitor(self, mock_boto):
        # Mock the table
        mock_table = MagicMock()
        mock_boto.return_value.Table.return_value = mock_table

        # Simulate no existing item
        mock_table.get_item.return_value = {}

        response = lambda_function.lambda_handler({}, {})
        body = response["body"]

        self.assertIn('"count": 1', body)
        self.assertEqual(response["statusCode"], 200)

    @patch('boto3.resource')
    def test_lambda_handler_existing_visitor(self, mock_boto):
        mock_table = MagicMock()
        mock_boto.return_value.Table.return_value = mock_table

        # Simulate existing item
        mock_table.get_item.return_value = {
            "Item": {
                "count": decimal.Decimal(5)
            }
        }

        response = lambda_function.lambda_handler({}, {})
        body = response["body"]

        self.assertIn('"count": 6', body)
        self.assertEqual(response["statusCode"], 200)

    def test_decimal_to_int(self):
        result = lambda_function.decimal_to_int(decimal.Decimal(10))
        self.assertEqual(result, 10)

if __name__ == '__main__':
    unittest.main()
