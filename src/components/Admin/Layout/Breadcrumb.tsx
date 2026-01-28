import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Convert path segment to readable label
    const getLabel = (segment: string) => {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <nav className="flex items-center gap-2 text-sm">
            {/* Home */}
            <Link
                to="/admin"
                className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
                <Home className="w-4 h-4" />
                <span>Home</span>
            </Link>

            {/* Dynamic breadcrumb items */}
            {pathnames.map((segment, index) => {
                const path = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                // Skip 'admin' segment as it's the home
                if (segment === 'admin') return null;

                return (
                    <React.Fragment key={path}>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {isLast ? (
                            <span className="text-gray-900 dark:text-white font-medium">
                                {getLabel(segment)}
                            </span>
                        ) : (
                            <Link
                                to={path}
                                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                {getLabel(segment)}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
