# Download

This endpoint does not return any JSON output but returns a downloadable stream.
This endpoint neither supports resuming of streams when given specific bytes, make sure you download it in one go.

**URL** : [`/api/v1/dl/`](https://ytdl.pieceof.art/api/v1/dl/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D5NvUjGrwl_g&type=0)

**Example URL** : `https://ytdl.pieceof.art/api/v1/dl/?url=<any url with a media stream>&type=0`

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
