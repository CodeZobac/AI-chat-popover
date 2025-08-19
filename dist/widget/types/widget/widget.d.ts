import { WidgetConfig } from './types';
export declare class EticAIWidget {
    private config;
    private container;
    private shadowRoot;
    private reactRoot;
    private isInitialized;
    private messageHandlers;
    constructor(config: WidgetConfig);
    init(): void;
    destroy(): void;
    updateConfig(newConfig: Partial<WidgetConfig>): void;
    private createContainer;
    private setupShadowDOM;
    private injectStyles;
    private renderWidget;
    private setupMessageHandlers;
    private handleMessage;
    private sendMessage;
    on(eventType: string, handler: (data: any) => void): void;
    off(eventType: string): void;
}
