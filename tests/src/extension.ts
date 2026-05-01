// @ts-nocheck

// Implements the necessary functionality to load the REX modules into the 
// extension's UI context.

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { type REXUIDefinition } from '@bric/rex-core/common'
import { rexCorePlugin, REXExtensionModule, registerREXModule } from '@bric/rex-core/extension'

rexCorePlugin.loadInitialConfigation('config.json')
  .then(function(result) {
    console.log(`Initial configuration loaded: ${result}`);

    rexCorePlugin.refreshInterface()
  }, function (error) {
    console.log(`Error loading initial configuration: ${error}`);

    rexCorePlugin.refreshInterface()
  })

class MainScreenExtensionModule extends REXExtensionModule {
  setup() {}

  activateInterface(uiDefinition:REXUIDefinition):boolean {
    if (uiDefinition.identifier == 'main') {
      return true
    }

    return false
  }
}

registerREXModule(new MainScreenExtensionModule())

