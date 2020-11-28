# Download

Get the download rules of the YTDL host.

**URL** : [`/api/v1/download_rule/`](https://ytdl.pieceof.art/api/v1/download_rule/)

**Example URL** : `https://ytdl.pieceof.art/api/v1/download_rule/`

**Method** : `GET`

**Auth required** : NO

**Data constraints**

`NONE`

## Success Response

**Code** : `200 OK`

**Content example**

```json
"sites": {
    "rule": "allow",
    "exception": []
}
```
