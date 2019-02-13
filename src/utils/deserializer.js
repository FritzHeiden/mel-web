import { Track, Artist, Album } from "mel-core";

export default class Deserializer {
  deserializeTracks(tracks) {
    if (!tracks) return [];
    return tracks.map(track => this.deserializeTrack(track));
  }

  deserializeTrack(track) {
    if (!track || !track.getId()) return null;
    let id = track.getId();
    let title = track.getTitle() ? track.getTitle() : "Unknown Track";
    let artist = this.deserializeArtist(track.getArtist());
    let album = this.deserializeAlbum(track.getAlbum());
    let number = track.getNumber() ? track.getNumber() : 0;
    let discNumber = track.getDiscNumber() ? track.getDiscNumber() : 1;
    return new Track(id, title, artist, album, number, discNumber);
  }

  deserializeArtists(artists) {
    if (!artists) return [];
    return artists.map(artist => this.deserializeArtist(artist));
  }

  deserializeArtist(artist) {
    if (!artist || !artist.getId()) return null;
    let id = artist.getId();
    let name = artist.getName() ? artist.getName() : "Unknown Artist";
    let albums = this.deserializeAlbums(artist.getAlbums());
    let featureAlbums = this.deserializeAlbums(artist.getFeatureAlbums());
    return new Artist(id, name, albums, featureAlbums);
  }

  deserializeAlbums(albums) {
    if (!albums) return [];
    return albums.map(album => this.deserializeAlbum(album));
  }

  deserializeAlbum(album) {
    if (!album || !album.getId()) return null;
    let id = album.getId();
    let artist = this.deserializeArtist(album.getArtist());
    let title = album.getTitle() ? album.getTitle() : "Unknown Album";
    let year = album.getYear();
    let tracks = this.deserializeTracks(album.getTracks());
    let featureArtists = this.deserializeArtists(album.getFeatureArtists());
    return new Album(id, artist, title, year, tracks, featureArtists);
  }
}
