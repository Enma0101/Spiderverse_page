import React from 'react';
import './UniverseTimeline.css';

const timelineEvents = [
    { year: '1962', title: 'Amazing Fantasy #15', desc: 'Primera aparición de Spider-Man creada por Stan Lee y Steve Ditko.', category: 'comic' },
    { year: '2002', title: 'Spider-Man (Película)', desc: 'Tobey Maguire protagoniza la primera gran película dirigida por Sam Raimi.', category: 'movie' },
    { year: '2011', title: 'Miles Morales Debuta', desc: 'La primera aparición de Miles en Ultimate Fallout #4.', category: 'comic' },
    { year: '2018', title: 'Marvel\'s Spider-Man', desc: 'Lanzamiento del exitoso videojuego de Insomniac Games para PS4.', category: 'game' },
    { year: '2023', title: 'Spider-Man 2', desc: 'Peter y Miles unen fuerzas contra Venom en PS5.', category: 'game' }
];

const UniverseTimeline = () => {
    return (
        <section className="universe-timeline py-4">
            <h3 className="brutalist-text mb-4 text-white">CRONOLOGÍA ARÁCNIDA</h3>
            <div className="timeline-container">
                {timelineEvents.map((event, index) => (
                    <div key={index} className="timeline-item" data-aos="fade-left" data-aos-delay={index * 100}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content neomorph">
                            <span className="timeline-year">{event.year}</span>
                            <h4 className="timeline-title">{event.title}</h4>
                            <p className="timeline-desc small text-muted mb-0">{event.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UniverseTimeline;
