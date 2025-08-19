import { WidgetConfig } from '../types';
interface StandaloneChatWidgetProps {
    config: WidgetConfig;
    onMessage: (type: string, data: any) => void;
}
export declare function StandaloneChatWidget({ config, onMessage }: StandaloneChatWidgetProps): import("react/jsx-runtime").JSX.Element;
export {};
