import base64url from 'base64url';
import { detect } from 'detect-browser';
import * as Fingerprint2 from 'fingerprintjs2';

class DeviceInfo {
  private deviceId: string;
  private platform: string = 'web';
  private deviceName: string;

  constructor(deviceId: string, deviceName: string) {
    this.deviceId = deviceId;
    this.deviceName = deviceName;
  }

  public description(): string {
    const info = {
      device_id: this.deviceId,
      device_name: this.deviceName,
      device_platform: this.platform,

    };
    return base64url.encode(JSON.stringify(info));
  }
}

export default class DeviceManager {
  public static getInstance(): DeviceManager {
    DeviceManager.instance = DeviceManager.instance || new DeviceManager();
    return DeviceManager.instance;
  }
  private static instance: DeviceManager;
  public deviceInfo?: DeviceInfo;

  constructor() {
    if (DeviceManager.instance) {
      throw new Error('Error - use Device.getInstance()');
    }
  }

  public async getDeviceinfo(): Promise<string> {
    if (this.deviceInfo != null) {
      return this.deviceInfo!.description();
    } else {
      const components = await Fingerprint2.getPromise();
      const values = components.map((component) => component.value);

      const hashCode = Fingerprint2.x64hash128(values.join(''), 31);
      const platform = this.getExplorerInfo();
      this.deviceInfo = new DeviceInfo(hashCode, `${platform}`);
      return this.deviceInfo.description();
    }
  }

  public getExplorerInfo(): string {
    const browser = detect();
    if (browser) {
      return `${browser.name}/${browser.version}`;
    } else {
      return `unknow`;
    }
  }
}
