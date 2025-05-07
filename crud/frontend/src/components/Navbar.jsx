import React from 'react';
import { motion } from 'framer-motion';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Typography, IconButton } from '@mui/material';

const Navbar = ({ toggleSidebar }) => {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md z-10">
            <div className="flex items-center">
                <motion.button
                    onClick={toggleSidebar}
                    className="text-gray-500 focus:outline-none focus:text-indigo-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <MenuIcon />
                </motion.button>
                <motion.h1
                    className="ml-4 text-2xl font-bold text-gray-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    SkillShare Platform
                </motion.h1>
            </div>

            {/* Optional: Add profile/notification icons on the right */}
            <div className="flex items-center space-x-4">
                <motion.div
                    className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1, backgroundColor: "#E0E7FF" }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="text-indigo-600 text-lg">🔔</span>
                </motion.div>
                <motion.div
                    className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="text-white font-medium">U</span>
                </motion.div>
            </div>
        </header>
    );
};

export default Navbar;
