# Download

Get playlist information about a YouTube playlist.

**THIS ENDPOINT ONLY SUPPORTS YouTube PLAYLISTS**
If an invalid hostname is used then this endpoint will return an empty object.

**URL** : [`/api/v1/playlist/`](https://ytdl.pieceof.art/api/v1/playlist/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKbXB57jrwPo%26list%3DPLLHySVDtcpe1-8MjKm-en7Vo4yeuhmg90%26index%3D1)

**Example URL** : `https://ytdl.pieceof.art/api/v1/playlist/?url=<YT Playlist URL>`

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
    "url": "https://www.youtube.com/watch?v=KbXB57jrwPo&list=PLLHySVDtcpe1-8MjKm-en7Vo4yeuhmg90&index=1"
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

Or returns an empty object if the URL hostname was invalid or the API was unable to find any details about the playlist.

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
