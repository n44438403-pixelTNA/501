const fs = require('fs');

let code = fs.readFileSync('components/RevisionHub.tsx', 'utf8');

const regex = /                    let data: any = await storage\.getItem\(strictKey\);\n                    if \(!data\) \{\n                        \/\/ Parallel fallback fetching\n                        const \[cloudData, legacyData\] = await Promise\.all\(\[\n                            getChapterData\(strictKey\)\.catch\(\(\) => null\),\n                            getChapterData\(topic\.chapterId\)\.catch\(\(\) => null\)\n                        \]\);\n                        data = cloudData \|\| legacyData;\n                    \}/;

const fastFetch = `                    let data: any = await storage.getItem(strictKey);
                    if (!data) {
                        // Fast fetch: Only fetch strictKey from cloud first to avoid double network hits.
                        // We do not await legacy parallel unless strict fails to save massive network time.
                        data = await getChapterData(strictKey).catch(() => null);
                        if (!data) {
                             data = await getChapterData(topic.chapterId).catch(() => null);
                        }

                        // Cache it immediately so next render is 0ms
                        if (data) {
                            storage.setItem(strictKey, data).catch(() => {});
                        }
                    }`;

code = code.replace(regex, fastFetch);

// Also we should set loading state or just not wait
const startRegex = /const expandTopics = async \(\) => \{[\s\S]*?if \(isMounted\) setTopics\(processedTopics\);/;
const fastStart = `const expandTopics = async () => {
            if (isMounted) setTopics(processedTopics);
            // If there are too many topics (> 20), do not attempt to deep-expand all of them at once via network
            // as it will freeze the app. We just show chapter level.
            if (processedTopics.length > 20) return;`;

code = code.replace(startRegex, fastStart);

fs.writeFileSync('components/RevisionHub.tsx', code);
