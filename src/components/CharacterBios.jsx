import React from 'react';
import './CharacterBios.css';

const characters = [
    {
        name: "Peter Parker",
        alias: "Spider-Man",
        color: "#E50914",
        image: "/Peter_Parker_BIO.png",
        objectPosition: "center",
        description: "El Spider-Man original. Después de ser mordido por una araña radiactiva, Peter dedica su vida a proteger Nueva York bajo el mantra: 'Un gran poder conlleva una gran responsabilidad'.",
        powers: ["Sentido Arácnido", "Fuerza Proporcional", "Adherencia a muros"]
    },
    {
        name: "Miles Morales",
        alias: "Spider-Man",
        color: "#000000",
        image: "/mikemorales.webp",
        objectPosition: "center",
        description: "Protegiendo su propio rincón de Brooklyn, Miles posee habilidades únicas que lo diferencian de Peter, incluyendo el camuflaje y ataques bio-eléctricos.",
        powers: ["Golpe Veneno", "Camuflaje", "Ráfaga de Energía"]
    },
    {
        name: "Gwen Stacy",
        alias: "Spider-Gwen",
        color: "#ff69b4",
        image: "/gwenstacy.jpg",
        objectPosition: "center 35%",
        description: "En su universo, fue ella quien recibió la mordida arácnida. Una baterista talentosa que lucha contra el crimen con elegancia y agilidad única.",
        powers: ["Agilidad Extrema", "Viaje Dimensional", "Sentido Refinado"]
    }
];

const CharacterBios = () => {
    return (
        <section id="bios" className="character-bios-section pt-5 pb-10">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-11 pt-7 mt-10"> {/* Significantly increased top spacing */}
                        <div className="text-start mb-7" data-aos="fade-up">
                            <h2 className="section-title brutalist-text">RED DE HÉROES</h2>
                            <p className="lead mt-3">Conoce a los rostros detrás de la máscara</p>
                        </div>

                        <div className="row g-4">
                            {characters.map((char, index) => (
                                <div className="col-lg-4 col-md-6 mb-4" key={char.name} data-aos="fade-up" data-aos-delay={index * 100}>
                                    <article className="game-card neomorph">
                                        <div className="game-media-wrapper">
                                            <img
                                                src={char.image}
                                                alt={char.name}
                                                className="game-image"
                                                style={{ objectPosition: char.objectPosition }}
                                            />
                                            <div className="game-platform">
                                                <span className="badge neomorph">
                                                    {char.alias}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="game-content">
                                            <h3 className="brutalist-text">{char.name}</h3>
                                            <p>{char.description}</p>
                                            <div className="game-features">
                                                {char.powers.map((power, i) => (
                                                    <span className="feature-badge" key={i}>{power}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CharacterBios;
