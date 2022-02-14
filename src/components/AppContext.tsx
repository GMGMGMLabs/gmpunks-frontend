import React from "react";

export interface AppContextType {
    web3: any,
    accounts: string[],
    saleContract: any,
    notify(msg: string): void
}
const defaultContext : AppContextType = {
    web3: null,
    accounts: [],
    saleContract: null,
    notify: () => {}
};
export const AppContext = React.createContext(defaultContext);