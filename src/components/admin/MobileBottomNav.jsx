import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const items = [
    { path: "/admin-dashboard", icon: "📊", label: "Home" },
    { path: "/admin-champions", icon: "🏆", label: "Champs" },
    { path: "/admin-gallery", icon: "🖼️", label: "Gallery" },
    { path: "/admin-emails", icon: "📧", label: "Emails" },
];

const MobileBottomNav = () => {
    const location = useLocation();

    return (
        <>
            <style>{`
                .mobile-bottom-nav {
                    -webkit-tap-highlight-color: transparent;
                }
                
                @media (max-width: 768px) {
                    .mobile-bottom-nav button,
                    .mobile-bottom-nav a {
                        min-height: 44px;
                        min-width: 44px;
                    }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }

                .bottom-nav-animate {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>

            <motion.nav
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 flex justify-around items-end pb-2 pt-1 z-50 safe-bottom"
                aria-label="Mobile navigation"
            >
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all touch-target
                            ${isActive ? 'text-cyan-400' : 'text-slate-500'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.2 : 1,
                                        y: isActive ? -2 : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="text-2xl"
                                >
                                    {item.icon}
                                </motion.div>

                                <motion.span
                                    animate={{
                                        opacity: isActive ? 1 : 0.7,
                                    }}
                                    className="text-[10px] font-medium"
                                >
                                    {item.label}
                                </motion.span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeBottomIndicator"
                                        className="absolute -top-1 w-8 h-0.5 bg-cyan-400 rounded-full"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </motion.nav>
        </>
    );
};

export default MobileBottomNav;