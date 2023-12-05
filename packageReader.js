const fs = require('fs');
const path = require('path');
function getContributors() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    return packageJson.contributors || [];
}
module.exports = { getContributors };