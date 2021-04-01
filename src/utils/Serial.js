import Msp from './Msp';
import FourWay from './FourWay';

import {
  QueueProcessor,
} from './helpers/QueueProcessor';

/**
 * Abstraction layer for all serial communication
 *
 * Serial commands are added to the QueueProcessor, meaning that this is our
 * only way for commands to be executed. They are executed in FIFO manner: the
 * first command in, is the first one to be processed.
 *
 * The queue Processor is agnostic of the current protocol, not matter if it is
 * a MSP, 4-Way interface or completyly custom command, they all go through
 * this queue.
 *
 * This ensures that no race conditions can happen during serial communication.
 * No command will be written until the previous one is finished processing.
 */
class Serial {
  constructor(port) {
    this.port = port;
    this.baudRate = 115200;
    this.msp = null;
    this.fourWay = null;
    this.writer = null;
    this.reader = null;

    this.executeCommand = this.executeCommand.bind(this);
    this.getUtilization = this.getUtilization.bind(this);

    this.logCallback = null;
    this.packetErrorsCallback = null;
    this.utilizationCallback = null;

    this.qp = new QueueProcessor();

    this.sent = 0;
    this.sentTotal = 0;
    this.received = 0;
    this.receivedTotal = 0;
  }

  /**
   * Send a buffer via serial and process response with the response handler
   */
  async executeCommand(buffer, responseHandler) {
    const sendHandler = async function() {
      await this.writeBuffer(buffer);
    }.bind(this);

    return this.qp.addCommand(sendHandler, responseHandler);
  }

  setLogCallback(logCallback) {
    this.logCallback = logCallback;

    this.fourWay.setLogCallback(logCallback);
    this.msp.setLogCallback(logCallback);
  }

  setUtilizationCallback(utilizationCallback) {
    this.utilizationCallback = utilizationCallback;
  }

  setPacketErrorsCallback(packetErrorsCallback) {
    this.packetErrorsCallback = packetErrorsCallback;

    this.fourWay.setPacketErrorsCallback(packetErrorsCallback);
    this.msp.setPacketErrorsCallback(packetErrorsCallback);
  }

  async getApiVersion() {
    return this.msp.getApiVersion();
  }

  async getFcVariant() {
    return this.msp.getFcVariant();
  }

  async getFcVersion() {
    return this.msp.getFcVersion();
  }

  async getBuildInfo() {
    return this.msp.getBuildInfo();
  }

  async getBoardInfo() {
    return this.msp.getBoardInfo();
  }

  async getMotorData() {
    return this.msp.getMotorData();
  }

  async getUid() {
    return this.msp.getUid();
  }

  async getBatteryState() {
    return this.msp.getBatteryState();
  }

  async enable4WayInterface() {
    return this.msp.set4WayIf();
  }

  async spinMotor(index, speed) {
    return this.msp.spinMotor(index, speed);
  }

  async spinAllMotors(speed) {
    return this.msp.spinAllMotors(speed);
  }

  async fourWayWriteSettings(index, esc, settings) {
    return this.fourWay.writeSettings(index, esc, settings);
  }

  async fourWayWriteHex(index, esc, hex, force, migrate, cbProgress) {
    return this.fourWay.writeHex(index, esc, hex, force, migrate, cbProgress);
  }

  async fourWayStart() {
    this.fourWay.start();
  }

  async fourWayExit() {
    return this.fourWay.exit();
  }

  async fourWayReset(esc) {
    return this.fourWay.reset(esc);
  }

  async fourWayTestAlive() {
    return this.fourWay.testAlive();
  }

  async fourWayReadEEprom(address, bytes) {
    return this.fourWay.readEEprom(
      address,
      bytes
    );
  }

  async fourWayInitFlash(esc) {
    return this.fourWay.initFlash(esc);
  }

  async fourWayGetInfo(esc) {
    return this.fourWay.getInfo(esc);
  }

  async writeBuffer(buffer) {
    if(this.writer) {
      this.sent += buffer.byteLength;
      await this.writer.write(buffer);
    }
  }

  async startReader() {
    while(this.running) {
      try {
        const { value } = await this.reader.read();
        if(value) {
          this.received += value.byteLength;
          this.qp.addData(value);
        }
      } catch(e) {
        console.debug('Reader failed', e);
        return;
      }
    }
  }

  getUtilization() {
    const up = Math.round((this.sent * 10 / this.baudRate) * 100);
    const down = Math.round((this.received * 10 / this.baudRate) * 100);

    this.sentTotal += this.sent;
    this.receivedTotal += this.received;

    this.sent = 0;
    this.received = 0;

    return {
      up,
      down,
    };
  }

  async open(baudRate) {
    this.baudRate = baudRate;
    await this.port.open({ baudRate });

    try {
      this.writer = await this.port.writable.getWriter();
      this.reader = await this.port.readable.getReader();
    } catch(e) {
      console.debug('Port not read or writable');
      throw new Error('Port not read or writable');
    }

    this.msp = new Msp(this.executeCommand);
    this.fourWay = new FourWay(this.executeCommand);

    this.running = true;
    this.startReader();
  }

  async disconnect() {
    this.running = false;
    this.reader = null;
    this.writer = null;

    if(this.fourWay) {
      await this.fourWay.exit();
    }
  }

  async close() {
    this.running = false;

    if(this.reader) {
      this.reader.cancel();
      await this.reader.releaseLock();
    }

    if(this.writer) {
      await this.writer.releaseLock();
    }

    try {
      await this.port.close();
    } catch(e) {
      // we tried...
    }

    this.disconnect();
  }
}

export default Serial;
