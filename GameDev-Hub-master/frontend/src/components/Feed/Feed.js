import React, { useState, useEffect } from 'react';
import './Feed.css';

function Feed() {

    const [feed, setFeed] = useState([]);

    useEffect(() => {
        const getFeed = async () => {
            await fetch(`http://newsapi.org/v2/everything?q=videogames&language=en&from=2021-4-10&sortBy=publishedAt&apiKey=966900a91f5744b7bc3ea5ca7014bed9`, {
                method: "GET"
            })
                .then((res) => res.json())
                .then((finalRes) => {
                    setFeed(finalRes.articles);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        getFeed();
    }, []);

    return (
        <div className="feed">
            <div className="feedContainer">
                {
                    (feed) ? (
                        feed.map((each, index) => (
                            <div key={index} className="eachNews">
                                <h2 className="newsTitle">{each.title}</h2>
                                <h4 className="newsDesc">{each.description}</h4>
                                <h4 className="newsSource">Source: <h3 className="sourcelink" onClick={
                                    () => {
                                        window.open(`${each.source.name}`, "_blank");
                                    }
                                } >{each.source.name}</h3></h4>
                                <button onClick={() => {
                                    window.open(`${each.url}`, "_blank");
                                }}>Read More</button>
                            </div>
    
                        ))
                    ) : (<h1 style={{ marginTop: "100px", color: "darkgray" }}>Token expired for newsapi!</h1>) 
                }
            </div>
        </div>
    )
}

export default Feed;
