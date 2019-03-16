declare class DeviceInfo {
    private deviceId;
    private platform;
    private deviceName;
    constructor(deviceId: string, deviceName: string);
    description(): string;
}
export default class DeviceManager {
    static getInstance(): DeviceManager;
    private static instance;
    deviceInfo?: DeviceInfo;
    constructor();
    getDeviceinfo(): Promise<string>;
    getExplorerInfo(): string;
}
export {};
