import { scanUrl, scanFile, uploadAndScanFile } from '../api/virusTotal';

export const createSecurityCommands = (gameState, updateGameState) => {
    const loadingFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let frameIndex = 0;

    const scanCommand = async (args) => {
        if (args.length < 2) {
            return ["Usage: scan --url <url> | scan --file <filename>"];
        }

        const option = args[0];
        const target = args[1];

        if (!import.meta.env.VITE_VIRUSTOTAL_API_KEY) {
            return [
                "❌ VirusTotal API key not configured",
                "Please set VITE_VIRUSTOTAL_API_KEY in your .env file",
                "Or use: config virustotal <your-api-key>"
            ];
        }

        try {
            if (option === '--url') {
                updateGameState.updateLastLine('⌛ Scanning URL...');
                const result = await scanUrl(target);

                if (!result) {
                    return [
                        "❌ Scan failed",
                        "Check your API key or try again later"
                    ];
                }

                updateGameState.addScore(5);
                return [
                    `🔍 Scanning URL: ${target}`,
                    "═══════════════════════════════",
                    `Scan Date: ${result.scanDate}`,
                    `Detection ratio: ${result.positives}/${result.total}`,
                    "",
                    result.positives > 0 ? "⚠️ Threats detected!" : "✅ URL appears safe",
                    "",
                    "✨ +5 points earned!"
                ];
            } else if (option === '--file') {
                return await simulateFileScan(target);
            } else {
                return ["Invalid scan option. Use --url or --file"];
            }
        } catch (error) {
            return [
                "❌ Scan failed",
                error.message,
                "Please check your API key and try again"
            ];
        }
    };

    const simulateUrlScan = async (url) => {
        const result = await scanUrl(url);

        if (!result) {
            return [
                "❌ Scan failed. Using fallback simulation.",
                "Check your API key or internet connection."
            ];
        }

        updateGameState.addScore(5);
        updateGameState.addScanHistory({ type: 'url', target: url, result });

        if (!gameState.badges.includes('First Scan')) {
            updateGameState.awardBadge('First Scan');
        }

        const isClean = result.positives === 0;

        return [
            `🔍 Scanning URL: ${url}`,
            "═══════════════════════════════",
            `Scan Date: ${result.scanDate}`,
            `Detection ratio: ${result.positives}/${result.total} security vendors`,
            "",
            isClean ? "✅ No threats detected" : `⚠️ URL was flagged as suspicious`,
            `Status: ${isClean ? 'CLEAN' : 'SUSPICIOUS'}`,
            "",
            "✨ +5 points earned!"
        ];
    };

    const simulateFileScan = async (filename) => {
        let fileInput = document.getElementById('vtFileInput');
        if (!fileInput) {
            fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'vtFileInput';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
        }

        try {
            return new Promise((resolve) => {
                fileInput.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) {
                        resolve([
                            "❌ No file selected",
                            "Try again with a valid file"
                        ]);
                        return;
                    }

                    try {
                        updateGameState.updateLastLine(`⏳ Uploading ${file.name}...`);
                        const result = await uploadAndScanFile(file);

                        updateGameState.addScore(10);
                        const isClean = result.positives === 0;
                        const status = result.status === 'Analysis in progress' ? '⏳ Analysis in progress...' : (isClean ? "✅ File appears clean" : "🚨 Malware detected");

                        resolve([
                            `🔍 Scanning file: ${file.name}`,
                            "═══════════════════════════════",
                            `File size: ${file.size} bytes`,
                            `MD5: ${result.md5}`,
                            `SHA1: ${result.sha1}`,
                            `SHA256: ${result.sha256}`,
                            `Scan Date: ${result.scanDate}`,
                            result.status === 'Analysis in progress' ?
                                '⏳ Analysis is still in progress...' :
                                `Detection ratio: ${result.positives}/${result.total} security vendors`,
                            "",
                            status,
                            "",
                            "✨ +10 points earned!"
                        ]);
                    } catch (error) {
                        resolve([
                            "❌ Scan failed",
                            error.message,
                            "Try with a smaller file or check your internet connection"
                        ]);
                    }
                };

                fileInput.click();
            });
        } finally {
            if (fileInput) {
                fileInput.remove();
            }
        }
    };

    const analyzeCommand = (args) => {
        if (args.length === 0) {
            return ["Usage: analyze <filename>"];
        }

        const filename = args[0];
        updateGameState.addScore(15);

        return [
            `🔬 Malware Analysis: ${filename}`,
            "═══════════════════════════════",
            "File Properties:",
            `  Size: ${Math.floor(Math.random() * 1000000)} bytes`,
            `  MD5: ${generateMockHash('md5')}`,
            `  SHA1: ${generateMockHash('sha1')}`,
            "",
            "Strings Analysis:",
            "  - CreateFileA",
            "  - WriteFile",
            "  - RegSetValueEx",
            "  - cmd.exe",
            "",
            "Behavior Analysis:",
            "  ⚠️  File system modification detected",
            "  ⚠️  Registry modification detected",
            "  ⚠️  Network communication attempted",
            "",
            "Verdict: SUSPICIOUS - Manual review recommended",
            "✨ +15 points earned!"
        ];
    };

    const bruteforceCommand = (args) => {
        if (args.length < 2) {
            return ["Usage: bruteforce --type <hash|password> <target>"];
        }

        const type = args[1];
        const target = args[2];

        return simulateBruteforce(type, target);
    };

    const encryptCommand = (args) => {
        if (args.length < 3) {
            return ["Usage: encrypt --algo <aes|des|rsa> <text>"];
        }

        const algo = args[1];
        const text = args.slice(2).join(' ');

        return simulateEncryption(algo, text);
    };

    const sniffCommand = (args) => {
        if (args.length < 2) {
            return ["Usage: sniff --interface <eth0|wlan0>"];
        }

        return simulatePacketSniffing(args[1]);
    };


    return {
        scan: scanCommand,
        analyze: analyzeCommand,
        bruteforce: bruteforceCommand,
        encrypt: encryptCommand,
        sniff: sniffCommand
    };
};

const simulateBruteforce = (type, target) => {
    const attempts = Math.floor(Math.random() * 1000000);
    const timeElapsed = Math.floor(Math.random() * 60);

    return [
        `🔓 Bruteforce attack simulation on ${target}`,
        "═══════════════════════════════",
        `Attack type: ${type.toUpperCase()}`,
        `Attempts: ${attempts.toLocaleString()}`,
        `Time elapsed: ${timeElapsed}s`,
        `Status: ${Math.random() > 0.5 ? '✅ Success!' : '❌ Failed'}`,
        "",
        "⚠️ This is a simulation for educational purposes only"
    ];
};

const generateMockHash = (algo) => {
    const lengths = { md5: 32, sha1: 40, sha256: 64 };
    const length = lengths[algo] || 32;
    return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};