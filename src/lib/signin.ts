import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "./firebase"; // Import the auth instance

interface SignInResult {
  result: UserCredential | null;
  error: Error | null;
}

export default async function SignUserIn(UserEmail: string, UserPassword: string): Promise<SignInResult> {
  console.log("Attempting to sign in with email:", UserEmail);

  let result: UserCredential | null = null;
  let error: Error | null = null;

  try {
    result = await signInWithEmailAndPassword(auth, UserEmail, UserPassword);
    console.log("Authentication successful:", result);
  } catch (e) {
    error = e instanceof Error ? e : new Error('Unknown error'); // Ensure the error is of type Error
    console.error("SignIn error occurred:", e);
  }

  return { result, error };
}