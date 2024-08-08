import { PluginExposedComponent } from '@grafana/data';

import { PluginPreloadResult } from '../../pluginPreloader';

import { Registry } from './Registry';

export type RegistryType = {
  [id: string]: PluginExposedComponent;
};

export class ExposedComponentRegistry extends Registry<RegistryType> {
  constructor(initialState: RegistryType = {}) {
    super({
      initialState,
    });
  }

  mapToRegistry(registry: RegistryType, item: PluginPreloadResult): RegistryType {
    const { pluginId, exposedComponents, error } = item;

    if (error) {
      console.log({
        message: 'Plugin failed to load, skip exposing its components.',
        pluginId,
        error,
      });
      return registry;
    }

    if (!exposedComponents) {
      return registry;
    }

    for (const config of exposedComponents) {
      const { id } = config;

      // check if config is valid, skip and warn if invalid.
      // if(isConfigValid(config)) { ... }

      if (registry[id]) {
        // log a warning that a component already exists for that id.
        continue;
      }

      registry[id] = config;
    }

    return registry;
  }
}