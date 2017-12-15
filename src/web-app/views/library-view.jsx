import React from 'react';
import MelService from "../services/mel-service";
import {Link} from 'react-router-dom';
import Heading from "../components/heading";
import ListView from "../components/list-view";
import sass from './library-view.sass';

export default class LibraryView extends React.Component {
    constructor() {
        super();
        this.state = {};
        this._melService = new MelService();
        this._melService.getArtists().then(artists => {
            this.state.artists = artists;
            this.setState(this.state);
        });
    }

    renderArtistList() {
        if (this.state.artists) {
            return this.state.artists
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((artist, index) =>
                <Link to={{pathname: "/artist/" + artist.id}} key={artist.id}>
                    <div className="list-item">
                        {artist.name}
                    </div>
                </Link>
            );
        } else {
            return <div>Loading ...</div>;
        }
    }

    render() {
        return <div className="library-view">
            <Heading>Library</Heading>
            <ListView className="list">
                {this.renderArtistList()}
            </ListView>

        </div>
    }
}