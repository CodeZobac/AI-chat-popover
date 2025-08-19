import './styles.css';
import { EticAIWidget } from './widget';
import { WidgetConfig } from './types';
declare global {
    interface Window {
        EticAI?: {
            config?: WidgetConfig;
            init?: (config?: WidgetConfig) => void;
            destroy?: () => void;
        };
        EticAIWidget?: typeof EticAIWidget;
    }
}
export { EticAIWidget };
export type { WidgetConfig } from './types';
