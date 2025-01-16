import React from 'react';

const CurrentYear = new Date().getFullYear();

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3 fixed-bottom">
            <div className="container">
                <p className="mb-0">© {CurrentYear} MySchool. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;