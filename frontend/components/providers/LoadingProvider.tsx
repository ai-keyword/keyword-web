"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/ui/Loader";

type LoadingContextValue = {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

type LoadingProviderProps = {
    children: ReactNode;
};

function LoadingOverlay({ visible }: { visible: boolean }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
            <div className="flex h-24 w-24 items-center justify-center">
                <Loader />
            </div>
        </div>
    );
}

export function LoadingProvider({ children }: LoadingProviderProps) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = useCallback(() => setIsLoading(true), []);
    const stopLoading = useCallback(() => setIsLoading(false), []);

    useEffect(() => {
        if (!isLoading) return;

        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 380);

        return () => clearTimeout(timeoutId);
    }, [isLoading, pathname]);

    const value = useMemo<LoadingContextValue>(
        () => ({ isLoading, startLoading, stopLoading }),
        [isLoading, startLoading, stopLoading],
    );

    return (
        <LoadingContext.Provider value={value}>
            {children}
            <LoadingOverlay visible={isLoading} />
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error("useLoading must be used inside LoadingProvider");
    }

    return context;
}
