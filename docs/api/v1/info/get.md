# Download

Get information about a URL from the YTDL binary on the server.

**URL** : [`/api/v1/info/`](https://ytdl.pieceof.art/api/v1/info/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D5NvUjGrwl_g)

**Example URL** : `https://ytdl.pieceof.art/api/v1/info/?url=<any url with a media stream>`

**Method** : `GET`

**Auth required** : NO

**Data constraints**

`NOTE`: The data constraints are written as JSON but should be encoded as URLSearchParams

```json
{
    "url": "[string URL that matches RFC3986]"
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

**Content example**

Fetch the endpoint to get an idea of how the response content looks
```json
{
    "..."
}
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

**Condition** :  If the host you wish to fetch info from is blocked by the server.

**Code**: `403 PERMISSION DENIED`

**Content** :

```json
{
    "status": 403,
    "statusText": "403 Forbidden",
    "message": "The client does not have access rights to the content."
}
```
