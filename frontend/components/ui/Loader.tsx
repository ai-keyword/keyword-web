const Loader = () => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <div className="flex w-full justify-center py-2">
                <div className="flex space-x-2 py-4">
                    <div className="h-4 w-4 animate-bounce rounded-full border-white bg-linear-to-r from-yellow-400 to-orange-400 [animation-delay:-0.3s]" />
                    <div className="h-4 w-4 animate-bounce rounded-full border-white bg-linear-to-r from-yellow-300 to-orange-300 [animation-delay:-0.15s]" />
                    <div className="h-4 w-4 animate-bounce rounded-full border-white bg-linear-to-r from-yellow-200 to-orange-200" />
                    <div className="h-4 w-4 animate-bounce rounded-full border-white bg-linear-to-r from-yellow-100 to-orange-100 [animation-delay:0.15s]" />
                </div>
            </div>
        </div>
    );
};

export default Loader;
