class TooManyParametersError extends Error {
  constructor(params) {
    super(`4way interface supports maximum of 256 params. ${params} passed`);
    this.params = params;
    this.name = 'TooManyParametersError';
  }
}

class UnknownPlatformError extends Error {
  constructor(platform) {
    super(`Unknown platform: ${platform}`);
    this.platform = platform;
    this.name = 'UnknownPlatformError';
  }
}

class BufferLengthMismatchError extends Error {
  constructor(buffer1, buffer2) {
    super(`byteLength of buffers do not match ${buffer1} vs. ${buffer2}`);
    this.buffer1 = buffer1;
    this.buffer2 = buffer2;
    this.name = 'BufferLengthMismatchError';
  }
}

class SettingsVerificationError extends Error {
  constructor(settingsWritten, settingsRead) {
    super('Failed to verify settings');
    this.settingsWritten = settingsWritten;
    this.settingsRead = settingsRead;
    this.name = 'SettingsVerificationError';
  }
}

class UnknownInterfaceError extends Error {
  constructor(interfaceMode) {
    super(`unknown interface: ${interfaceMode}`);
    this.interface = interfaceMode;
    this.name = 'UnknownInterfaceError';
  }
}

class UnknownMcuError extends Error {
  constructor(signature) {
    super(`unknown mcu: ${signature}`);
    this.signature = signature;
    this.name = 'UnknownMcuError';
  }
}

class InvalidHexFileError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidHexFileError';
  }
}

class EscInitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EscInitError';
  }
}

class EscLockedError extends Error {
  constructor(codeLockByte) {
    super(`ESC is locked (${codeLockByte})`);
    this.codeLockByte = codeLockByte;
    this.name = 'EscLockedError';
  }
}

export {
  BufferLengthMismatchError,
  EscInitError,
  EscLockedError,
  InvalidHexFileError,
  SettingsVerificationError,
  TooManyParametersError,
  UnknownInterfaceError,
  UnknownMcuError,
  UnknownPlatformError,
};
