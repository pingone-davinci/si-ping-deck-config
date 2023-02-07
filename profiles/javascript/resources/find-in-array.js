const __myDevices__ = [{ type: "sms", value: '555-1212' }, { type: "device", value: 'mobile' }, { type: "email", value: 'test@test.com' }];

// Note find only returns the first match, if you need all, use the filter function
const __myDevice__ = __myDevices__.find(device => device.type === 'sms');
console.log(__myDevice__);