import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Revert aggressive fixes
    content = content.replace(/catch \(_err\)/g, 'catch (err)');
    content = content.replace(/catch \(_e\)/g, 'catch (e)');
    content = content.replace(/const \[_loading, setLoading\] = useState/g, 'const [loading, setLoading] = useState');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
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
