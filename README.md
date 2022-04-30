# Full Stack -sovelluskehitys TO00BS65-3002

## Author

Sauli Kylmänen

## Routes

| Method | Route                      |
| ------ | -------------------------- |
| GET    | [/api/getall](#get-all)    |
| GET    | [/api/:id](#get-one)       |
| POST   | [/api/add](#add)           |
| POST   | [/api/login](#login)       |
| PATCH  | [/api/update/:id](#update) |
| DELETE | [/api/delete/:id](#delete) |

### Get all

GET /api/getall

Gets all documents. Returns array of user objects or an empty array.

```
// Success
{
    "code": 200,
    "title": "success",
    "message": "GET OK",
    "data": [
        {
            "_id": "626d65dcc5668522af45bc61",
            "username": "Johnny36",
            "encodedPassword": "SCRYPT:4096:8:8:3yt89CqsXsc6NLrTprL1vwS8fjBBQ576j6bLIKR1xeo=:7lxKtxVWq3vT8HljUV+ueOLoUTRuLq+y95lO3W/W8m0=",
            "__v": 0,
            "name": "Ollie Simonis"
        }
    ]
}
```

```
// Error
{
    "code": 404,
    "title": "error",
    "message": "No results",
    "data": []
}
```

### Get one

GET /api/:id

Gets single document by id. Returns single user object, error object or null

```
// Success
{
    "code": 200,
    "title": "success",
    "message": "GET OK",
    "data": {
        "_id": "626d658ac5668522af45bc5c",
        "username": "Deonte_MacGyver",
        "encodedPassword": "SCRYPT:4096:8:8:YetCZdKKMQwfCr5A9mV7rx2bRvGrVpRjIzJmpYW25s4=:giVkXqfmqRuGXVBZoA9Irrziij45fIFtQh0/92o3e7E=",
        "__v": 0
    }
}
```

```
// Error
{
    "code": 404,
    "title": "error",
    "message": "Not found",
    "data": null
}
```

### Add

POST /api/add

Adds new user to the database. Payload must be valid JSON and Content-Type header must be application/json.

#### Examples

```
// payload
{
    "username": "Johnny36",
    "plaintext": "password"
}
```

```
// Success
{
    "code": 201,
    "title": "success",
    "message": "POST OK",
    "data": {
        "username": "Johnny36",
        "encodedPassword": "SCRYPT:4096:8:8:3yt89CqsXsc6NLrTprL1vwS8fjBBQ576j6bLIKR1xeo=:7lxKtxVWq3vT8HljUV+ueOLoUTRuLq+y95lO3W/W8m0=",
        "_id": "626d65dcc5668522af45bc61",
        "__v": 0
    }
}
```

### Login

POST /api/login

Log in with credentials. Payload must be valid JSON and Content-Type header must be application/json.

#### Examples

```
// payload
{
    "username": "Johnny36",
    "plaintext": "password"
}
```

```
// Success
{
    "code": 200,
    "title": "success",
    "message": "Login successfull",
    "data": {
        "_id": "626d65dcc5668522af45bc61",
        "username": "Johnny36",
        "encodedPassword": "SCRYPT:4096:8:8:3yt89CqsXsc6NLrTprL1vwS8fjBBQ576j6bLIKR1xeo=:7lxKtxVWq3vT8HljUV+ueOLoUTRuLq+y95lO3W/W8m0=",
        "__v": 0
    }
}
```

```
// Error
{
    "code": 401,
    "title": "error",
    "message": "Invalid username or password",
    "data": null
}
```

### Update

PATCH /api/update/:id

Updates the user by id. Payload must contain the field name to be updated and be valid JSON. Content-Type header must be set to application/json

#### Examples

```
// payload
{
    "name": "Ollie Simonis"
}
```

```
// Success
{
    "code": 200,
    "title": "success",
    "message": "PATCH OK",
    "data": {
        "document": {
            "_id": "626d65dcc5668522af45bc61",
            "username": "Johnny36",
            "encodedPassword": "SCRYPT:4096:8:8:3yt89CqsXsc6NLrTprL1vwS8fjBBQ576j6bLIKR1xeo=:7lxKtxVWq3vT8HljUV+ueOLoUTRuLq+y95lO3W/W8m0=",
            "__v": 0
        },
        "updated": {
            "name": "Ollie Simonis"
        }
    }
}
```

```
// Error
{
    "code": 404,
    "title": "error",
    "message": "User not found",
    "data": null
}
```

### Delete

DELETE /api/delete/:id

Deletes the user by id.

```
// Success
{
    "code": 200,
    "title": "success",
    "message": "DELETE OK",
    "data": {
        "_id": "626d65dcc5668522af45bc61",
        "username": "Johnny36",
        "encodedPassword": "SCRYPT:4096:8:8:3yt89CqsXsc6NLrTprL1vwS8fjBBQ576j6bLIKR1xeo=:7lxKtxVWq3vT8HljUV+ueOLoUTRuLq+y95lO3W/W8m0=",
        "__v": 0,
        "name": "Ollie Simonis"
    }
}
```

```
// Error
{
    "code": 404,
    "title": "error",
    "message": "Not found",
    "data": null
}
```
