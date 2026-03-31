import { useAuthStore } from "@/store/authStore";
import type { Member } from ".";

export const getCurrentMember = async (): Promise<Member | null> => {
  const user = useAuthStore.getState().user;
  if (!user) {
    return null;
  }

  const [firstName, ...rest] = (user.fullName || "").split(" ");
  const lastName = rest.join(" ").trim();

  return {
    _id: user._id,
    loginEmail: user.email,
    loginEmailVerified: true,
    contact: {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phones: user.phoneNumber ? [user.phoneNumber] : undefined,
    },
    profile: {
      nickname: user.fullName,
      title: user.role,
      photo: user.profilePicture ? { url: user.profilePicture } : undefined,
    },
    _updatedDate: new Date().toISOString(),
  };
};
