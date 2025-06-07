const VT_API_KEY = import.meta.env.VITE_VIRUSTOTAL_API_KEY;

const vtRequest = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`https://www.virustotal.com/api/v3${endpoint}`, {
            ...options,
            headers: {
                'x-apikey': VT_API_KEY,
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`VirusTotal API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('VT Request error:', error);
        throw error;
    }
};

export const scanUrl = async (url) => {
    try {

        const scanResponse = await vtRequest('/urls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `url=${encodeURIComponent(url)}`
        });


        await new Promise(resolve => setTimeout(resolve, 3000));


        const result = await vtRequest(`/analyses/${scanResponse.data.id}`);
        return {
            positives: result.data.attributes.stats.malicious,
            total: result.data.attributes.stats.total,
            scanDate: new Date().toISOString(),
            status: result.data.attributes.status
        };
    } catch (error) {
        console.error('Scan error:', error);
        throw new Error('URL scan failed. Check your API key and try again.');
    }
};

export const scanFile = async (hash) => {
    try {
        const result = await vtRequest(`/files/${hash}`);
        return formatFileResult(result.data.attributes);
    } catch (error) {
        console.error('VirusTotal file lookup error:', error);
        return null;
    }
};

export const uploadAndScanFile = async (file) => {
    try {

        const urlResponse = await vtRequest('/files/upload_url');
        const uploadUrl = urlResponse.data.url;


        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading file:', file.name);


        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'x-apikey': VT_API_KEY
            },
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }

        const uploadData = await uploadResponse.json();
        console.log('Upload response:', uploadData);


        await new Promise(resolve => setTimeout(resolve, 5000));

        const analysisId = uploadData.data.id;
        const result = await vtRequest(`/analyses/${analysisId}`);

        if (result.data.attributes.status === 'queued') {
            return {
                md5: result.data.attributes.md5 || 'Processing',
                sha1: result.data.attributes.sha1 || 'Processing',
                sha256: result.data.attributes.sha256 || 'Processing',
                scanDate: new Date().toISOString(),
                positives: 0,
                total: 0,
                scans: {},
                status: 'Analysis in progress'
            };
        }

        return formatFileResult(result.data.attributes);
    } catch (error) {
        console.error('File upload error:', error);
        throw new Error(`File scan failed: ${error.message}`);
    }
};

const formatUrlResult = (attributes) => ({
    positives: attributes.last_analysis_stats.malicious,
    total: Object.keys(attributes.last_analysis_results).length,
    scans: attributes.last_analysis_results,
    scanDate: attributes.last_analysis_date,
    reputation: attributes.reputation,
    categories: attributes.categories
});

const formatFileResult = (attributes) => ({
    positives: attributes.last_analysis_stats.malicious,
    total: Object.keys(attributes.last_analysis_results).length,
    scans: attributes.last_analysis_results,
    scanDate: attributes.last_analysis_date,
    md5: attributes.md5,
    sha1: attributes.sha1,
    sha256: attributes.sha256,
    type: attributes.type_description,
    size: attributes.size
});
