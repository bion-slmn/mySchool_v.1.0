import React, { useState, useEffect } from "react";

const CurrentYear = new Date().getFullYear();

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY; // Pixels scrolled vertically
            const windowHeight = window.innerHeight; // Viewport height
            const documentHeight = document.body.scrollHeight; // Full page height
            const scrolledToBottom = scrollTop + windowHeight >= documentHeight - 1; // Adjust margin for precision

            setIsVisible(scrolledToBottom);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        isVisible && (
            <footer className="bg-dark text-white text-center py-3 fixed-bottom">
                <div className="container">
                    <p className="mb-0">© {CurrentYear} MySchool. All rights reserved.</p>
                </div>
            </footer>
        )
    );
};

export default Footer;
