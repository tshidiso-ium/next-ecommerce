import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "./firebase"; // Import the Firebase auth instance

interface RegisterResult {
	result: UserCredential | null;
	error: Error | null;
}

export default async function RegisterUser(
	UserEmail: string,
	UserPassword: string
): Promise<RegisterResult> {
	console.log("Attempting to register with email:", UserEmail);

	let result: UserCredential | null = null;
	let error: Error | null = null;

	try {
		result = await createUserWithEmailAndPassword(
			auth,
			UserEmail,
			UserPassword
		);
		console.log("Registration successful:", result);
	} catch (e) {
		error = e instanceof Error ? e : new Error("Unknown error"); // Ensure the error is of type Error
		console.error("Registration error occurred:", e);
	}

	return { result, error };
}
