
## API Gateways

| Endpoint               | Request Type | Body Fields | Description                                                    |
|------------------------| ------------ |  -- |----------------------------------------------------------------|
| /matches               | `GET` | * | Get all matches <br>                                           |
| /matches               | `POST` | id: `str`<br>category: `Array`<br>complexity: `str` | Start the matching process. <br>                                        |
| /matches/{user_id} | `DELETE`     | * | Cancel the matching process based on ID. <br>       |
| /matches/{user_id} | `GET`       | * | Get all matched records from a user. <br> |