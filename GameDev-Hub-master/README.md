


# Screenshots

<p float="left">
<img src="/screenshots/login.JPG" alt="login" width="480px" height="320px" />
<img src="/screenshots/register.JPG" alt="register" width="480px" height="320px" />
<img src="/screenshots/allgames.JPG" alt="allgames" width="480px" height="320px" />
<img src="/screenshots/myprofile.JPG" alt="myprofile" width="480px" height="320px" />
</p>

# API endpoints


### Register

```
POST /api/user/register
Content-Type: application/json

{
  "email": "ab@gmail.com"
  "username": "abc"
  "password": "abc@123"
}
```

### Login

```
POST /api/user/login
Content-Type: application/json

{
  "email": "ab@gmail.com"
  "password": "abc@123"
}
```

### Fetch My profile

```
POST /api/user/me
Content-Type: application/json
Access-Token: Bearer <accessToken>
```

### Fetch a user

```
GET /api/user/profile/:username
Access-Token: Bearer <accessToken>
Content-Type: application/json
```

### Request Forgot Password

```
POST /api/user/forgotpwd 
Content-Type: application/json

{
  "email": "abc@gmail.com"
}
```

### Request Forgot Password

```
POST /api/user/reset/:resetToken 
Content-Type: application/json

{
  "password": "abc@newPassword"
}
```

### Purchase game

```
POST /purchase/game/:gameid 
Access-Token: Bearer <accessToken>
Content-Type: application/json
```

### Get Scheduled Game releases

```
GET /schedules
Access-Token: Bearer <accessToken>
 ```
 
### Get Teasers

```
GET /teasers
Access-Token: Bearer <accessToken>
 ```
 
### Get Teaser by `teaserid`

```
GET /teaser/:teaserid
Access-Token: Bearer <accessToken>
 ```
 
### Get Comments by `gameid`

```
GET /game/:gameid/comments
Access-Token: Bearer <accessToken>
 ```
 
### Remove comment by `(commentid, gameid)`

```
GET /game/:gameid/removecomment/:commentid
Access-Token: Bearer <accessToken>
 ```
 
### Fetch a game by `gameid`

```
GET /game/:gameid/view
Access-Token: Bearer <accessToken>
 ```
 
### Fetch all games

```
GET /allgames
Access-Token: Bearer <accessToken>
 ```
 
### Fetch most favourites

```
GET /mostfavourites
Access-Token: Bearer <accessToken>
 ```
 
### Fetch trending games

```
GET /trending
Access-Token: Bearer <accessToken>
 ```
 
### Download game by gameid (Free games only)

```
GET /download/:gameid
Access-Token: Bearer <accessToken>
 ```
