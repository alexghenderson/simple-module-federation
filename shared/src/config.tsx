import React from "react";

export const ConfigContext = React.createContext<Record<string, string>>({});

interface ConfigProviderProps<T extends Record<string, string>> {
  config: T;
}

export function ConfigProvider<T extends Record<string, string>>(
  props: React.PropsWithChildren<ConfigProviderProps<T>>,
) {
  const { config } = props;

  return (
    <ConfigContext.Provider value={config}>
      {props.children}
    </ConfigContext.Provider>
  );
}

export function useConfig<T extends Record<string, string>>(): T {
  return React.useContext(ConfigContext) as T;
}
