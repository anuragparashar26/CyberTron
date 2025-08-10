import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const ScanPage = () => {
  const { user, profile, updateProfile } = useAuth();
  const [urlToScan, setUrlToScan] = useState('');
  const [fileToScan, setFileToScan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  const updateScanHistory = async (scanEntry) => {
    const newHistory = [scanEntry, ...(profile.scan_history || [])].slice(0, 20); 
    const { error } = await supabase
      .from('profiles')
      .update({ scan_history: newHistory })
      .eq('id', user.id);
    if (!error) {
      updateProfile({ scan_history: newHistory });
    }
  };

  const handleUrlScan = async (e) => {
    e.preventDefault();
    if (!urlToScan) return;
    setLoading(true);
    setError('');
    setScanResult(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('virustotal-proxy', {
        body: { url: urlToScan },
      });
      if (funcError) throw funcError;
      setScanResult(data);
      await updateScanHistory({ type: 'URL', item: urlToScan, result: data.data.attributes.stats, date: new Date().toISOString() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileToScan(file);
    setLoading(true);
    setError('');
    setScanResult(null);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const { data, error: funcError } = await supabase.functions.invoke('virustotal-proxy', {
        body: { hash: hashHex },
      });
      if (funcError) throw funcError;
      setScanResult(data);
      await updateScanHistory({ type: 'File', item: file.name, result: data.data.attributes.last_analysis_stats, date: new Date().toISOString() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (result) => {
    const attributes = result.data?.attributes;
    if (attributes?.custom_status === 'not_found') {
      return <p className="text-primary-amber">File not found in VirusTotal's database. It has likely not been scanned before.</p>;
    }

    const stats = attributes?.stats || attributes?.last_analysis_stats;
    if (!stats) return <p>No analysis data found.</p>;
    return (
      <div className="mt-4 space-y-1">
        <p>Malicious: <span className="text-red-500">{stats.malicious}</span></p>
        <p>Suspicious: <span className="text-primary-amber">{stats.suspicious}</span></p>
        <p>Harmless/Undetected: <span className="text-primary-green">{stats.harmless + stats.undetected}</span></p>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl text-primary-green mb-4">[ File / URL Scanner ]</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* URL Scanner */}
        <div className="border border-primary-green/50 rounded-lg p-6 bg-black/30">
          <h2 className="text-xl text-primary-amber mb-4">Scan URL</h2>
          <form onSubmit={handleUrlScan}>
            <input
              type="text"
              value={urlToScan}
              onChange={(e) => setUrlToScan(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-2 bg-gray-900 border border-primary-green/30 rounded focus:outline-none focus:border-primary-green"
            />
            <button type="submit" disabled={loading} className="mt-4 w-full bg-primary-green text-dark-bg font-bold py-2 px-4 rounded hover:bg-primary-amber transition-colors disabled:bg-gray-600">
              {loading ? 'Scanning...' : 'Scan URL'}
            </button>
          </form>
        </div>

        {/* File Scanner */}
        <div className="border border-primary-green/50 rounded-lg p-6 bg-black/30">
          <h2 className="text-xl text-primary-amber mb-4">Scan File</h2>
          <input
            type="file"
            onChange={handleFileScan}
            disabled={loading}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-green/20 file:text-primary-green hover:file:bg-primary-green/40"
          />
          {fileToScan && <p className="text-xs mt-2">Selected: {fileToScan.name}</p>}
        </div>
      </div>

      {/* Results */}
      {(loading || error || scanResult) && (
        <div className="mt-8 border border-primary-green/50 rounded-lg p-6 bg-black/30">
          <h2 className="text-xl text-primary-amber mb-4">Scan Results</h2>
          {loading && <p className="animate-pulse">Scanning, please wait...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {scanResult && renderResult(scanResult)}
        </div>
      )}
    </div>
  );
};

export default ScanPage;
