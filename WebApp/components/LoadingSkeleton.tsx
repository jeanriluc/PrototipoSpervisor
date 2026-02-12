
import React from 'react';

interface LoadingSkeletonProps {
    rows?: number;
    type?: 'table' | 'card' | 'list';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 5, type = 'table' }) => {
    if (type === 'table') {
        return (
            <div className="animate-pulse space-y-3 p-6">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="h-4 w-20 bg-slate-200 rounded-lg" />
                        <div className="h-4 flex-1 bg-slate-200 rounded-lg" />
                        <div className="h-4 w-24 bg-slate-200 rounded-lg" />
                        <div className="h-4 w-32 bg-slate-200 rounded-lg" />
                        <div className="h-4 w-28 bg-slate-200 rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'card') {
        return (
            <div className="animate-pulse space-y-4 p-6">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-1/3" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-slate-200 rounded" />
                            <div className="h-3 bg-slate-200 rounded w-5/6" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Default: list type
    return (
        <div className="animate-pulse space-y-3 p-6">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded-2xl" />
            ))}
        </div>
    );
};

export default LoadingSkeleton;
