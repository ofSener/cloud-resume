import os
# Environment değişkenlerini, lambda_function import edilmeden önce ayarla.
os.environ['TABLE_NAME'] = 'TestTable'
os.environ['ALLOWED_ORIGIN'] = 'https://ofsener.com'

import json
import unittest
from unittest.mock import patch
from lambda_function import lambda_handler

class TestLambdaFunction(unittest.TestCase):

    @patch('lambda_function.table')
    def test_lambda_handler_success(self, mock_table):
        mock_table.update_item.return_value = {
            "Attributes": {
                "visitCount": 42
            }
        }
        event = {}
        context = {}
        response = lambda_handler(event, context)
        body = json.loads(response['body'])

        self.assertEqual(response['statusCode'], 200)
        self.assertIn('headers', response)
        self.assertEqual(response['headers']['Access-Control-Allow-Origin'], 'https://ofsener.com')
        self.assertEqual(body['visitorCount'], 42)

if __name__ == '__main__':
    unittest.main()
