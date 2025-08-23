// Script to change user role to trial for testing OptimizedTrialUserDashboard
console.log('Current role:', localStorage.getItem('dev.role'));
localStorage.setItem('dev.role', 'trial');
console.log('Changed role to:', localStorage.getItem('dev.role'));
// Trigger the dev state change event
window.dispatchEvent(new Event('dev:role-changed'));
console.log('Role change event triggered. The page should update automatically.');
