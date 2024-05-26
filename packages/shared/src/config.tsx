import React from "react";

type BaseConfigType = object;

export const ConfigContext = React.createContext<BaseConfigType>({});

interface ConfigProviderProps<T extends BaseConfigType> {
  config: T;
}

export function ConfigProvider<T extends BaseConfigType>(
  props: React.PropsWithChildren<ConfigProviderProps<T>>,
) {
  const { config } = props;

  return (
    <ConfigContext.Provider value={config}>
      {props.children}
    </ConfigContext.Provider>
  );
}

export function useConfig<T extends BaseConfigType>(): T {
  return React.useContext(ConfigContext) as T;
}
