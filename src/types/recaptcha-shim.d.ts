/* eslint-disable no-unused-vars */
export {};

declare global {
    interface Window {
        grecaptcha: {
            render: (
                element: string,
                options: {
                    sitekey: string;
                    badge: string;
                    size: string;
                    callback: (token: string) => void;
                }
            ) => number;
            reset: (widgetId: string | number) => void;
            execute: (widgetId: string | number) => void;
        };
    }
}
