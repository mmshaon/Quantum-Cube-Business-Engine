

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { UserRole } from '../types'; // Import UserRole

// Configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Conditional initialization
let app;
let authInstance: any;
let isMocking = true;

// Check if config is present to decide between Real vs Mock
if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('your_api_key')) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    isMocking = false;
  } catch (error) {
    console.warn("Firebase initialization failed, falling back to mock.", error);
  }
}

// --- Authentication Services ---

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  if (isMocking) {
    // Check local storage for mock session
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Ensure the role is explicitly cast to UserRole enum for type safety
      user.role = user.role as UserRole; 
      callback(user);
    } else {
      callback(null);
    }
    return () => {};
  } else {
    return onAuthStateChanged(authInstance, (user) => {
      // In a real app, you would fetch custom claims here or rely on them being in the ID token.
      // For this mock, we're adding a default role to the Firebase user object.
      if (user) {
        (user as any).role = UserRole.ADMIN; // Default role for authenticated users in real mode
      }
      callback(user);
    });
  }
};

export const signUp = async (email: string, pass: string, name: string) => {
  if (isMocking) {
    const mockUser = {
      uid: 'mock-' + Date.now(),
      email,
      displayName: name,
      photoURL: `https://ui-avatars.com/api/?name=${name}&background=00FFA3&color=05050F`,
      role: UserRole.ADMIN, // Assign default role for mock user
    };
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    // Reduced delay for better performance perception
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUser;
  }
  
  const userCredential = await createUserWithEmailAndPassword(authInstance, email, pass);
  await updateProfile(userCredential.user, {
    displayName: name,
    photoURL: `https://ui-avatars.com/api/?name=${name}&background=00FFA3&color=05050F`
  });
  // In a real app, after signup, you'd typically trigger a Cloud Function
  // to set custom claims for the user's role.
  (userCredential.user as any).role = UserRole.ADMIN; // Default role for new users in real mode
  return userCredential.user;
};

export const signIn = async (email: string, pass: string) => {
  if (isMocking) {
    // Allow any login in mock mode except strictly 'error' password
    if (pass === 'error') throw new Error("Invalid credentials");
    
    const mockUser = {
      uid: 'mock-user-123',
      email,
      displayName: 'Alpha User',
      photoURL: 'https://picsum.photos/200',
      role: UserRole.ADMIN, // Assign default role for mock user
    };
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    // Fast response
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUser;
  }

  const userCredential = await signInWithEmailAndPassword(authInstance, email, pass);
  // In a real app, after sign-in, the ID token would contain custom claims for roles.
  // For this mock, we're adding a default role.
  (userCredential.user as any).role = UserRole.ADMIN; // Default role for authenticated users in real mode
  return userCredential.user;
};

export const logout = async () => {
  if (isMocking) {
    localStorage.removeItem('mock_user');
    window.location.reload(); // Force refresh to clear state in mock mode
    return;
  }
  return firebaseSignOut(authInstance);
};

export const resetPassword = async (email: string) => {
  if (isMocking) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
  await sendPasswordResetEmail(authInstance, email);
};

// Export the auth instance for direct access if needed
export const auth = authInstance;