import React, { useState } from 'react';
import './SpotifyPlayer.css';

const SpotifyPlayer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTrack, setActiveTrack] = useState('0mP7vD8Y9A6k1W3P7X5XjW'); // Spider-Man 2 PS5

    const soundtracks = [
        { name: 'Spider-Man 2 (Juego)', id: '0mP7vD8Y9A6k1W3P7X5XjW' },
        { name: 'Into the Spider-Verse', id: '3p79S9H95Zoy79pT5vSOf6' },
        { name: 'No Way Home', id: '3SioSAbh4R20H39l2f7G5A' }
    ];

    return (
        <div className={`spotify-widget-container ${isOpen ? 'open' : 'closed'}`}>
            <button 
                className="spotify-toggle neomorph" 
                onClick={() => setIsOpen(!isOpen)}
                title="Reproductor de Música"
            >
                <i className={`${isOpen ? 'fas fa-times' : 'fab fa-spotify'}`}></i>
                {!isOpen && <span className="music-label">Música</span>}
            </button>

            {isOpen && (
                <div className="spotify-player-card neomorph">
                    <div className="spotify-header">
                        <span className="brutalist-text small">Soundtracks</span>
                        <div className="soundtrack-selector">
                            {soundtracks.map(track => (
                                <button 
                                    key={track.id}
                                    className={`track-btn ${activeTrack === track.id ? 'active' : ''}`}
                                    onClick={() => setActiveTrack(track.id)}
                                >
                                    {track.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <iframe 
                        src={`https://open.spotify.com/embed/album/${activeTrack}?utm_source=generator&theme=0`} 
                        width="100%" 
                        height="352" 
                        frameBorder="0" 
                        allowFullScreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        title="Spotify Player"
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default SpotifyPlayer;
