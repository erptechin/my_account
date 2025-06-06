import { useEffect, useState } from 'react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowButton(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('App installed');
            }
            setDeferredPrompt(null);
            setShowButton(false);
        });
    };

    if (!showButton) return null;

    return (
        <button onClick={handleInstall} className="fixed left-1/2 -translate-x-1/2 bottom-0 bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto">
            Install App
        </button>
    );
}
