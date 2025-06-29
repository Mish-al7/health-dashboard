import React, { useState, useEffect } from 'react';
import { Heart, Moon, Zap, Activity, AlertTriangle, CheckCircle, AlertCircle, Smartphone, Watch, Bluetooth, Wifi, RefreshCw } from 'lucide-react';
import './App.css';

const HealthApp = () => {
  const [vitals, setVitals] = useState({
    heartRate: 0,
    sleepHours: 0,
    oxygenLevel: 0,
    steps: 0,
    timestamp: null
  });
  
  const [deviceStatus, setDeviceStatus] = useState({
    appleWatch: { connected: false, lastSync: null, battery: 0 },
    iPhone: { connected: false, lastSync: null },
    bluetoothStatus: 'disconnected'
  });
  
  const [loading, setLoading] = useState(false);
  const [syncAnimation, setSyncAnimation] = useState(false);
  const [dataStream, setDataStream] = useState([]);

  // Simulate real-time device connection
  useEffect(() => {
    const connectDevices = () => {
      setTimeout(() => {
        setDeviceStatus({
          appleWatch: { 
            connected: true, 
            lastSync: new Date(), 
            battery: Math.floor(Math.random() * 30) + 70 
          },
          iPhone: { 
            connected: true, 
            lastSync: new Date() 
          },
          bluetoothStatus: 'connected'
        });
      }, 1000);
    };

    connectDevices();

    // Simulate periodic data updates from devices
    const interval = setInterval(() => {
      if (deviceStatus.appleWatch.connected) {
        fetchRealTimeData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceStatus.appleWatch.connected]);

  // Simulate fetching real-time data from connected devices
  const fetchRealTimeData = () => {
    const newHeartRate = Math.floor(Math.random() * 40) + 60;
    const newOxygen = Math.random() * 5 + 95;
    const timestamp = new Date();
    
    setVitals(prev => ({
      ...prev,
      heartRate: newHeartRate,
      oxygenLevel: newOxygen,
      steps: prev.steps + Math.floor(Math.random() * 50),
      timestamp
    }));

    // Add to data stream for demo
    setDataStream(prev => [...prev.slice(-4), {
      time: timestamp.toLocaleTimeString(),
      heartRate: newHeartRate,
      oxygen: newOxygen.toFixed(1)
    }]);
  };

  // Simulate comprehensive health data sync
  const syncWithDevices = async () => {
    setLoading(true);
    setSyncAnimation(true);
    
    // Simulate connecting to multiple data sources
    const dataSources = [
      'Apple HealthKit',
      'Apple Watch Sensors',
      'iPhone Motion Coprocessor',
      'Sleep Tracking Data',
      'Heart Rate Variability'
    ];
    
    for (let i = 0; i < dataSources.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Visual feedback of data source connection
    }
    
    // Simulate fetching comprehensive data
    setTimeout(() => {
      setVitals({
        heartRate: Math.floor(Math.random() * 40) + 60,
        sleepHours: Math.random() * 3 + 6,
        oxygenLevel: Math.random() * 5 + 95,
        steps: Math.floor(Math.random() * 5000) + 5000,
        timestamp: new Date()
      });
      
      setDeviceStatus(prev => ({
        ...prev,
        appleWatch: { ...prev.appleWatch, lastSync: new Date() },
        iPhone: { ...prev.iPhone, lastSync: new Date() }
      }));
      
      setLoading(false);
      setSyncAnimation(false);
    }, 2000);
  };

  // Health condition analysis
  const getHealthCondition = () => {
    const { heartRate, sleepHours, oxygenLevel } = vitals;
    let score = 0;
    let issues = [];

    if (heartRate >= 60 && heartRate <= 100) score += 1;
    else issues.push(`Heart rate ${heartRate < 60 ? 'too low' : 'elevated'}`);

    if (sleepHours >= 7 && sleepHours <= 9) score += 1;
    else issues.push(`${sleepHours < 7 ? 'Insufficient' : 'Excessive'} sleep`);

    if (oxygenLevel >= 95) score += 1;
    else issues.push('Low oxygen saturation');

    if (score === 3) return { status: 'excellent', message: 'All vitals optimal', color: 'text-green-600', icon: CheckCircle };
    if (score === 2) return { status: 'good', message: 'Most vitals healthy', color: 'text-yellow-600', icon: AlertCircle };
    return { status: 'attention needed', message: `Concerns: ${issues.join(', ')}`, color: 'text-red-600', icon: AlertTriangle };
  };

  const condition = getHealthCondition();
  const StatusIcon = condition.icon;

  const DeviceCard = ({ icon: Icon, name, status, lastSync, battery }) => (
    <div className="device-card">
      <div className="device-info">
        <div className="device-icon-name">
          <Icon className={`device-icon ${status.connected ? 'connected' : 'disconnected'}`} />
          <div>
            <p className="device-name">{name}</p>
            <p className={`device-status ${status.connected ? 'connected-text' : 'disconnected-text'}`}>
              {status.connected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>
        <div className="device-details">
          {status.connected && (
            <>
              <p className="sync-time">
                {lastSync ? `${lastSync.toLocaleTimeString()}` : 'Never'}
              </p>
              {battery && (
                <p className="battery-level">{battery}% battery</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const VitalCard = ({ icon: Icon, title, value, unit, status, color, isLive }) => (
    <div className="vital-card" style={{ borderLeftColor: color }}>
      {isLive && (
        <div className="live-indicator">
          <div className="live-dot"></div>
          <span className="live-text">LIVE</span>
        </div>
      )}
      <div className="vital-content">
        <div className="vital-info">
          <div className="vital-icon" style={{ backgroundColor: color + '20' }}>
            <Icon className="icon" style={{ color }} />
          </div>
          <div>
            <p className="vital-title">{title}</p>
            <p className="vital-value">
              {loading ? '...' : `${typeof value === 'number' ? value.toFixed(1) : value}${unit}`}
            </p>
          </div>
        </div>
        <div className="vital-status">
          <span className={`status-badge ${status}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );

  const getVitalStatus = (type, value) => {
    switch (type) {
      case 'heartRate':
        if (value >= 60 && value <= 100) return 'normal';
        return value < 60 ? 'low' : 'high';
      case 'sleep':
        if (value >= 7 && value <= 9) return 'normal';
        return 'warning';
      case 'oxygen':
        return value >= 95 ? 'normal' : 'low';
      default:
        return 'normal';
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="main-title">Health Data Integration Platform</h1>
          <p className="subtitle">Real-time vitals from Apple Watch, iPhone & HealthKit</p>
          {vitals.timestamp && (
            <p className="live-status">
              🔴 Live data stream • Last update: {vitals.timestamp.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Device Connection Status */}
        <div className="section">
          <h2 className="section-title">
            <Bluetooth className="section-icon" />
            Connected Devices & Data Sources
          </h2>
          <div className="devices-grid">
            <DeviceCard
              icon={Watch}
              name="Apple Watch Series 9"
              status={deviceStatus.appleWatch}
              lastSync={deviceStatus.appleWatch.lastSync}
              battery={deviceStatus.appleWatch.battery}
            />
            <DeviceCard
              icon={Smartphone}
              name="iPhone 15 Pro"
              status={deviceStatus.iPhone}
              lastSync={deviceStatus.iPhone.lastSync}
            />
            <div className="device-card">
              <div className="device-info">
                <div className="device-icon-name">
                  <Wifi className="device-icon connected" />
                  <div>
                    <p className="device-name">HealthKit API</p>
                    <p className="device-status connected-text">Active Connection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Stream Preview */}
        {dataStream.length > 0 && (
          <div className="section">
            <h3 className="section-title">Live Data Stream</h3>
            <div className="data-stream">
              <div className="stream-content">
                {dataStream.map((data, index) => (
                  <div key={index} className="stream-line">
                    [{data.time}] HR: {data.heartRate}bpm | SpO2: {data.oxygen}% | Source: Apple Watch
                  </div>
                ))}
                <div className="stream-listening">
                  [{new Date().toLocaleTimeString()}] Listening for new data...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overall Health Status */}
        <div className="health-status">
          <div className="status-card">
            <div className="status-content">
              <StatusIcon className={`status-icon ${condition.color}`} />
              <div className="status-text">
                <h2 className="status-title">
                  Health Status: {condition.status}
                </h2>
                <p className={`status-message ${condition.color}`}>{condition.message}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="vitals-grid">
          <VitalCard
            icon={Heart}
            title="Heart Rate"
            value={vitals.heartRate}
            unit=" BPM"
            status={getVitalStatus('heartRate', vitals.heartRate)}
            color="#ef4444"
            isLive={deviceStatus.appleWatch.connected}
          />
          <VitalCard
            icon={Moon}
            title="Sleep Duration"
            value={vitals.sleepHours}
            unit=" hrs"
            status={getVitalStatus('sleep', vitals.sleepHours)}
            color="#8b5cf6"
          />
          <VitalCard
            icon={Zap}
            title="Blood Oxygen"
            value={vitals.oxygenLevel}
            unit="%"
            status={getVitalStatus('oxygen', vitals.oxygenLevel)}
            color="#06b6d4"
            isLive={deviceStatus.appleWatch.connected}
          />
          <VitalCard
            icon={Activity}
            title="Steps Today"
            value={vitals.steps}
            unit=""
            status="normal"
            color="#10b981"
          />
        </div>

        {/* Sync Actions */}
        <div className="sync-section">
          <button
            onClick={syncWithDevices}
            disabled={loading}
            className="sync-button"
          >
            <RefreshCw className={`sync-icon ${syncAnimation ? 'spinning' : ''}`} />
            <span>{loading ? 'Syncing All Data Sources...' : 'Full Health Data Sync'}</span>
          </button>
          
          {loading && (
            <div className="sync-status">
              <div className="sync-steps">
                <p>🔄 Connecting to Apple HealthKit...</p>
                <p>⌚ Reading Apple Watch sensors...</p>
                <p>📱 Fetching iPhone motion data...</p>
                <p>💤 Processing sleep analytics...</p>
                <p>❤️ Analyzing heart rate variability...</p>
              </div>
            </div>
          )}
        </div>

        {/* Technical Integration Details */}
        <div className="integration-section">
          <div className="integration-card">
            <h3 className="integration-title">
              Data Integration Capabilities
            </h3>
            <div className="capabilities-grid">
              <div className="capability-item">
                <div className="capability-icon apple-watch">
                  <Watch className="icon" />
                </div>
                <h4 className="capability-title">Apple Watch</h4>
                <ul className="capability-list">
                  <li>• Real-time heart rate</li>
                  <li>• Blood oxygen levels</li>
                  <li>• ECG data</li>
                  <li>• Activity tracking</li>
                  <li>• Sleep monitoring</li>
                </ul>
              </div>
              <div className="capability-item">
                <div className="capability-icon iphone">
                  <Smartphone className="icon" />
                </div>
                <h4 className="capability-title">iPhone HealthKit</h4>
                <ul className="capability-list">
                  <li>• Health Records</li>
                  <li>• Medication tracking</li>
                  <li>• Motion data</li>
                  <li>• Third-party app data</li>
                  <li>• Manual health entries</li>
                </ul>
              </div>
              <div className="capability-item">
                <div className="capability-icon real-time">
                  <Wifi className="icon" />
                </div>
                <h4 className="capability-title">Real-time Sync</h4>
                <ul className="capability-list">
                  <li>• Live data streaming</li>
                  <li>• Background sync</li>
                  <li>• Multi-device support</li>
                  <li>• Cloud integration</li>
                  <li>• Secure data transfer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthApp;