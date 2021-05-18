import React, { Component } from "react";
import "./App.css";
import SpotifyWebApi from "spotify-web-api-node";
const spotifyApi = new SpotifyWebApi({
  clientId: "9de60cf124664566814ebed4b610ec20",
  clientSecret: "33233674abb641dc8a3083503388e8ad",
  redirectUri: "http://localhost:8000/callback",
});

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    console.log(params);
    const token = params.access_token;
    const refresh = params.refresh_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.setRefreshToken(refresh);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: "Not Checked", albumArt: "" },
      currentDisplay: "",
      topSongs: [],
      topArtists: [],
      topAlbums: [],
    };
  }

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    this.setState({
      currentDisplay: "playing",
    });
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      console.log(response);
      this.setState({
        nowPlaying: {
          name: response.body.item.name,
          albumArt: response.body.item.album.images[0].url,
        },
      });
    });
  }

  getMyCurrentPlayingTrack() {
    spotifyApi.getMyCurrentPlayingTrack().then((response) => {
      console.log(response);
    });
  }

  getTopTracks() {
    this.setState({
      currentDisplay: "song",
    });
    spotifyApi.getMyTopTracks().then((response) => {
      console.log(response);
      this.setState({
        topSongs: response.body.items,
      });
    });
  }

  getTopArtists() {
    this.setState({
      currentDisplay: "artists",
    });
    spotifyApi.getMyTopArtists().then((response) => {
      console.log(response);
      this.setState({ topArtists: response.body.items });
    });
  }

  render() {
    const logInButton = this.state.loggedIn ? (
      <div></div>
    ) : (
      <a href="http://localhost:8000/login"> Login </a>
    );

    let currentDisplay = <div></div>;
    if (this.state.currentDisplay === "playing") {
      currentDisplay = (
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 500 }} />
        </div>
      );
    } else if (this.state.currentDisplay === "song") {
      currentDisplay = (
        <div>
          {Array.from(this.state.topSongs, (element, index) => (
            <div>{index + 1 + ". " + element.name}</div>
          ))}
        </div>
      );
    } else if (this.state.currentDisplay === "artists") {
      currentDisplay = (
        <div>
          {Array.from(this.state.topArtists, (element, index) => (
            <div>{index + 1 + ". " + element.name}</div>
          ))}
        </div>
      );
    }

    return (
      <div className="App">
        {logInButton}
        <div>Now Playing: {this.state.nowPlaying.name}</div>
        {currentDisplay}
        {this.state.loggedIn && (
          <div>
            <button onClick={() => this.getNowPlaying()}>
              Check Now Playing
            </button>
            <button onClick={() => this.getTopArtists()}>
              Check Top Artists
            </button>
            <button onClick={() => this.getTopTracks()}>Check Top Songs</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
