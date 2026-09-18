import { Channel } from "@notification/shared";
export type ProviderResult = { success: boolean; providerMessageId?: string; metadata?: Record<string, unknown>; error?: string };
export interface NotificationProvider { name: string; channel: Channel; send(payload: { subject?: string; content: string; recipient: Record<string, unknown> }): Promise<ProviderResult>; }
