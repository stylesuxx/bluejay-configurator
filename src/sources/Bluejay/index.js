import Source, {
  PLATFORMS,
} from '../Source.js';

import EEPROM from './eeprom';

import VERSIONS_LOCAL from './versions.json';
import ESCS_LOCAL from './escs.json';

const VERSIONS_REMOTE = 'https://raw.githubusercontent.com/mathiasvr/bluejay-configurator/bluejay/js/bluejay_versions.json';
const ESCS_REMOTE = 'https://raw.githubusercontent.com/mathiasvr/bluejay-configurator/bluejay/js/bluejay_escs.json';

function buildDisplayName(flash, make) {
  const settings = flash.settings;
  let revision = 'Unsupported/Unrecognized';
  if(settings.MAIN_REVISION !== undefined && settings.SUB_REVISION !== undefined) {
    revision = `${settings.MAIN_REVISION}.${settings.SUB_REVISION}`;
  }

  const pwm = settings.__PWM_FREQUENCY;
  const name = `${settings.NAME.trim()}`;

  return `${make} - ${name}, ${revision}, ${pwm}kHz`;
}

const pwmOptions = [24, 48, 96];
const bluejayConfig = new Source(
  'Bluejay',
  PLATFORMS.SILABS,
  VERSIONS_REMOTE,
  ESCS_REMOTE,
  EEPROM,
  VERSIONS_LOCAL,
  ESCS_LOCAL,
  pwmOptions
);

export {
  buildDisplayName,
  EEPROM,
};

export default bluejayConfig;
