import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import LibraryView from "./views/library-view";
import ArtistView from "./views/artist-view";
import AlbumView from "./views/album-view";
import style from "./web-app.sass";

class WebApp extends React.Component {
    constructor() {
        super();
        console.log("Initializing WebApp");
    }

    render() {
        return <div className="web-app">

            <div id="content" className="content">
            <Router>
                <div>
                    <Route exact path="/" component={LibraryView}/>
                    <Route path="/artist/:artistId" component={ArtistView}/>
                    <Route path="/album/:albumId" component={AlbumView}/>
                </div>
            </Router>
            </div>
        </div>
    }
}

// const style = {
//     backgroundColor: "#202020",
//     color: "#656367",
//     display: "flex",
//     flexDirection: "column",
//     fontFamily: 'Open Sans',
//
//     content: {
//         padding: "20px",
//     },
//
//     width: "100%",
//     flex: 1,
//     padding: 0,
//     margin: 0,
// };

ReactDOM.render(<WebApp/>, document.getElementById('root'));