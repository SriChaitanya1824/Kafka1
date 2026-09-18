import { Channel } from "@notification/shared";
import { mockEmailProvider, mockPushProvider, mockSmsProvider, inAppProvider } from "./mockProviders.js";
import { smtpProvider } from "./smtpProvider.js";
export function resolveProvider(channel: Channel) {
  if (channel === "EMAIL" && process.env.EMAIL_PROVIDER === "smtp") return smtpProvider;
  return { EMAIL: mockEmailProvider, SMS: mockSmsProvider, PUSH: mockPushProvider, IN_APP: inAppProvider }[channel];
}
