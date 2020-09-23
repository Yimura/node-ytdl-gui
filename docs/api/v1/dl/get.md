# Download

Used to get a downloadable stream from a website in the given format/type.

**URL** : `/api/v1/dl/`

**Method** : `GET`

**Auth required** : NO

**Data constraints**

`NOTE`: The data constraints are written as JSON but should be encoded as URLSearchParams

```json
{
    "url": "[string URL that matches RFC3986]",
    "type": "[number of the type, valid numbers are 0-3]"
}
```

Valid Types:
```json
{
    "types": [
        {
            "number": 0,
            "type": "Default of the Source URL"
        },
        {
            "number": 1,
            "type": "MP3"
        },
        {
            "number": 2,
            "type": "OGG"
        },
        {
            "number": 3,
            "type": "WAV"
        }
    ]
}
```

**Data example**

```json
{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "type": 0
}
```

## Success Response

**Code** : `200 OK`

**Headers**

```json
{
    "Content-Type": "[the container that is returned]",
    "Content-Length": "[size of the download, this will not be given if]",
    "Content-Disposition": "[attachment; filename]"
}
```

**Content example**

This endpoint returns a stream, there's no visual content example.
```
Returns: <TCP.stream>
```

## Error Response 400

**Condition** : If no 'url' was passed in the URLSearchParams.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "status": 400,
    "statusText": "400 Bad Request",
    "message": "The server could not understand the request due to invalid syntax of the URL or certain HEADERS were missing."
}
```

## Error Response 403

**Condition** :  If the host you wish to download from is blocked by the server.

**Code**: `403 PERMISSION DENIED`

**Content** :

```json
{
    "status": 403,
    "statusText": "403 Forbidden",
    "message": "The client does not have access rights to the content."
}
```
