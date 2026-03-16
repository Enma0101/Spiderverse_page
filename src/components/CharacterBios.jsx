import React from 'react';
import { motion } from 'framer-motion';
import './CharacterBios.css';

const characters = [
    {
        name: "Peter Parker",
        alias: "Spider-Man",
        color: "#e50914",
        image: "https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/spiderman.webp",
        description: "El Spider-Man original. Después de ser mordido por una araña radiactiva, Peter dedica su vida a proteger Nueva York bajo el mantra: 'Un gran poder conlleva una gran responsabilidad'.",
        powers: ["Sentido Arácnido", "Fuerza Proporcional", "Adherencia a muros"]
    },
    {
        name: "Miles Morales",
        alias: "Spider-Man",
        color: "#000000",
        image: "https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/spiderman.webp", // Fallback to same as I don't have Miles URL handy
        description: "Protegiendo su propio rincón de Brooklyn, Miles posee habilidades únicas que lo diferencian de Peter, incluyendo el camuflaje y ataques bio-eléctricos.",
        powers: ["Golpe Veneno", "Camuflaje", "Ráfaga de Energía"]
    },
    {
        name: "Gwen Stacy",
        alias: "Spider-Gwen",
        color: "#ff69b4",
        image: "https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/spiderman.webp",
        description: "En su universo, fue ella quien recibió la mordida arácnida. Una baterista talentosa que lucha contra el crimen con elegancia y agilidad única.",
        powers: ["Agilidad Extrema", "Viaje Dimensional", "Sentido Refinado"]
    }
];

const CharacterBios = () => {
    return (
        <section id="bios" className="character-bios-section py-5">
            <div className="container">
                <div className="text-center mb-5" data-aos="fade-up">
                    <h2 className="section-title brutalist-text text-white">RED DE HÉROES</h2>
                    <p className="text-muted mt-3">Conoce a los rostros detrás de la máscara</p>
                </div>

                <div className="row g-4">
                    {characters.map((char, index) => (
                        <div className="col-lg-4" key={char.name} data-aos="fade-up" data-aos-delay={index * 100}>
                            <motion.div 
                                className="char-card neomorph"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="char-image-container" style={{ '--char-color': char.color }}>
                                    <img src={char.image} alt={char.name} className="char-image" />
                                    <div className="char-alias-badge">{char.alias}</div>
                                </div>
                                <div className="char-info p-4">
                                    <h3 className="brutalist-text h4 mb-2">{char.name}</h3>
                                    <p className="small text-muted mb-3">{char.description}</p>
                                    <div className="char-powers d-flex flex-wrap gap-2">
                                        {char.powers.map(power => (
                                            <span key={power} className="power-tag">{power}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CharacterBios;
