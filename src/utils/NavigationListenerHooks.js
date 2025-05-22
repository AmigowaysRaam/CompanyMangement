import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";

export function useNavigationFocusHooks({
  onNavigationFocused,
  onNavigationExit,
}) {
  const navigation = useNavigation({});
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      onNavigationFocused();
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      onNavigationExit();
    });

    // Clean up the listeners when the component is unmounted
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  return {};
}
