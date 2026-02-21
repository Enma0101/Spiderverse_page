import React from 'react';

const features = [
    {
        icon: "fa-bolt",
        title: "Carga Rápida",
        description: "Viaja por Marvel's New York casi al instante gracias al SSD de ultra alta velocidad de la consola PS5."
    },
    {
        icon: "fa-gamepad",
        title: "Haptic Feedback",
        description: "Siente cada golpe, disparo de telaraña y movimiento con la respuesta háptica del control DualSense."
    },
    {
        icon: "fa-headphones-alt",
        title: "Audio 3D Tempest",
        description: "Escucha la ciudad cobrar vida a tu alrededor con el audio espacial 3D en auriculares compatibles."
    },
    {
        icon: "fa-trophy",
        title: "Ray Tracing",
        description: "Disfruta de reflejos y sombras realistas que traen la ciudad de Nueva York a la vida con un detalle increíble."
    }
];

const Features = () => {
    return (
        <section id="features" className="features-section py-5">
            <div className="container py-5">
                <h2 className="section-title brutalist-text text-center mb-5" data-aos="fade-up">
                    CARACTERÍSTICAS
                </h2>

                <div className="row g-4">
                    {features.map((feature, index) => (
                        <div className="col-md-6 col-lg-3" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="feature-card neomorph h-100">
                                <div className="feature-icon">
                                    <i className={`fas ${feature.icon}`} aria-hidden="true"></i>
                                </div>
                                <h3 className="h5 mt-3">{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
