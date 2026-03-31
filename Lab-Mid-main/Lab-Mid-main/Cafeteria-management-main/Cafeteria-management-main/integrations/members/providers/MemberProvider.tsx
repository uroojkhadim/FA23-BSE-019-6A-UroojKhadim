import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { MemberActions, MemberContext, MemberState } from ".";
import { getCurrentMember } from "..";
import { useAuthStore } from "@/store/authStore";

interface MemberProviderProps {
  children: ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
  const authUser = useAuthStore((state) => state.user);
  const authLogout = useAuthStore((state) => state.logout);
  const [state, setState] = useState<MemberState>({
    member: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const updateState = useCallback((updates: Partial<MemberState>) => {
    setState((previous) => ({ ...previous, ...updates }));
  }, []);

  const loadCurrentMember = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });
      const member = await getCurrentMember();
      updateState({
        member,
        isAuthenticated: Boolean(member),
        isLoading: false,
      });
    } catch (error) {
      updateState({
        member: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load member",
      });
    }
  }, [updateState]);

  const actions: MemberActions = useMemo(
    () => ({
      loadCurrentMember,
      login: () => {
        window.location.href = "/login";
      },
      logout: () => {
        authLogout();
        updateState({
          member: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        window.location.href = "/";
      },
      clearMember: () => {
        updateState({
          member: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
    }),
    [authLogout, loadCurrentMember, updateState]
  );

  useEffect(() => {
    loadCurrentMember();
  }, [authUser, loadCurrentMember]);

  const contextValue = useMemo(
    () => ({
      ...state,
      actions,
    }),
    [actions, state]
  );

  return <MemberContext.Provider value={contextValue}>{children}</MemberContext.Provider>;
};
