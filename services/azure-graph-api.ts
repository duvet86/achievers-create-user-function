import { getGraphApiAsync } from "~/services/auth";

export interface AzureUser {
  id: string;
  userPrincipalName: string;
  createdDateTime: string;
  mail: string;
}

export async function getAzureUserByMailAsync(
  mail: string
): Promise<AzureUser[]> {
  return await getGraphApiAsync<AzureUser[]>(
    `/users?$filter=mail eq '${mail}'`
  );
}
