const fs = require('fs');

// Fix login/page.tsx
let login = fs.readFileSync('src/app/login/page.tsx', 'utf8');
login = login.replace(/ required /g, ' ');
fs.writeFileSync('src/app/login/page.tsx', login);

// Fix register/page.tsx
let register = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Remove required attributes
register = register.replace(/ required /g, ' ');

// Add missing validation in handleRegister
const handleRegStart = `  async function handleRegister(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;`;

const validationCheck = `
    if (!email || !password || !firstName || !lastName) {
      redirect('/register?error=missing');
    }`;

register = register.replace(handleRegStart, handleRegStart + validationCheck);

// Add error UI in register
const errorExistsUI = `{resolvedSearchParams?.error === 'exists' && (`;
const missingErrorUI = `{resolvedSearchParams?.error === 'missing' && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold text-center">
                    {lang === 'en' ? 'Please fill out all fields.' : 'Vänligen fyll i alla fält.'}
                  </div>
                )}
                `;

register = register.replace(errorExistsUI, missingErrorUI + errorExistsUI);

fs.writeFileSync('src/app/register/page.tsx', register);
