import React from 'react';
import MelService from "../services/mel-service";
import {Link} from "react-router-dom";

export default class ArtistView extends React.Component {
    constructor(props) {
        super();
        this.state = {};
        this._melService = new MelService();
        this._melService.getArtist(props.match.params.artistId).then(artist => {
            this.state.artist = artist;
            this.setState(this.state);
        });
    }

    renderAlbumList() {
        return this.state.artist.albums
            .sort((a, b) => b.year - a.year)
            .map(album =>
            <Link key={album.id} to={{pathname: "/album/" + album.id}}>
                <div>
                    {album.year} {album.title}
                </div>
            </Link>);
    }

    renderFeatureAlbumList() {
        return this.state.artist.featureAlbums
            .sort((a, b) => b.year - a.year)
            .map(album =>
            <Link key={album.id} to={{pathname: "/album/" + album.id}}>
                <div>
                    {album.year} {album.title}
                </div>
            </Link>)
    }

    render() {
        if (this.state.artist) {
            return <div>
                <Link to="/">{"< Library"}</Link>
                <h1>{this.state.artist.name}</h1>
                <h2>Albums</h2>
                {this.renderAlbumList()}
                <h2>Appears on</h2>
                {this.renderFeatureAlbumList()}
            </div>
        } else {
            return <div>Loading ...</div>
        }
    }
}