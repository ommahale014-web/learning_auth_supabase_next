# Secret Notes App - Setup Instructions

This is a Next.js application with Supabase authentication. The UI is already implemented. Follow these steps to complete the project.

## Prerequisites

- Node.js installed
- A Supabase project (create one at [supabase.com](https://supabase.com))

---

## Step 1: Add Environment Variables

1. Create a `.env.local` file in the root directory of the project (if it doesn't exist)

2. Add the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. To get these values:
   - Go to your Supabase project dashboard
   - Navigate to **Settings** → **API**
   - Copy the **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the **anon/public** key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Important:** Never commit `.env.local` to version control. It should already be in `.gitignore`.

---

## Step 2: Implement Sign In and Sign Up Functions

Navigate to `src/app/login/page.jsx` and implement the authentication functions.

### 2.1 Implement `handleSignIn` function

Replace the placeholder `handleSignIn` function with:

```javascript
async function handleSignIn() {
  try {
    setError('')
    
    // Sign in the user
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(`❌ ${signInError.message}`)
      return
    }

    // Show success message
    setError('✅ Sign in successful! Redirecting...')
    
    // Redirect to dashboard
    window.location.href = '/dashboard'
  } catch (err) {
    setError(`❌ An error occurred: ${err.message}`)
  }
}
```

### 2.2 Implement `handleSignUp` function

Replace the placeholder `handleSignUp` function with:

```javascript
async function handleSignUp() {
  try {
    setError('')
    
    // Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      // Show error message if user already exists or other error
      setError(`❌ ${signUpError.message}`)
      return
    }

    // Show success message
    setError('✅ Sign up successful! Redirecting...')
    
    // Redirect to dashboard
    window.location.href = '/dashboard'
  } catch (err) {
    setError(`❌ An error occurred: ${err.message}`)
  }
}
```

**Note:** You'll also need to add the `useRouter` import from `next/navigation` if you prefer using Next.js router instead of `window.location.href`:

```javascript
import { useRouter } from 'next/navigation'

// Then in the component:
const router = useRouter()

// And in the functions, replace window.location.href with:
router.push('/dashboard')
```

---

## Step 3: Implement Logout Functionality

Navigate to `src/app/dashboard/actions.js` and implement the logout server action.

Replace the placeholder `logout` function with:

```javascript
export async function logout() {
  const supabase = await createClient()
  
  // Sign out the user
  await supabase.auth.signOut()
  
  // Redirect to the login page
  redirect('/login')
}
```

The logout button in the dashboard is already connected to this server action via a form, so no additional UI changes are needed.

---

## Step 4: (Optional) Complete Dashboard User Authentication Check

The dashboard page (`src/app/dashboard/page.jsx`) has placeholder code for checking if a user is authenticated. You can implement it as follows:

```javascript
export default async function Dashboard() {
  const supabase = await createClient()
  
  // Get the user from the database
  const { data: { user }, error } = await supabase.auth.getUser()

  // If the user is not found, redirect to the login page
  if (error || !user) {
    redirect('/login')
  }

  // If the user is found, show the dashboard
  return (
    // ... rest of the component
    <p style={{...}}>
      {user?.email || 'User'}
    </p>
    // ... rest of the component
  )
}
```

---

## Running the Application

1. Install dependencies (if not already installed):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Project Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.jsx          # Login/Signup page (implement signin/signup here)
│   ├── dashboard/
│   │   ├── page.jsx          # Dashboard page
│   │   └── actions.js        # Server actions (implement logout here)
│   └── page.js               # Home page
└── lib/
    └── supabase/
        ├── client.js         # Client-side Supabase client
        └── server.js         # Server-side Supabase client
```

---

## Summary

✅ **Step 1:** Add environment variables to `.env.local`  
✅ **Step 2:** Implement `handleSignIn` and `handleSignUp` in `src/app/login/page.jsx`  
✅ **Step 3:** Implement `logout` function in `src/app/dashboard/actions.js`  
✅ **Step 4:** (Optional) Complete user authentication check in dashboard  

The UI is already implemented and ready to use once you complete these steps!

---

## Troubleshooting

- **"Invalid API key"**: Make sure your environment variables are correctly set in `.env.local`
- **"User already registered"**: This is expected behavior - use the Sign In button instead
- **Redirect not working**: Make sure you're using `window.location.href` or `router.push()` correctly
- **Server action errors**: Ensure the `logout` function is marked with `"use server"` directive
