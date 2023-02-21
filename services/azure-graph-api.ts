import { getGraphApiAsync } from "~/services/auth";

export interface AzureUser {
  id: string;
  createdDateTime: string;
  displayName: string;
}

export async function getAzureUserByName(
  displayName: string
): Promise<AzureUser[]> {
  return await getGraphApiAsync<AzureUser[]>(
    `/users?$search="displayName:${displayName}"`
  );
}
