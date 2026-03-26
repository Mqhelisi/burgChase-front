import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppButton = ({ phoneNumber, message, children }) => {
  // Ensure the phone number is correctly formatted (e.g., 15551234567)
  const formattedPhoneNumber = phoneNumber.replace(/[\s\-\+\(\)]/g, ''); 
  
  // URL-encode the message to handle spaces and special characters
  const encodedMessage = encodeURIComponent(message);
  
  // Construct the final URL
  const href = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;

  return (
    <a 
      href={href} 
      target="_blank" // Opens the link in a new tab
      rel="noopener noreferrer" // Security best practice for target="_blank"
    >
      {/* You can style this as a button using CSS or a UI library */}
      
      <motion.button
              className="btn-primary w-full text-lg mb-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Seller
            </motion.button>
      
      {/* <button>
        {children || 'Chat on WhatsApp'}
      </button> */}
    </a>
  );
};

export default WhatsAppButton;
