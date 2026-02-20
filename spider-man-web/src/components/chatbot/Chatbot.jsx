import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const CHATBOT_OPTIONS = [
    {
        id: 1,
        icon: '🕷️',
        label: '¿Cuál es el origen de Spider-Man?',
        answer:
            'Peter Parker fue mordido por una araña radiactiva en Amazing Fantasy #15 (1962), creado por Stan Lee y Steve Ditko. Desde entonces, aprendió que "un gran poder conlleva una gran responsabilidad". 🕸️',
    },
    {
        id: 2,
        icon: '📚',
        label: '¿Cuáles son los mejores cómics?',
        answer:
            'Algunos imprescindibles:\n\n• The Amazing Spider-Man #129 — Primera aparición de Punisher.\n• Kraven\'s Last Hunt (1987) — Obra maestra oscura.\n• Spider-Man: Blue (2002) — Emotiva historia de Jeph Loeb.\n• Ultimate Spider-Man (2000) — Reinvención moderna perfecta. 🔥',
    },
    {
        id: 3,
        icon: '🦹',
        label: '¿Quiénes son los villanos principales?',
        answer:
            'Spider-Man tiene una de las mejores galerías de villanos: Green Goblin (Norman Osborn), Doctor Octopus, Venom, Kingpin, Mysterio, Electro, Sandman, y Carnage, entre muchos otros. ¡Cada uno es icónico! 💀',
    },
    {
        id: 4,
        icon: '🌀',
        label: '¿Qué es el Spider-Verse?',
        answer:
            'El Spider-Verse es un evento donde múltiples versiones de Spider-Man de distintas realidades se unen. Incluye a Miles Morales, Spider-Gwen, Spider-Man 2099, Spider-Noir, Spider-Ham y muchos más. ¡Un multiverso arácnido! 🌐',
    },
    {
        id: 5,
        icon: '📖',
        label: '¿Por dónde empiezo a leer?',
        answer:
            'Te recomendamos empezar por:\n\n• Ultimate Spider-Man (2000) — Ideal para nuevos lectores.\n• The Amazing Spider-Man de J. M. Straczynski — Moderno y profundo.\n• Spider-Man: Life Story — Resume toda la historia en 6 números. 📚',
    },
    {
        id: 6,
        icon: '📧',
        label: 'Contactar soporte',
        answer:
            '¡Con gusto te ayudamos! Puedes contactarnos a través de nuestras redes sociales (Twitter, Facebook, Instagram) o escribirnos directamente a soporte@comicsspider.com. Te responderemos lo antes posible. 💬',
    },
];

const WELCOME_MESSAGE = '¡Hola, héroe! 🕷️ Soy el asistente de Comics Spider. ¿En qué puedo ayudarte hoy?';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const toggleChat = () => {
        const nextOpen = !isOpen;
        setIsOpen(nextOpen);

        // Show welcome message on first open
        if (nextOpen && !hasOpened) {
            setHasOpened(true);
            setMessages([{ type: 'bot', text: WELCOME_MESSAGE }]);
        }
    };

    // Send a message and get the bot response
    const sendMessage = (text, option) => {
        if (!text.trim()) return;

        // Add user message
        setMessages((prev) => [...prev, { type: 'user', text }]);
        setInputValue('');
        setShowMenu(false);
        setIsTyping(true);

        // Determine the bot response
        const matchedOption = option || CHATBOT_OPTIONS.find(
            (opt) => opt.label.toLowerCase() === text.trim().toLowerCase()
        );

        const botResponse = matchedOption
            ? matchedOption.answer
            : '¡Gracias por tu mensaje! 🕷️ Puedes seleccionar una opción del menú para obtener respuestas más detalladas.';

        // Simulate typing delay then show bot response
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, { type: 'bot', text: botResponse }]);

        }, 1000 + Math.random() * 500);
    };

    // Toggle the + menu
    const toggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    // Handle clicking an option from the menu
    const handleOptionClick = (option) => {
        setInputValue(option.label);
        setShowMenu(false);

        setTimeout(() => {
            sendMessage(option.label, option);
        }, 350);
    };

    // Handle manual send
    const handleSend = () => {
        sendMessage(inputValue);
    };

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-avatar">
                        <i className="fas fa-spider"></i>
                    </div>
                    <div className="chatbot-header-info">
                        <h4>Comics Spider</h4>
                        <span>En línea</span>
                    </div>
                    <button
                        className="chatbot-close"
                        onClick={() => setIsOpen(false)}
                        aria-label="Cerrar chat"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Messages */}
                <div className="chatbot-messages">
                    {/* Imágenes de telaraña que se mueven con el scroll */}
                    <div className="chatbot-web-bg chatbot-web-1"></div>
                    <div className="chatbot-web-bg chatbot-web-2"></div>

                    {messages.map((msg, index) => (
                        <div key={index} className={`chatbot-message ${msg.type}`}>
                            {msg.text.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    {i < msg.text.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="chatbot-typing">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="chatbot-input-bar">
                    <div className="chatbot-menu-wrapper">
                        <button
                            className={`chatbot-menu-btn ${showMenu ? 'active' : ''}`}
                            onClick={toggleMenu}
                            aria-label="Abrir menú de opciones"
                        >
                            <i className="fas fa-plus"></i>
                        </button>

                        {/* Popup Menu */}
                        {showMenu && (
                            <div className="chatbot-popup-menu">
                                {CHATBOT_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        className="chatbot-popup-option"
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        <span className="chatbot-popup-icon">{option.icon}</span>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        className="chatbot-input"
                        placeholder="Escribe un mensaje..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="chatbot-send-btn"
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        aria-label="Enviar mensaje"
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            {/* Floating Toggle Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? 'Cerrar chatbot' : 'Abrir chatbot'}
                id="chatbot-toggle-btn"
            >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-spider'}`}></i>
            </button>
        </>
    );
};

export default Chatbot;