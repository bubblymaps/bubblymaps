import { execSync } from 'child_process';

function runTests() {
    try {
        console.log('Running TypeScript type check...');
        execSync('npm run typecheck', { stdio: 'inherit' });

        console.log('Type check passed!');

        return true;

    } catch (error) {

        console.log('Type check failed!');
        return false;
        
    }
}

const success = runTests();
process.exit(success ? 0 : 1);