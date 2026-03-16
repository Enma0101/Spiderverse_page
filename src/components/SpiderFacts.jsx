import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SpiderFacts.css';

const facts = [
    "Stan Lee casi descarta la idea de Spider-Man porque a la gente no le gustaban las arañas.",
    "El primer interés amoroso de Peter Parker en los cómics no fue Mary Jane, sino Betty Brant.",
    "Spider-Man fue el primer superhéroe adolescente en no ser un compañero (sidekick) de un adulto.",
    "En una realidad alternativa, Peter Parker se convierte en el villano 'The Spider'.",
    "La telaraña de Spider-Man es más fuerte que el acero y se disuelve después de una hora.",
    "Miles Morales debutó en 2011 en el universo 'Ultimate' tras la muerte de Peter Parker.",
    "Spider-Man ha formado parte de Los 4 Fantásticos bajo el nombre de la 'Fundación Futura'.",
    "El traje negro simbionte fue una idea de un fan que Marvel compró por 220 dólares."
];

const SpiderFacts = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % facts.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="spider-facts-container">
            <div className="fact-card neomorph">
                <div className="fact-header">
                    <i className="fas fa-spider fact-icon"></i>
                    <span className="fact-label fs-5">¿SABÍAS QUE...?</span>
                </div>
                <div className="fact-content">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="fact-text"
                        >
                            "{facts[index]}"
                        </motion.p>
                    </AnimatePresence>
                </div>
                <div className="fact-footer">
                    <div className="fact-progress-bg">
                        <motion.div 
                            key={index}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 8, ease: "linear" }}
                            className="fact-progress-bar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpiderFacts;
