import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Move fetch functions before useEffect
    // We'll look for useEffect(...) followed by const fetch... = async () => {...};
    // Due to varying regex complexity, we can be specific with the names caught in the lint report.
    const fnNames = ['fetchBookings', 'fetchFacilities', 'fetchComplaints', 'fetchUsers', 'fetchNotices', 'fetchStats', 'fetchBills'];

    for (let fn of fnNames) {
        const fnRegex = new RegExp(`(const ${fn} = async \\(\\).*?\\r?\\n[\\s\\S]*?\\r?\\n\\s*\\};)`, 'm');
        const effectRegex = new RegExp(`(useEffect\\(\\(\\) => \\{\\r?\\n\\s*${fn}\\(\\);\\r?\\n\\s*\\}, \\[\\]\\);)`, 'm');

        // Special case for Dashboard.jsx where multiple fetches are in one useEffect
        if (fn === 'fetchStats' || fn === 'fetchNotices' || fn === 'fetchBills') {
            // move them all before useEffect if possible
            const effectBlock = content.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[[^\]]*\]\);/);
            const fnBlock = content.match(fnRegex);
            if (effectBlock && fnBlock && content.indexOf(fnBlock[0]) > content.indexOf(effectBlock[0])) {
                content = content.replace(fnBlock[0], ''); // remove fn
                content = content.replace(effectBlock[0], fnBlock[0] + '\n\n  ' + effectBlock[0]); // insert before
            }
        } else {
            const effectMatch = content.match(effectRegex);
            const fnMatch = content.match(fnRegex);
            if (effectMatch && fnMatch && content.indexOf(fnMatch[0]) > content.indexOf(effectMatch[0])) {
                content = content.replace(fnMatch[0], '');
                content = content.replace(effectMatch[0], fnMatch[0] + '\n\n  ' + effectMatch[0]);
            }
        }
    }

    // 2. Fix empty catch (err) -> catch (err) can just be catch { ... } OR suppress unused vars
    // Replace `catch (err) {` with `catch {` if they don't use it, but older node might complain.
    // Instead, replace unused catch parameters.
    // We'll just replace `catch (err)` with `catch (_err)` and same for `catch (e)`.
    content = content.replace(/catch \(err\)/g, 'catch (_err)');
    content = content.replace(/catch \(e\)/g, 'catch (_e)');

    // 3. Fix unused 'loading' state
    // const [loading, setLoading] = useState(...) -> if loading is not used.
    // We can just leave it or prefix with `_`
    content = content.replace(/const \[loading, setLoading\] = useState/g, 'const [_loading, setLoading] = useState');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', path.basename(filePath));
    }
}

function walk(dir) {
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
        else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) fixFile(fullPath);
    }
}

walk(srcDir);
