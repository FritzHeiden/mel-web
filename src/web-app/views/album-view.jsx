import React from 'react';
import {Link} from 'react-router-dom';
import MelService from "../services/mel-service";
import sass from './album-view.sass';

export default class AlbumView extends React.Component {
    constructor(props) {
        super();
        this.state = {};
        this._melService = new MelService();
        this._melService.getAlbum(props.match.params.albumId).then(album => {
            this.state.album = album;
            this.setState(this.state);
        });
    }

    renderTrackList() {
        return this.state.album.tracks
            .sort((a, b) => a.number - b.number)
            .map(track => {
                console.log(track);
                let listArtists = (artists) => {
                    if (artists) {
                        return track.artists.map((artist, index) =>
                            <Link to={{pathname: /artist/ + artist.id}}>
                            <span>
                                {artist.name}{index + 1 === album.artists.length ? "" : ", "}
                            </span>
                            </Link>)
                    } else {
                        return "";
                    }
                };
                return <div key={track.id}>
                    <span>{track.number} </span>
                    <span>{track.title}</span>
                    {listArtists(track.artists)}
                </div>
            });
    }

    renderOtherAlbums() {
        console.log(this.state.album.artist.albums);
        return this.state.album.artist.albums.map(album =>
            <div key={album.id}>
                <span>{album.year} </span>
                <span>{album.title}</span>
            </div>)
    }

    render() {
        if (this.state.album) {
            return <div>
                <Link key="library_link" to="/">
                    <p>
                        {"< Library"}
                    </p>
                </Link>
                <Link key="artist_link" to={{pathname: "/artist/" + this.state.album.artist.id}}>
                    <p>
                        {"< " + this.state.album.artist.name}
                    </p>
                </Link>
                <h1>{this.state.album.title}</h1>
                {this.renderTrackList()}
            </div>;
        } else {
            return <div>Loading ...</div>;
        }
    }
}