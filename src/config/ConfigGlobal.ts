import { default as globalConfig } from '../ConfigGlobal';

export interface ConfigGlobal {
    readonly jsVersion: string;
    readonly pubKey: string;
    readonly subKey: string;
    readonly weatherKey: string;
    readonly weatherZipCode: string;
}

//
// NOTE: The global config file is static and compiled into the JS bundle.
// Because the file is included in the bundle, as code, it's loading is synchronous and immediate,
// not async.  This makes the global config a little easier to work with than if it was opened
// as a user file.
//

export class ConfigGlobalLoader {
    private static configGlobal: ConfigGlobal;

    private static Load(): ConfigGlobal {
        let config: ConfigGlobal;
        config = globalConfig;
        return config;
    }

    public static get config(): ConfigGlobal {
        if (ConfigGlobalLoader.configGlobal === undefined) {
            ConfigGlobalLoader.configGlobal = ConfigGlobalLoader.Load();
        }
        return ConfigGlobalLoader.configGlobal;
    }
}