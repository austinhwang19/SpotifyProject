const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'e37916d70d074851b71315a78030cbac',
        clientSecret: '79775350c5324bd19a9cfdb823e4210b'
    })

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refresToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
        })
})


app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'e37916d70d074851b71315a78030cbac',
        clientSecret: '79775350c5324bd19a9cfdb823e4210b',
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(
        (data) => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
            // Save the access token so that it's used in future calls
            // spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.listen(3001);
console.log('listening on port 3001');