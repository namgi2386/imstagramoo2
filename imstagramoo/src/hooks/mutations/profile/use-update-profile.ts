import { updateProfile } from "@/api/profile";
import { QUERY_KEYS } from "@/lib/constants";
import type { ProfileEntitiy, UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfile(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.setQueryData<ProfileEntitiy>(
        QUERY_KEYS.profile.byId(updatedProfile.id),
        updatedProfile,
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
