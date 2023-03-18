import { getGraphApiAsync, postGraphApiAsync } from "~/services/auth";

export interface AzureUser {
  id: string;
  userPrincipalName: string;
  createdDateTime: string;
  mail: string;
}

export interface AzureInviteRequest {
  invitedUserEmailAddress: string;
  inviteRedirectUrl: string;
  sendInvitationMessage: boolean;
}

export interface AzureInviteResponse {
  id: string;
  inviteRedeemUrl: string;
  invitedUserDisplayName: string;
  invitedUserEmailAddress: string;
  resetRedemption: boolean;
  sendInvitationMessage: boolean;
  invitedUserMessageInfo: {
    messageLanguage: string | null;
    ccRecipients: [
      {
        emailAddress: {
          name: string | null;
          address: string | null;
        };
      }
    ];
    customizedMessageBody: string | null;
  };
  inviteRedirectUrl: string;
  status: string;
  invitedUser: { id: string };
}

export async function getAzureUserByMailAsync(
  mail: string
): Promise<AzureUser | null> {
  const azureUsers = await getGraphApiAsync<AzureUser[]>(
    `/users?$filter=mail eq '${mail.trim()}'`
  );

  return azureUsers[0] ?? null;
}

export async function inviteUserToAzureAsync(
  azureInviteRequest: AzureInviteRequest
): Promise<AzureInviteResponse> {
  const response = await postGraphApiAsync<AzureInviteResponse>(
    "/invitations",
    azureInviteRequest
  );

  return response;
}
