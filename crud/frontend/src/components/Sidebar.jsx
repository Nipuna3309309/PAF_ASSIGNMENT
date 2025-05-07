import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    PostAdd,
    AccountCircle,
    ExitToApp,
    Close as CloseIcon,
    Share as ShareIcon
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

const Sidebar = ({ isOpen, toggleSidebar, navigate, handleLogout }) => {
    // Animation variants for sidebar
    const sidebarVariants = {
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
            }
        },
        closed: {
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.2
            }
        }
    };

    // Menu items array for easier management
    const menuItems = [
        {
            icon: <Home />,
            text: 'Home',
            onClick: () => { navigate('/'); toggleSidebar(); },
            highlight: false
        },
        {
            icon: <PostAdd />,
            text: 'My Posts',
            onClick: () => { navigate('/mypost'); toggleSidebar(); },
            highlight: false
        },
        {
            icon: <ShareIcon />,
            text: 'Shared Posts',
            onClick: () => { navigate('/shared'); toggleSidebar(); },
            highlight: true // Highlighted as requested
        },
        {
            icon: <AccountCircle />,
            text: 'My Profile',
            onClick: () => { navigate('/my-profile'); toggleSidebar(); },
            highlight: false
        }
    ];

    return (
        <>
            {/* Sidebar overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 sidebar-overlay md:hidden"
                    onClick={() => toggleSidebar(false)}
                />
            )}

            {/* Sidebar */}
            <AnimatePresence>
                <motion.div
                    className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg"
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    variants={sidebarVariants}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between h-20 shadow-md px-4">
                            <h1 className="text-3xl font-bold text-gray-800">Menu</h1>
                            <IconButton
                                className="md:hidden text-gray-600 hover:text-gray-900"
                                onClick={toggleSidebar}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <ul className="flex flex-col py-4">
                            {menuItems.map((item, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 5, color: "#4F46E5" }}
                                    className={item.highlight ? "relative" : ""}
                                >
                                    <a
                                        href="#"
                                        onClick={item.onClick}
                                        className={`flex items-center h-12 transform text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-2 rounded-lg mx-2 ${
                                            item.highlight ? "bg-indigo-50 border-l-4 border-indigo-500" : ""
                                        }`}
                                    >
                    <span className={`inline-flex items-center justify-center h-12 w-12 text-lg ${
                        item.highlight ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
                    }`}>
                      {item.icon}
                    </span>
                                        <span className={`text-sm font-medium ${item.highlight ? "text-indigo-600" : ""}`}>
                      {item.text}
                    </span>

                                        {item.highlight && (
                                            <motion.span
                                                className="absolute right-3 top-3 w-2 h-2 bg-indigo-600 rounded-full"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: [0.8, 1.2, 1] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                    duration: 1.5
                                                }}
                                            />
                                        )}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="mt-auto mb-4">
                            <motion.a
                                href="#"
                                onClick={handleLogout}
                                className="flex items-center h-12 px-4 mx-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                whileHover={{ x: 5, color: "#EF4444" }}
                            >
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-500 hover:text-red-600">
                  <ExitToApp />
                </span>
                                <span className="text-sm font-medium">Logout</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    );
};

export default Sidebar;