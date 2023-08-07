# telegram-ledger-bot
telegram bot on AWS Lambda which record ledger to Google SpreadSheet

# How to use
# Pre-Requirement
1. GCP project Service account with editor role and it's credentials.json
2. AWS Lambda Function

## Set Data in AWS Service

### AWS Systems Manager
|Name|Value|
|-|-|
|`/telegram-ledger-bot/GOOGLE_CLIENT_EMAIL`| client_email in credentials.json|
|`/telegram-ledger-bot/GOOGLE_PRIVATE_KEY`|private_key in credentials.json|
|`/telegram-ledger-bot/bot_token`|telegram bot token|

### Lambda Function Environment Variable
|Name|Value|
|-|-|
|`SPREADSHEET_ID`|SpreadSheetID|

## Set Test Data (Selectivity)

``` JSON
{
  "update_id": 123456789,
  "message": {
    "message_id": 100,
    "from": {
      "id": 987654321,
      "is_bot": false,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "language_code": "en"
    },
    "chat": {
      "id": 987654321,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "type": "private"
    },
    "date": 1628123456,
    "text": "Hello, Telegram bot!"
  }
}
```