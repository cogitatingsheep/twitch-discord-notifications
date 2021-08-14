const axios = require("axios");

// the Client ID from https://dev.twitch.tv/
const clientId = "";

// the Client Secret from https://dev.twitch.tv/
const clientSecret = "";

// the webhook url from Discord
const webhook = "";

// the target Twitch user
const userLogin = "";

const streamUrl = "https://www.twitch.tv/" + userLogin;
let token = "";
let icon = "";
let id = "";
let game = "";
let title = "";
let streamId = "";
let time = "";

// twitch authentication
const getToken = url => {
  axios({
    method: "post",
    url: url,
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials"
    }
  })
    .then(function(response) {
      console.log("token_set");
      token = response.data.access_token;
      getInfo(token);
    })
    .catch(function(error) {
      console.log(error);
    });
};

// get stream info
const getInfo = token => {
  // get the channel icon
  axios({
    method: "get",
    url: "https://api.twitch.tv/helix/users?login=" + userLogin,
    headers: {
      "Client-ID": clientId,
      Authorization: "Bearer " + token
    }
  })
    .then(function(response) {
      icon = response.data.data[0].profile_image_url;
      // get other channel info
      axios({
        method: "get",
        url: "https://api.twitch.tv/helix/streams?user_login=" + userLogin,
        headers: {
          "Client-ID": clientId,
          Authorization: "Bearer " + token
        }
      })
        .then(function(response) {
          console.log("info_received");

          if (response.data.data[0]) {
            // dont send if stream id the same
            if (streamId == response.data.data[0].id) {
              console.log("already sent");
              return;
            }

            id = response.data.data[0].user_name;
            game = response.data.data[0].game_name;
            time = response.data.data[0].started_at;
            title = response.data.data[0].title;
            streamId = response.data.data[0].id;

            sendHook();
            console.log("notification sent");
          } else {
            console.log("offline");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
};

// webhook notification to discord
const sendHook = () => {
  axios({
    method: "post",
    url: webhook,
    data: {
      content: "Hey @everyone, " + id + " just went live on Twitch!",
      embeds: [
        {
          title: title,
          url: streamUrl,
          color: 6570404,
          footer: {
            text: "Stream Started"
          },
          timestamp: time,
          image: {
            url:
              "https://static-cdn.jtvnw.net/previews-ttv/live_user_" +
              userLogin +
              "-640x360.jpg" +
              "?v=" +
              Math.round(Math.random() * 1000000)
          },
          author: {
            name: id + " is now streaming",
            icon_url: icon,
            url: streamUrl
          },
          description: "**Category:** " + game + "\n [Watch Stream](" + streamUrl + ")"
        }
      ]
    }
  })
    .then(function(response) {
      console.log(response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
};

// check stream info every minute
setInterval(() => {
  getToken(
    "https://id.twitch.tv/oauth2/token?client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret +
      "&grant_type=client_credentials"
  );
}, 60000);
